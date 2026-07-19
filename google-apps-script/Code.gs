/**
 * LingoDaily — Google Sheets เป็นฐานข้อมูล (backend ผ่าน Google Apps Script Web App)
 *
 * วิธีติดตั้ง (ทำครั้งเดียว):
 *  1) สร้าง Google Sheet ใหม่ 1 ไฟล์ (ตั้งชื่ออะไรก็ได้ เช่น "LingoDaily DB")
 *  2) เมนู Extensions → Apps Script  แล้ววางโค้ดทั้งไฟล์นี้ทับของเดิม
 *  3) แก้ SECRET ด้านล่างเป็นข้อความสุ่มยาว ๆ ของคุณเอง
 *  4) กด Deploy → New deployment → เลือก type "Web app"
 *        - Execute as: Me
 *        - Who has access: Anyone
 *     คัดลอก URL ที่ได้ (ลงท้ายด้วย /exec)
 *  5) เอา URL นั้นไปใส่ใน .env ของเว็บเป็น  VITE_SHEETS_API_URL=...
 *
 * แท็บ (sheet) จะถูกสร้างอัตโนมัติเมื่อมีการใช้งานครั้งแรก:
 *   users, srs_progress, unit_progress, daily_stats
 */

var SECRET = 'CHANGE_ME_ตั้งข้อความสุ่มยาวๆของคุณเอง'

var HEADERS = {
  users: ['email', 'passwordHash', 'token', 'createdAt'],
  srs_progress: ['email', 'itemId', 'lang', 'ease', 'intervalDays', 'repetitions', 'lapses', 'dueAt', 'lastReviewedAt'],
  unit_progress: ['email', 'unitId', 'status', 'bestScore', 'completedAt'],
  daily_stats: ['email', 'date', 'xp', 'reviewsDone', 'newItems', 'minutes'],
}

function doGet(e) {
  return handle(e && e.parameter ? e.parameter : {}, null)
}

function doPost(e) {
  var body = {}
  try {
    body = JSON.parse(e.postData.contents)
  } catch (err) {
    body = {}
  }
  return handle(body, body)
}

function handle(params, postBody) {
  var action = params.action
  try {
    if (action === 'ping') return json({ ok: true, service: 'lingodaily-sheets' })
    if (action === 'register') return register(params)
    if (action === 'login') return login(params)
    if (action === 'pull') return pull(params)
    if (action === 'push') return push(postBody || params)
    return json({ ok: false, error: 'unknown-action' })
  } catch (err) {
    return json({ ok: false, error: String(err) })
  }
}

// ---------- auth ----------

function tokenFor(email, passwordHash) {
  return sha256(email + '|' + passwordHash + '|' + SECRET)
}

function register(p) {
  var email = normEmail(p.email)
  var password = String(p.password || '')
  if (!email || password.length < 6) return json({ ok: false, error: 'invalid-input' })
  var lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    var sheet = tab('users')
    var rows = sheet.getDataRange().getValues()
    for (var i = 1; i < rows.length; i++) {
      if (normEmail(rows[i][0]) === email) return json({ ok: false, error: 'email-exists' })
    }
    var passwordHash = sha256(password + '|' + SECRET)
    var token = tokenFor(email, passwordHash)
    sheet.appendRow([email, passwordHash, token, new Date().toISOString()])
    return json({ ok: true, email: email, token: token })
  } finally {
    lock.releaseLock()
  }
}

function login(p) {
  var email = normEmail(p.email)
  var password = String(p.password || '')
  var sheet = tab('users')
  var rows = sheet.getDataRange().getValues()
  var passwordHash = sha256(password + '|' + SECRET)
  for (var i = 1; i < rows.length; i++) {
    if (normEmail(rows[i][0]) === email) {
      if (String(rows[i][1]) === passwordHash) {
        return json({ ok: true, email: email, token: tokenFor(email, passwordHash) })
      }
      return json({ ok: false, error: 'bad-credentials' })
    }
  }
  return json({ ok: false, error: 'bad-credentials' })
}

function authorize(email, token) {
  email = normEmail(email)
  var rows = tab('users').getDataRange().getValues()
  for (var i = 1; i < rows.length; i++) {
    if (normEmail(rows[i][0]) === email && String(rows[i][2]) === String(token)) return true
  }
  return false
}

// ---------- data ----------

function pull(p) {
  var email = normEmail(p.email)
  if (!authorize(email, p.token)) return json({ ok: false, error: 'unauthorized' })
  return json({
    ok: true,
    cards: rowsForUser('srs_progress', email),
    units: rowsForUser('unit_progress', email),
    daily: rowsForUser('daily_stats', email),
  })
}

function push(p) {
  var email = normEmail(p.email)
  if (!authorize(email, p.token)) return json({ ok: false, error: 'unauthorized' })
  var lock = LockService.getScriptLock()
  lock.waitLock(20000)
  try {
    replaceUserRows('srs_progress', email, p.cards || [])
    replaceUserRows('unit_progress', email, p.units || [])
    replaceUserRows('daily_stats', email, p.daily || [])
    return json({ ok: true })
  } finally {
    lock.releaseLock()
  }
}

/** แทนที่ทุกแถวของผู้ใช้คนนี้ในแท็บด้วยชุดข้อมูลใหม่ (upsert แบบยกชุด) */
function replaceUserRows(name, email, records) {
  var sheet = tab(name)
  var header = HEADERS[name]
  var data = sheet.getDataRange().getValues()
  var kept = [header]
  for (var i = 1; i < data.length; i++) {
    if (normEmail(data[i][0]) !== email) kept.push(data[i])
  }
  for (var j = 0; j < records.length; j++) {
    var rec = records[j]
    var row = []
    for (var k = 0; k < header.length; k++) {
      row.push(k === 0 ? email : rec[header[k]] === undefined || rec[header[k]] === null ? '' : rec[header[k]])
    }
    kept.push(row)
  }
  sheet.clearContents()
  if (kept.length > 0) sheet.getRange(1, 1, kept.length, header.length).setValues(kept)
}

function rowsForUser(name, email) {
  var sheet = tab(name)
  var header = HEADERS[name]
  var data = sheet.getDataRange().getValues()
  var out = []
  for (var i = 1; i < data.length; i++) {
    if (normEmail(data[i][0]) !== email) continue
    var obj = {}
    for (var k = 0; k < header.length; k++) obj[header[k]] = data[i][k]
    out.push(obj)
  }
  return out
}

// ---------- helpers ----------

function tab(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(name)
  if (!sheet) {
    sheet = ss.insertSheet(name)
    sheet.getRange(1, 1, 1, HEADERS[name].length).setValues([HEADERS[name]])
  } else if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS[name].length).setValues([HEADERS[name]])
  }
  return sheet
}

function normEmail(v) {
  return String(v || '').trim().toLowerCase()
}

function sha256(str) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, str, Utilities.Charset.UTF_8)
  var hex = ''
  for (var i = 0; i < bytes.length; i++) {
    var b = (bytes[i] + 256) % 256
    hex += ('0' + b.toString(16)).slice(-2)
  }
  return hex
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

# 🌏 LingoDaily

เว็บแอปฝึก **ภาษาอังกฤษ (CEFR)** และ **ภาษาจีน (HSK)** ทุกวัน ครบทั้ง 4 ทักษะ —
อ่าน เขียน ฟัง พูด — ออกแบบรอบ "วงจรฝึกรายวัน" (daily loop) เพื่อพาไปถึงระดับสูงแบบเจ้าของภาษา

**🔗 เว็บใช้งานจริง: https://lingodaily-web.vercel.app**
(เปิดใช้ได้เลยในโหมด Guest — จะเชื่อม Google Sheets เพื่อบันทึกข้ามอุปกรณ์ก็ทำได้ในหน้า Login)

สร้างด้วย React 19 + Vite + TypeScript + Tailwind + Zustand

## ฟีเจอร์

- **แดชบอร์ดรายวัน** — streak, เป้า XP, คิวคำที่ถึงกำหนดทบทวน และ heatmap 3 เดือน
- **เส้นทางบทเรียน** — หลักสูตร CEFR (A1–A2) และ HSK (1–2) เป็นบทปลดล็อกตามลำดับ
  แต่ละบท: แนะนำคำศัพท์ → จับคู่ → ทดสอบท้ายบท
- **ทบทวนแบบ Spaced Repetition (SM-2)** — สุ่มรูปแบบโจทย์ flashcard / เลือกตอบ / ฟัง-พิมพ์
- **ฝึกพูด** — ฟังเสียงเจ้าของภาษา (Text-to-Speech) แล้วพูดตาม ระบบรู้จำเสียง (Speech Recognition)
  ให้คะแนนการออกเสียงเป็น % พร้อมไฮไลต์คำที่ยังไม่ตรง
- **ฝึกเขียน** — ฟัง-พิมพ์ตามคำบอก, แปลประโยคไทย→เป้าหมาย และ **เขียนอักษรจีนตามลำดับขีด** (hanzi-writer)
- **ฝึกอ่าน** — บทความตามระดับ แตะคำเพื่อดูคำแปล/พินอิน + ฟังเสียงทั้งบท + แบบทดสอบความเข้าใจ
- **เกมิฟิเคชัน** — XP, streak รายวัน, เหรียญตรา (7/30/100 วันติด, ครบ 100/500/1000 คำ)
- **ระบบสมาชิก + ฐานข้อมูล** — เข้าสู่ระบบแล้วซิงก์ความคืบหน้าข้ามอุปกรณ์ ผ่าน **Google Sheets**
  (แนะนำ) หรือ Supabase หรือใช้ **โหมด Guest** (เก็บในเครื่อง) โดยไม่ต้องตั้งค่าอะไร

> คำแปลและคำอธิบายทั้งหมดเป็น **ภาษาไทย** — UI ออกแบบสำหรับผู้เรียนคนไทยและเน้นใช้บนมือถือ

## เริ่มต้นใช้งาน

```bash
npm install
npm run dev
```

เปิด http://localhost:5173 แล้วกด **"ใช้แบบไม่ login (Guest)"** เพื่อเริ่มเรียนได้ทันที
โดยไม่ต้องตั้งค่าอะไรเพิ่ม (ข้อมูลจะเก็บใน localStorage ของเบราว์เซอร์)

> การฝึกพูดต้องใช้เบราว์เซอร์ที่รองรับ Web Speech API — แนะนำ **Google Chrome** หรือ **Microsoft Edge**
> และต้องอนุญาตสิทธิ์ไมโครโฟน ส่วนการเขียนอักษรจีนต้องต่ออินเทอร์เน็ต (โหลดข้อมูลเส้นอักษรจาก CDN)

## เชื่อม Google Sheets เป็นฐานข้อมูล (แนะนำ — ไม่บังคับ, ข้ามได้ถ้าใช้ Guest)

ใช้ Google Sheet ของคุณเองเป็นฐานข้อมูล ผ่าน **Google Apps Script Web App** — ฟรี ไม่ต้องมีเซิร์ฟเวอร์
และไม่ต้องเก็บ secret ใด ๆ ไว้ในเว็บ

1. สร้าง **Google Sheet** ใหม่ 1 ไฟล์ (ตั้งชื่ออะไรก็ได้)
2. เมนู **Extensions → Apps Script** แล้ววางโค้ดทั้งไฟล์ [`google-apps-script/Code.gs`](google-apps-script/Code.gs)
   ทับของเดิม จากนั้นแก้บรรทัด `SECRET` เป็นข้อความสุ่มยาว ๆ ของคุณเอง
3. กด **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**

   คัดลอก URL ที่ได้ (ลงท้ายด้วย `/exec`)
4. นำ URL ไปใช้ทางใดทางหนึ่ง:
   - **บนเว็บที่ deploy แล้ว** — เปิดแอป → หน้า Login → กด "เชื่อมต่อ Google Sheets เป็นฐานข้อมูล"
     → วาง URL → บันทึก (ไม่ต้อง build ใหม่)
   - **ตอนพัฒนา/ตอน build** — ใส่ในไฟล์ `.env.local` (คัดลอกจาก `.env.example`):

     ```env
     VITE_SHEETS_API_URL=https://script.google.com/macros/s/.../exec
     ```

5. สมัคร/เข้าสู่ระบบด้วยอีเมล — ความคืบหน้าจะถูกบันทึกลงชีต (แท็บ `srs_progress`, `unit_progress`,
   `daily_stats` สร้างอัตโนมัติ) แบบ offline-first: บันทึกในเครื่องก่อนแล้วซิงก์ขึ้นชีตให้เอง

> รหัสผ่านถูกเก็บเป็นค่าแฮช (SHA-256) ในชีต เหมาะกับแอปส่วนตัว — สำหรับใช้จริงหลายคน แนะนำ Supabase

### ทางเลือก: Supabase แทน Google Sheets

สร้างโปรเจกต์ฟรีที่ [supabase.com](https://supabase.com), รัน [`supabase/schema.sql`](supabase/schema.sql)
ใน SQL Editor, แล้วใส่ `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` ใน `.env.local`
(ถ้าตั้งค่า Google Sheets ไว้ด้วย ระบบจะใช้ Google Sheets ก่อน)

## Deploy ขึ้น Vercel

แอปนี้ build เป็น **ไฟล์ HTML ไฟล์เดียว** (`dist/index.html`) โฮสต์เป็น static site ที่ไหนก็ได้ รวมถึง Vercel:

- **วิธีที่ง่ายที่สุด (แนะนำ, auto-deploy)** — ที่ Vercel กด **Add New → Project → Import Git Repository**
  แล้วเลือก repo นี้ Vercel จะตรวจเจอ Vite เอง (Build: `npm run build`, Output: `dist`)
  และ deploy ใหม่อัตโนมัติทุกครั้งที่ push โค้ด
- ถ้าต้องการเปิด Google Sheets แบบ build-time ให้เพิ่ม Environment Variable `VITE_SHEETS_API_URL`
  ใน Vercel (Project → Settings → Environment Variables) แล้ว redeploy — หรือจะข้ามขั้นนี้แล้วไปวาง URL
  ในหน้า Login ของเว็บที่ deploy แล้วก็ได้ (เก็บในเบราว์เซอร์ของคุณ)

เพราะแอปใช้ **HashRouter** ทุกเส้นทางอยู่หลัง `#` จึงไม่ต้องตั้ง rewrite ใด ๆ บน Vercel

> หมายเหตุ: เว็บตัวอย่าง https://lingodaily-web.vercel.app ที่ deploy ไว้ให้ ตรึงไว้กับโค้ดเวอร์ชันหนึ่ง —
> ถ้าอยากให้เว็บอัปเดตอัตโนมัติเมื่อแก้โค้ด ให้เชื่อม Vercel กับ GitHub repo ตามวิธีแรก

## สคริปต์

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | รันเซิร์ฟเวอร์พัฒนา |
| `npm run build` | ตรวจชนิดข้อมูลและ build เป็นไฟล์ static (`dist/`) — รวมเป็น `index.html` ไฟล์เดียว |
| `npm run preview` | เปิดดูผลลัพธ์ที่ build แล้ว |
| `npm run lint` | ตรวจ ESLint |

## โครงสร้างเนื้อหา / เพิ่มระดับ

เนื้อหาบทเรียนอยู่ใน `src/data/content/` เป็นไฟล์ TypeScript ที่สร้างจาก `builder.ts`
เพิ่มระดับใหม่ (เช่น B1 หรือ HSK 3) ได้โดยเพิ่มไฟล์ตามรูปแบบเดิมแล้วลงทะเบียนใน `src/data/content/index.ts`
โครงสร้างรองรับการขยายไปถึง C2 / HSK 6

## เทคโนโลยี

- **UI**: React 19, React Router, Tailwind CSS, lucide-react
- **State**: Zustand (+ `persist` สำหรับ offline/guest)
- **เสียง**: Web Speech API (`speechSynthesis` + `SpeechRecognition`)
- **เขียนจีน**: hanzi-writer
- **Backend (ไม่บังคับ)**: Google Sheets ผ่าน Apps Script Web App (แนะนำ) หรือ Supabase (Auth + Postgres + RLS)
- **อัลกอริทึมทบทวน**: SM-2 (`src/lib/srs.ts`)

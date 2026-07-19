import { buildEnPack } from './builder'

export const enA1 = buildEnPack(
  'A1',
  'CEFR A1 — เริ่มต้น',
  'คำศัพท์และประโยคพื้นฐานสำหรับชีวิตประจำวัน แนะนำตัว ถาม-ตอบเรื่องใกล้ตัว',
  [
    {
      title: 'Greetings & Introductions',
      titleTh: 'ทักทายและแนะนำตัว',
      grammarNote:
        'ประโยคแนะนำตัวใช้ Verb to be: I am (ฉันเป็น/คือ), You are, He/She is เช่น "I am Tom." = ฉันชื่อทอม และใช้ "My name is..." เพื่อบอกชื่อได้เช่นกัน',
      rows: [
        ['hello', 'interjection', 'สวัสดี', 'Hello! How are you?', 'สวัสดี! คุณสบายดีไหม'],
        ['good morning', 'phrase', 'สวัสดีตอนเช้า', 'Good morning, everyone.', 'สวัสดีตอนเช้าทุกคน'],
        ['goodbye', 'interjection', 'ลาก่อน', 'Goodbye! See you tomorrow.', 'ลาก่อน! เจอกันพรุ่งนี้'],
        ['thank you', 'phrase', 'ขอบคุณ', 'Thank you for your help.', 'ขอบคุณสำหรับความช่วยเหลือ'],
        ['please', 'adverb', 'ได้โปรด/กรุณา', 'Please sit down.', 'กรุณานั่งลง'],
        ['sorry', 'adjective', 'ขอโทษ/เสียใจ', 'Sorry, I am late.', 'ขอโทษครับ ผมมาสาย'],
        ['name', 'noun', 'ชื่อ', 'My name is Anna.', 'ฉันชื่อแอนนา'],
        ['nice', 'adjective', 'ดี/น่ายินดี', 'Nice to meet you.', 'ยินดีที่ได้รู้จัก'],
      ],
    },
    {
      title: 'Numbers & Age',
      titleTh: 'ตัวเลขและอายุ',
      grammarNote:
        'ถามอายุใช้ "How old are you?" ตอบว่า "I am ... years old." ถามจำนวนใช้ How many + คำนามพหูพจน์ เช่น "How many brothers do you have?"',
      rows: [
        ['number', 'noun', 'ตัวเลข/หมายเลข', 'What is your phone number?', 'เบอร์โทรศัพท์ของคุณคืออะไร'],
        ['age', 'noun', 'อายุ', 'What is your age?', 'คุณอายุเท่าไร'],
        ['year', 'noun', 'ปี', 'There are twelve months in a year.', 'หนึ่งปีมีสิบสองเดือน'],
        ['old', 'adjective', 'แก่/มีอายุ', 'I am twenty years old.', 'ฉันอายุยี่สิบปี'],
        ['many', 'determiner', 'มาก/หลาย', 'How many people are there?', 'มีคนกี่คน'],
        ['first', 'adjective', 'ที่หนึ่ง/แรก', 'This is my first day at work.', 'นี่เป็นวันแรกของฉันที่ทำงาน'],
        ['last', 'adjective', 'สุดท้าย/ที่แล้ว', 'December is the last month.', 'ธันวาคมเป็นเดือนสุดท้าย'],
        ['birthday', 'noun', 'วันเกิด', 'Happy birthday to you!', 'สุขสันต์วันเกิดนะ!'],
      ],
    },
    {
      title: 'Family',
      titleTh: 'ครอบครัว',
      grammarNote:
        'บอกความเป็นเจ้าของด้วย my/your/his/her เช่น "my father" (พ่อของฉัน) และใช้ have/has บอกว่ามี เช่น "I have two sisters."',
      rows: [
        ['family', 'noun', 'ครอบครัว', 'I love my family.', 'ฉันรักครอบครัวของฉัน'],
        ['father', 'noun', 'พ่อ', 'My father is a doctor.', 'พ่อของฉันเป็นหมอ'],
        ['mother', 'noun', 'แม่', 'My mother cooks very well.', 'แม่ของฉันทำอาหารเก่งมาก'],
        ['brother', 'noun', 'พี่ชาย/น้องชาย', 'My brother plays football.', 'พี่ชายของฉันเล่นฟุตบอล'],
        ['sister', 'noun', 'พี่สาว/น้องสาว', 'I have one sister.', 'ฉันมีพี่สาวหนึ่งคน'],
        ['child', 'noun', 'เด็ก/ลูก', 'The child is sleeping.', 'เด็กกำลังนอนหลับ'],
        ['parents', 'noun', 'พ่อแม่', 'My parents live in Bangkok.', 'พ่อแม่ของฉันอาศัยอยู่ที่กรุงเทพฯ'],
        ['live', 'verb', 'อาศัยอยู่', 'Where do you live?', 'คุณอาศัยอยู่ที่ไหน'],
      ],
    },
    {
      title: 'Food & Drink',
      titleTh: 'อาหารและเครื่องดื่ม',
      grammarNote:
        'ใช้ would like เพื่อสั่งอาหารแบบสุภาพ เช่น "I would like some water." สุภาพกว่า "I want water."',
      rows: [
        ['food', 'noun', 'อาหาร', 'Thai food is delicious.', 'อาหารไทยอร่อย'],
        ['water', 'noun', 'น้ำ', 'Can I have some water, please?', 'ขอน้ำหน่อยได้ไหมครับ'],
        ['rice', 'noun', 'ข้าว', 'I eat rice every day.', 'ฉันกินข้าวทุกวัน'],
        ['coffee', 'noun', 'กาแฟ', 'She drinks coffee in the morning.', 'เธอดื่มกาแฟตอนเช้า'],
        ['tea', 'noun', 'ชา', 'Do you want tea or coffee?', 'คุณอยากได้ชาหรือกาแฟ'],
        ['hungry', 'adjective', 'หิว', 'I am very hungry now.', 'ตอนนี้ฉันหิวมาก'],
        ['eat', 'verb', 'กิน', 'What do you want to eat?', 'คุณอยากกินอะไร'],
        ['drink', 'verb', 'ดื่ม', 'He drinks milk every night.', 'เขาดื่มนมทุกคืน'],
      ],
    },
    {
      title: 'Daily Routine',
      titleTh: 'กิจวัตรประจำวัน',
      grammarNote:
        'Present Simple ใช้เล่ากิจวัตร ประธาน He/She/It เติม -s ที่กริยา เช่น "She wakes up at six." คำบอกความถี่: always (เสมอ), usually (มักจะ), never (ไม่เคย) วางหน้ากริยาหลัก',
      rows: [
        ['wake up', 'phrasal verb', 'ตื่นนอน', 'I wake up at six o’clock.', 'ฉันตื่นนอนตอนหกโมง'],
        ['breakfast', 'noun', 'อาหารเช้า', 'I have breakfast at home.', 'ฉันกินอาหารเช้าที่บ้าน'],
        ['work', 'noun/verb', 'งาน/ทำงาน', 'I go to work by bus.', 'ฉันไปทำงานโดยรถเมล์'],
        ['school', 'noun', 'โรงเรียน', 'The children walk to school.', 'เด็ก ๆ เดินไปโรงเรียน'],
        ['sleep', 'verb', 'นอนหลับ', 'I sleep eight hours every night.', 'ฉันนอนคืนละแปดชั่วโมง'],
        ['always', 'adverb', 'เสมอ', 'She always gets up early.', 'เธอตื่นเช้าเสมอ'],
        ['usually', 'adverb', 'มักจะ/โดยปกติ', 'I usually cook dinner myself.', 'ปกติฉันทำอาหารเย็นเอง'],
        ['never', 'adverb', 'ไม่เคย', 'He never drinks coffee at night.', 'เขาไม่เคยดื่มกาแฟตอนกลางคืน'],
      ],
    },
    {
      title: 'Places in Town',
      titleTh: 'สถานที่ในเมือง',
      grammarNote:
        'ถามทางใช้ "Where is...?" และบอกตำแหน่งด้วย near (ใกล้), far from (ไกลจาก), next to (ติดกับ) เช่น "The bank is near the station."',
      rows: [
        ['town', 'noun', 'เมือง (เล็ก)', 'I live in a small town.', 'ฉันอาศัยอยู่ในเมืองเล็ก ๆ'],
        ['street', 'noun', 'ถนน', 'The shop is on this street.', 'ร้านอยู่บนถนนสายนี้'],
        ['shop', 'noun', 'ร้านค้า', 'The shop opens at nine.', 'ร้านเปิดตอนเก้าโมง'],
        ['bank', 'noun', 'ธนาคาร', 'Where is the bank?', 'ธนาคารอยู่ที่ไหน'],
        ['restaurant', 'noun', 'ร้านอาหาร', 'This restaurant is very good.', 'ร้านอาหารร้านนี้ดีมาก'],
        ['station', 'noun', 'สถานี', 'The train station is near here.', 'สถานีรถไฟอยู่ใกล้ที่นี่'],
        ['near', 'preposition', 'ใกล้', 'My house is near the market.', 'บ้านของฉันอยู่ใกล้ตลาด'],
        ['far', 'adjective', 'ไกล', 'The airport is far from the city.', 'สนามบินอยู่ไกลจากตัวเมือง'],
      ],
    },
    {
      title: 'Time & Days',
      titleTh: 'เวลาและวัน',
      grammarNote:
        'ถามเวลาใช้ "What time is it?" คำบุพบทเวลา: at + เวลา (at 7 o’clock), on + วัน (on Monday), in + เดือน/ช่วงเวลา (in June, in the morning)',
      rows: [
        ['today', 'adverb', 'วันนี้', 'Today is Monday.', 'วันนี้วันจันทร์'],
        ['tomorrow', 'adverb', 'พรุ่งนี้', 'See you tomorrow!', 'เจอกันพรุ่งนี้!'],
        ['yesterday', 'adverb', 'เมื่อวาน', 'Yesterday was very hot.', 'เมื่อวานร้อนมาก'],
        ['week', 'noun', 'สัปดาห์', 'I work five days a week.', 'ฉันทำงานสัปดาห์ละห้าวัน'],
        ['month', 'noun', 'เดือน', 'April is a hot month.', 'เมษายนเป็นเดือนที่ร้อน'],
        ['morning', 'noun', 'ตอนเช้า', 'I run in the morning.', 'ฉันวิ่งตอนเช้า'],
        ['night', 'noun', 'กลางคืน', 'Good night, sleep well.', 'ราตรีสวัสดิ์ หลับฝันดี'],
        ['time', 'noun', 'เวลา', 'What time is it now?', 'ตอนนี้กี่โมงแล้ว'],
      ],
    },
    {
      title: 'Colors & Clothes',
      titleTh: 'สีและเสื้อผ้า',
      grammarNote:
        'คำคุณศัพท์ (เช่นสี) วางหน้าคำนามเสมอ: "a red shirt" ไม่ใช่ "a shirt red" และใช้ wear (สวมใส่) กับเสื้อผ้า',
      rows: [
        ['color', 'noun', 'สี', 'What color do you like?', 'คุณชอบสีอะไร'],
        ['red', 'adjective', 'สีแดง', 'She has a red car.', 'เธอมีรถสีแดง'],
        ['blue', 'adjective', 'สีน้ำเงิน/ฟ้า', 'The sky is blue.', 'ท้องฟ้าเป็นสีฟ้า'],
        ['white', 'adjective', 'สีขาว', 'He wears a white shirt.', 'เขาสวมเสื้อเชิ้ตสีขาว'],
        ['black', 'adjective', 'สีดำ', 'My shoes are black.', 'รองเท้าของฉันสีดำ'],
        ['shirt', 'noun', 'เสื้อเชิ้ต', 'This shirt is too big.', 'เสื้อตัวนี้ใหญ่เกินไป'],
        ['shoes', 'noun', 'รองเท้า', 'I need new shoes.', 'ฉันต้องการรองเท้าคู่ใหม่'],
        ['wear', 'verb', 'สวมใส่', 'She wears a blue dress today.', 'วันนี้เธอใส่ชุดสีน้ำเงิน'],
      ],
    },
    {
      title: 'Weather',
      titleTh: 'อากาศ',
      grammarNote:
        'พูดถึงอากาศใช้ It เป็นประธาน: "It is hot." (อากาศร้อน), "It is raining." (ฝนกำลังตก) — It ไม่ได้แปลว่า "มัน" ตรง ๆ ในที่นี้',
      rows: [
        ['weather', 'noun', 'สภาพอากาศ', 'How is the weather today?', 'วันนี้อากาศเป็นอย่างไร'],
        ['hot', 'adjective', 'ร้อน', 'It is very hot in April.', 'เดือนเมษายนอากาศร้อนมาก'],
        ['cold', 'adjective', 'หนาว/เย็น', 'It is cold in winter.', 'ฤดูหนาวอากาศหนาว'],
        ['rain', 'noun/verb', 'ฝน/ฝนตก', 'It rains a lot in June.', 'เดือนมิถุนายนฝนตกบ่อย'],
        ['sunny', 'adjective', 'แดดจ้า', 'Today is sunny and warm.', 'วันนี้แดดออกและอบอุ่น'],
        ['cloudy', 'adjective', 'มีเมฆมาก', 'The sky is cloudy this morning.', 'เช้านี้ท้องฟ้ามีเมฆมาก'],
        ['wind', 'noun', 'ลม', 'The wind is strong today.', 'วันนี้ลมแรง'],
        ['season', 'noun', 'ฤดู', 'Summer is my favorite season.', 'ฤดูร้อนเป็นฤดูโปรดของฉัน'],
      ],
    },
    {
      title: 'Hobbies',
      titleTh: 'งานอดิเรก',
      grammarNote:
        'like/love/enjoy ตามด้วยกริยาเติม -ing เช่น "I like swimming." "She enjoys reading." ใช้เล่าสิ่งที่ชอบทำ',
      rows: [
        ['hobby', 'noun', 'งานอดิเรก', 'My hobby is cooking.', 'งานอดิเรกของฉันคือทำอาหาร'],
        ['music', 'noun', 'ดนตรี/เพลง', 'I listen to music every day.', 'ฉันฟังเพลงทุกวัน'],
        ['movie', 'noun', 'ภาพยนตร์', 'We watch a movie on Friday.', 'เราดูหนังกันวันศุกร์'],
        ['book', 'noun', 'หนังสือ', 'This book is very interesting.', 'หนังสือเล่มนี้น่าสนใจมาก'],
        ['game', 'noun', 'เกม', 'The children play games together.', 'เด็ก ๆ เล่นเกมด้วยกัน'],
        ['swim', 'verb', 'ว่ายน้ำ', 'I swim on the weekend.', 'ฉันว่ายน้ำช่วงสุดสัปดาห์'],
        ['travel', 'verb', 'เดินทาง/ท่องเที่ยว', 'They travel to the sea every year.', 'พวกเขาไปเที่ยวทะเลทุกปี'],
        ['like', 'verb', 'ชอบ', 'I like reading books.', 'ฉันชอบอ่านหนังสือ'],
      ],
    },
  ],
)

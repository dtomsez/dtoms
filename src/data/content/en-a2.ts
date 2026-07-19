import { buildEnPack } from './builder'

export const enA2 = buildEnPack(
  'A2',
  'CEFR A2 — พื้นฐานมั่นคง',
  'สื่อสารเรื่องใกล้ตัวได้กว้างขึ้น เดินทาง ซื้อของ ทำงาน และเล่าเรื่องอดีต-อนาคต',
  [
    {
      title: 'Travel',
      titleTh: 'การเดินทาง',
      grammarNote:
        'ใช้ going to พูดถึงแผนที่ตัดสินใจแล้ว เช่น "We are going to visit Chiang Mai." และกริยา book แปลว่า จอง เช่น "book a hotel"',
      rows: [
        ['airport', 'noun', 'สนามบิน', 'We arrived at the airport early.', 'เราไปถึงสนามบินแต่เช้า'],
        ['ticket', 'noun', 'ตั๋ว', 'I bought two tickets to Phuket.', 'ฉันซื้อตั๋วไปภูเก็ตสองใบ'],
        ['luggage', 'noun', 'กระเป๋าเดินทาง', 'My luggage is very heavy.', 'กระเป๋าเดินทางของฉันหนักมาก'],
        ['passport', 'noun', 'หนังสือเดินทาง', 'Please show me your passport.', 'กรุณาแสดงหนังสือเดินทางของคุณ'],
        ['flight', 'noun', 'เที่ยวบิน', 'Our flight leaves at nine.', 'เที่ยวบินของเราออกตอนเก้าโมง'],
        ['hotel', 'noun', 'โรงแรม', 'The hotel is near the beach.', 'โรงแรมอยู่ใกล้ชายหาด'],
        ['book', 'verb', 'จอง', 'I booked a room for two nights.', 'ฉันจองห้องพักสองคืน'],
        ['arrive', 'verb', 'มาถึง', 'What time does the train arrive?', 'รถไฟมาถึงกี่โมง'],
      ],
    },
    {
      title: 'Shopping',
      titleTh: 'ช้อปปิ้ง',
      grammarNote:
        'เปรียบเทียบของสองสิ่งด้วยการเติม -er หรือ more เช่น cheaper (ถูกกว่า), more expensive (แพงกว่า): "This shirt is cheaper than that one."',
      rows: [
        ['price', 'noun', 'ราคา', 'What is the price of this bag?', 'กระเป๋าใบนี้ราคาเท่าไร'],
        ['expensive', 'adjective', 'แพง', 'This phone is too expensive.', 'โทรศัพท์เครื่องนี้แพงเกินไป'],
        ['cheap', 'adjective', 'ถูก (ราคา)', 'The food here is cheap and good.', 'อาหารที่นี่ถูกและอร่อย'],
        ['discount', 'noun', 'ส่วนลด', 'Can you give me a discount?', 'ลดราคาให้หน่อยได้ไหม'],
        ['size', 'noun', 'ขนาด/ไซซ์', 'Do you have a smaller size?', 'มีไซซ์เล็กกว่านี้ไหม'],
        ['try on', 'phrasal verb', 'ลองสวม', 'Can I try on this jacket?', 'ขอลองแจ็กเก็ตตัวนี้ได้ไหม'],
        ['pay', 'verb', 'จ่ายเงิน', 'Can I pay by credit card?', 'จ่ายด้วยบัตรเครดิตได้ไหม'],
        ['receipt', 'noun', 'ใบเสร็จ', 'Here is your receipt.', 'นี่ใบเสร็จของคุณค่ะ'],
      ],
    },
    {
      title: 'Health',
      titleTh: 'สุขภาพ',
      grammarNote:
        'ใช้ should ให้คำแนะนำ เช่น "You should see a doctor." (คุณควรไปหาหมอ) และบอกอาการด้วย have เช่น "I have a headache."',
      rows: [
        ['headache', 'noun', 'อาการปวดหัว', 'I have a bad headache.', 'ฉันปวดหัวมาก'],
        ['fever', 'noun', 'ไข้', 'The boy has a high fever.', 'เด็กชายมีไข้สูง'],
        ['medicine', 'noun', 'ยา', 'Take this medicine after meals.', 'กินยานี้หลังอาหาร'],
        ['doctor', 'noun', 'หมอ/แพทย์', 'You should see a doctor today.', 'คุณควรไปหาหมอวันนี้'],
        ['appointment', 'noun', 'นัดหมาย', 'I have an appointment at ten.', 'ฉันมีนัดตอนสิบโมง'],
        ['healthy', 'adjective', 'สุขภาพดี', 'Vegetables are healthy food.', 'ผักเป็นอาหารที่ดีต่อสุขภาพ'],
        ['exercise', 'noun/verb', 'ออกกำลังกาย', 'I exercise three times a week.', 'ฉันออกกำลังกายสัปดาห์ละสามครั้ง'],
        ['rest', 'noun/verb', 'พักผ่อน', 'You need to rest at home.', 'คุณต้องพักผ่อนอยู่บ้าน'],
      ],
    },
    {
      title: 'Work',
      titleTh: 'การทำงาน',
      grammarNote:
        'Present Continuous (am/is/are + V-ing) ใช้กับสิ่งที่กำลังทำอยู่ เช่น "I am working on a new project." (ฉันกำลังทำโปรเจกต์ใหม่)',
      rows: [
        ['office', 'noun', 'สำนักงาน', 'Our office is on the fifth floor.', 'สำนักงานของเราอยู่ชั้นห้า'],
        ['meeting', 'noun', 'การประชุม', 'The meeting starts at two.', 'การประชุมเริ่มตอนบ่ายสอง'],
        ['salary', 'noun', 'เงินเดือน', 'She gets a good salary.', 'เธอได้เงินเดือนดี'],
        ['colleague', 'noun', 'เพื่อนร่วมงาน', 'My colleagues are very friendly.', 'เพื่อนร่วมงานของฉันเป็นมิตรมาก'],
        ['boss', 'noun', 'หัวหน้า/เจ้านาย', 'My boss is in a meeting now.', 'ตอนนี้หัวหน้าของฉันกำลังประชุม'],
        ['busy', 'adjective', 'ยุ่ง', 'I am busy this afternoon.', 'บ่ายนี้ฉันยุ่ง'],
        ['project', 'noun', 'โครงการ/โปรเจกต์', 'We finished the project on time.', 'เราทำโปรเจกต์เสร็จทันเวลา'],
        ['deadline', 'noun', 'กำหนดส่งงาน', 'The deadline is next Friday.', 'กำหนดส่งงานคือวันศุกร์หน้า'],
      ],
    },
    {
      title: 'Past Experiences',
      titleTh: 'ประสบการณ์ในอดีต',
      grammarNote:
        'Past Simple ใช้เล่าเรื่องที่จบไปแล้ว กริยาปกติเติม -ed (visited, happened) กริยาอปกติต้องจำ (go→went, see→saw) เช่น "I visited Japan last year."',
      rows: [
        ['ago', 'adverb', 'ที่แล้ว/ก่อน', 'I moved here two years ago.', 'ฉันย้ายมาที่นี่เมื่อสองปีก่อน'],
        ['remember', 'verb', 'จำได้', 'I remember my first teacher.', 'ฉันจำครูคนแรกของฉันได้'],
        ['happen', 'verb', 'เกิดขึ้น', 'What happened last night?', 'เมื่อคืนเกิดอะไรขึ้น'],
        ['visit', 'verb', 'ไปเยี่ยม/เยือน', 'We visited our grandparents.', 'เราไปเยี่ยมปู่ย่าตายาย'],
        ['before', 'preposition', 'ก่อน', 'Wash your hands before dinner.', 'ล้างมือก่อนกินข้าวเย็น'],
        ['already', 'adverb', 'แล้ว/เรียบร้อยแล้ว', 'I have already finished my homework.', 'ฉันทำการบ้านเสร็จแล้ว'],
        ['ever', 'adverb', 'เคย', 'Have you ever been to China?', 'คุณเคยไปประเทศจีนไหม'],
        ['story', 'noun', 'เรื่องราว/นิทาน', 'Grandma told us a funny story.', 'คุณยายเล่าเรื่องตลกให้เราฟัง'],
      ],
    },
    {
      title: 'Future Plans',
      titleTh: 'แผนในอนาคต',
      grammarNote:
        'will ใช้กับการตัดสินใจ ณ ตอนพูดหรือคำสัญญา ("I will help you.") ส่วน going to ใช้กับแผนที่วางไว้แล้ว ("I am going to study Chinese next year.")',
      rows: [
        ['plan', 'noun/verb', 'แผน/วางแผน', 'What is your plan for the weekend?', 'สุดสัปดาห์นี้คุณมีแผนอะไร'],
        ['hope', 'verb', 'หวัง', 'I hope to see you again.', 'ฉันหวังว่าจะได้พบคุณอีก'],
        ['dream', 'noun', 'ความฝัน', 'My dream is to travel the world.', 'ความฝันของฉันคือเที่ยวรอบโลก'],
        ['decide', 'verb', 'ตัดสินใจ', 'She decided to learn Chinese.', 'เธอตัดสินใจเรียนภาษาจีน'],
        ['future', 'noun', 'อนาคต', 'I want to be a teacher in the future.', 'ในอนาคตฉันอยากเป็นครู'],
        ['maybe', 'adverb', 'บางที/อาจจะ', 'Maybe I will go to the party.', 'บางทีฉันอาจจะไปงานปาร์ตี้'],
        ['soon', 'adverb', 'เร็ว ๆ นี้', 'The bus will arrive soon.', 'รถเมล์จะมาถึงเร็ว ๆ นี้'],
        ['promise', 'verb', 'สัญญา', 'I promise to call you tonight.', 'ฉันสัญญาว่าจะโทรหาคุณคืนนี้'],
      ],
    },
  ],
)

# OOU COLOR GAMES 2026 | ระบบลงทะเบียนมหกรรมกีฬาสีเชื่อมความสามัคคี

เว็บแอปพลิเคชันแบบฟอร์มลงทะเบียนเข้าร่วมกิจกรรม **กีฬาสีเชื่อมความสามัคคี 4 หน่วยงาน 2026**
- สำนักงานมหาวิทยาลัย
- สำนักงานสภามหาวิทยาลัยเชียงใหม่
- สำนักงานการตรวจสอบภายใน
- สำนักพัฒนาคุณภาพการศึกษา

## 🌟 จุดเด่น (Features)
- **Responsive Web Design**: รองรับการใช้งานอย่างสมบูรณ์แบบบนสมาร์ตโฟน (Mobile), แท็บเล็ต (Tablet) และคอมพิวเตอร์ (Desktop)
- **Email Validation**: ตรวจสอบและบังคับให้ใช้อีเมลทางการของมหาวิทยาลัย (`@cmu.ac.th`) เท่านั้น
- **Dynamic Conditional Logic**:
  - เลือกสถานะนักกีฬา: ซ่อน/แสดงช่องระบุชนิดกีฬาตัวแทนมหาวิทยาลัย
  - เลือกความสนใจ: สลับระหว่าง *"มีให้เลือก"* (แสดงรายการชนิดกีฬา) กับ *"สนใจเป็นกองเชียร์"* (ซ่อนกล่องชนิดกีฬาจนว่างเปล่าทันที)
- **Google Sheets Integration**: ส่งข้อมูลตรงเข้าสู่ Google Sheets แบบอัตโนมัติผ่าน Google Apps Script Web App Endpoint
- **Live Counter**: แสดงจำนวนผู้ตอบแบบสอบถาม/ลงทะเบียนแบบ Real-time
- **Security Sanitization**: ป้องกันช่องโหว่ Cross-Site Scripting (XSS)

## 📁 โครงสร้างโปรเจกต์ (File Structure)
```text
├── index.html        # โครงสร้างหน้าเว็บและฟอร์มลงทะเบียน
├── style.css         # การจัดเลย์เอาต์, โทนสี Vibrant Unity และ Responsive CSS
├── app.js            # ตรรกะการทำงาน (Validation, Google Sheets Webhook, Sanitization)
├── .gitignore        # ไฟล์ยกเว้นการติดตามสำหรับ Git
└── README.md         # เอกสารแนะนำโปรเจกต์
```

## 🚀 การเผยแพร่ใช้งาน (Deployment)
สามารถนำขึ้น **GitHub Pages** ได้ทันทีโดยไม่ต้องตั้งค่า Build Process ใดๆ (Pure HTML, CSS, JavaScript)

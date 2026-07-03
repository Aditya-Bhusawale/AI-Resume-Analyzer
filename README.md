# 🤖 AI-Resume-Analyzer

An AI-powered interview preparation platform that analyzes a candidate's resume and job description to generate personalized interview questions, skill gap analysis, interview roadmap, and downloadable interview reports using Google Gemini AI.

---

## 🚀 Features

- 🔐 User Authentication (JWT)
- 📄 Upload Resume (PDF)
- 💼 Enter Job Description
- 🤖 AI-Generated Interview Questions
- 📊 Resume Match Score
- 🎯 Skill Gap Analysis
- 📚 Personalized Learning Roadmap
- 📥 Download AI Interview Report as PDF
- 📜 Interview History Dashboard
- 🎨 Clean EJS-based User Interface

---

## 🛠 Tech Stack

### Frontend
- EJS
- HTML5
- CSS3

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### AI
- Google Gemini API
- Zod
- Zod to JSON Schema

### Other Tools
- JWT Authentication
- Multer (File Upload)
- Puppeteer (PDF Generation)
- PDF Parser

---

## 📂 Project Structure

```
interview-ai/
│
├── public/
│   ├── css/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   └── services/
│
├── views/
│
├── server.js
├── package.json
└── .env
```

---
```

### Create Environment File

Create a `.env` file in the project root.

```env
PORT=3000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

## 📌 Application Flow

1. Register/Login
2. Upload Resume (PDF)
3. Paste Job Description
4. Add Self Description (Optional)
5. AI analyzes resume and job description
6. Generates:
   - Resume Match Score
   - Skill Gap Analysis
   - Technical Questions
   - Behavioral Questions
   - Preparation Roadmap
7. Save report
8. Download report as PDF

---

## 📸 Screens

- Login Page
- Register Page
- Dashboard
- Resume Upload
- Interview Report
- PDF Download

---

## 🔒 Authentication

- JWT-based Authentication
- Protected Routes
- Secure Cookies
- Middleware Authorization



## 👨‍💻 Author

**Aditya Bhusawale**

Computer Engineering Student

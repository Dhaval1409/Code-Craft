# 🚀 Code-Craft Hackathon Project

## 🎯 Project Title: **Jeevan AI**

---

## 📖 About the Project

**Jeevan AI** is a multi-purpose web-based assistant designed to empower different user groups through smart and accessible technology.

### 👨‍🎓 For Students:
- 24x7 AI-based doubt-solving support (text and voice)
- Assistance in exam preparation with instant responses

### 🌾 For Farmers:
- Real-time weather updates
- Mandi (market) price information displayed in card format

### 🩺 For Everyone (Health Section):
- Daily health care tips
- Medicine and hydration reminders
- Emergency button that calls **108** automatically after 3 clicks

---

## 💡 My Journey

I am the **only member in my team**. Initially, we planned to build this project using **Flutter**, but due to team inactivity and my stronger frontend skills, I switched the stack to:

- **HTML**
- **CSS**
- **JavaScript**

For backend development, which I was new to, I used **Node.js** with **Express** and took help from **AI (ChatGPT)** for learning, debugging, and correcting my code efficiently. **Ayan Sir** also guided me to use AI tools to enhance features quickly.

---

## 🛠️ Tech Stack

| Tech | Why I Used It |
|---|---|
| **HTML/CSS/JS** | To build the core UI and logic quickly as I have basic frontend knowledge |
| **Bootstrap** | For responsive, clean layouts without writing CSS from scratch |
| **Font Awesome** | For high-quality icons across all pages |
| **Flatpickr.js** | To implement user-friendly time pickers for reminders |
| **Node.js & Express** | Backend server to handle routes, APIs, authentication |
| **MongoDB Atlas (Mongoose)** | To store user data, reminders, and mandi items in a secure cloud database |
| **Axios** | For making API calls to weather and AI endpoints |
| **dotenv** | To securely manage environment variables like API keys and database URIs |
| **multer** | To handle image uploads for OCR-based features |
| **tesseract.js** | For Optical Character Recognition (OCR) to read text from uploaded images |
| **express-session** | To manage user login sessions and route protection |
| **OpenRouter API** | Used instead of OpenAI due to free availability for text-based AI replies |

---

## ⚠️ OpenRouter vs OpenAI

I used **OpenRouter API** instead of **OpenAI API** because:

- OpenAI is paid and requires billing for real-time, updated data.  
- OpenRouter is free (for limited models) and allowed me to implement AI-based doubt-solving within my budget.  
- However, if **OpenAI API** is used in the future, the **quality and accuracy of student doubt-solving will significantly improve** with real-time updated data.

---

## 📌 Project Phases

### ✅ Phase One: UI / Frontend
- Created core pages with **static HTML**:
  - `index.html`
  - `student.html`
  - `farmer.html`
  - `health.html`
  - `schema.html`
- Used **Bootstrap** for layouts, **FontAwesome** for icons, and **Flatpickr** for health reminders.

### 🔄 Phase Two: Backend Integration
- Converted all frontend pages to **EJS templates** to dynamically fetch data from MongoDB Atlas.
- Implemented **user authentication** so users cannot access any route without login.
- Connected APIs:
  - **OpenRouter AI API** for text-based and voice-based replies.
  - **OpenWeatherMap API** for live weather data.

---

## 🚀 Working Features

✔️ **AI Doubt Solving:** Text and voice-based query replies (via OpenRouter API)  
✔️ **Live Weather Data:** Fetched using user location and displayed clearly  
✔️ **Mandi Prices:** Displayed as cards from database entries  
✔️ **Health Section:**
  - Tips displayed as cards
  - Add your own reminders with time
  - **Emergency button:** Calls **108** automatically after 3 clicks for urgent medical help  
✔️ **Government Schemes:** Listed with details and links to official websites

---

## ⚠️ Remaining / Non-Working Features

❌ **Photo Upload-based Answering:** OCR works but final integration with AI reply pending  
❌ **Mandi Search & Category Filters:** Currently only displays all items  
❌ **Scheme Filtering by Category:** Not implemented  
❌ **Add Item / Add Scheme Buttons:** Disabled in current version

---

## 🛑 Problems Faced & Solutions

1. **Problem:** I only knew basic frontend development  
   **Solution:** Started by creating all static pages first to build UI confidence.

2. **Problem:** I have basic knowledge of backend (Node.js + Express + MongoDB)  
   **Solution:** Took help from AI (ChatGPT) to understand, fix errors, and implement backend functionalities effectively.

3. **Problem:** Authentication and data fetching not working initially  
   **Solution:** Converted frontend pages into **EJS** templates to integrate dynamic data from MongoDB efficiently.

---

## 🌐 Deployment

✅ **Database:** MongoDB Atlas (cloud-based database for storing all data securely)  
✅ **Deployed on:** Render  
✅ **Deployment date:** 9th July 2025 after 6:00 PM  
✅ **Visit the live project here:** [🔗 Jeevan AI Live Site](https://jeevan-ai1.onrender.com/login)

---

## 🎞️ Project PPT

You can view my initial idea presentation here:

[🔗 View PPT](https://github.com/user-attachments/files/21117502/pdf.pdf)

---

## 📝 Future Scope

- Implement advanced AI models for better OCR-based answering  
- Enable full CRUD operations for schemes and mandi items  
- Add user dashboards with personalized analytics  
- Deploy with CI/CD pipeline for production  
- Integrate **real-time Mandi data** using official government APIs or alternative reliable sources to display **live market changes dynamically**


---

## 🙏 Acknowledgements

Special thanks to **Ayan Sir** for guidance and **ChatGPT AI** for continuous support and corrections while learning and building this project solo.

---

> **Made with 💙 for Code-Craft Hackathon by Dhaval Bodar**

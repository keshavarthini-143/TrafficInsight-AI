# 🚦 TrafficInsight-AI

An AI-powered web application that analyzes **traffic congestion levels** for any location using **Google Gemini AI**, providing **smart insights, visual indicators, and map grounding** to help users understand road conditions quickly and clearly.

---

##  Problem Statement

Urban traffic congestion causes **time loss, fuel waste, stress, and environmental impact**.
Most users lack easy-to-understand tools that explain traffic conditions clearly beyond simple maps.

There is a need for an **intelligent, human-readable traffic analysis system** that explains congestion levels and patterns in a simple way.

---

##  Solution Overview

**TrafficInsight-AI** uses **Google Gemini AI** to:

* Analyze traffic conditions based on location and time
* Classify congestion into **Low, Medium, or High**
* Provide **clear explanations** instead of raw data
* Visually represent traffic using **color-coded indicators**
* Enhance understanding using **Google Maps grounding**

The system is designed to be **fast, reliable, and beginner-friendly**, making traffic insights accessible to everyone.

---

##  Features

* 🚦 AI-based traffic congestion analysis
*  Automatic latitude & longitude detection
* 🟥🟧🟩 Visual road status indicators (Red / Orange / Green)
*  Google Maps grounding for real-world context
*  Structured AI responses (JSON-based)
*  Fail-safe fallback when API is unavailable
*  Responsive UI (Desktop & Mobile)
*  Fast performance using Vite

---

##  Tech Stack

### **Frontend**

* React.js
* TypeScript
* Vite

### **AI & APIs**

* Google Gemini API
* Google Maps Grounding Tool

### **Tools & Platforms**

* VS Code
* Git & GitHub
* Vercel (Deployment)

---

##  Architecture Overview

```
User Input (Location)
        |
   React UI
        |
 Gemini AI Service
        |
 Structured Traffic Analysis
        |
 Google Maps Grounding
        |
 Visual Traffic Insights
```

---

##  Setup Instructions

Follow these steps to run the project locally:

### **1. Clone the Repository**

```bash
git clone https://github.com/keshavarthini-143/TrafficInsight-AI/edit/main/README.md
cd TrafficInsight-AI
```

---

### **2. Install Dependencies**

```bash
npm install
```

---

### **3. Environment Configuration**

Create a `.env.local` file in the project root:

```env
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY

VITE_GEMINI_API_KEY=AIzaSyAo4oGdOMfy6PBymW-AOBctOGM-qsvcwm0

```
---

### **4. Run the Application**

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173/
```

---

##  Project Structure

```
TrafficInsight-AI/
│
├── src/
│   ├── services/
│   │   └── geminiService.ts
│   ├── types/
│   │   └── index.ts
│   ├── components/
│   ├── pages/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

---

##  Challenges Faced

* Ensuring **structured JSON output** from AI responses
* Handling API failures without crashing the UI
* Integrating **Maps grounding** meaningfully
* Adapting environment variables correctly for **Vite**
* Making AI output understandable for non-technical users

These challenges were solved using strict schemas, fallback logic, and robust error handling.

---

##  Future Improvements

* Real-time traffic API integration
* Route-based congestion prediction
* Historical traffic trend analysis
* AI-powered travel time estimation
* Dark mode UI
* Multi-language support

---

##  Metrics Used

Traffic congestion classification logic:

```
Low    → Smooth traffic flow
Medium → Moderate traffic density
High   → Heavy congestion / peak hours
```

Each classification includes:

* Road color
* Confidence level
* Human-readable explanation

---

##  Impact

* Helps users **plan travel better**
* Reduces uncertainty in traffic conditions
* Improves urban mobility awareness
* Demonstrates real-world AI + Maps integration
* Suitable for **smart city dashboards**

---

##  Demo & Submission

*  Demo Video: https://vimeo.com/1156344058?share=copy&fl=sv&fe=ci
*  Documentation: Included in repository
*  Built for **Hackathons / AI Showcases**

---

##  Author

**Keshavarthini B**
CSE Student | Web Development | Full-Stack | UI/UX
Hackathon Builder 

---

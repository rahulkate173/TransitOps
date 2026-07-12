<p align="center">
  <img src="https://img.shields.io/badge/TransitOps-Smart%20Transport%20Platform-B8860B?style=for-the-badge&labelColor=1A1A1A" alt="TransitOps Badge" />
</p>

<h1 align="center">🚍 TransitOps</h1>
<p align="center">
  <strong>Smart Transport Operations Platform</strong><br/>
  A comprehensive, high-density operations hub for logistics managers — unifying vehicle tracking, driver allocation, complex dispatching, and actionable analytics into a single, reliable interface.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb&logoColor=white&style=flat-square" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens&logoColor=white&style=flat-square" />
</p>

---

## 🎬 Demo

<!-- 👇 ADD YOUR VIDEO LINK BELOW 👇 -->

> **📹 Video Walkthrough:**  
> _Paste your video link here_ → `[ YOUR VIDEO LINK ]`

<!-- Example formats:
[![Demo Video](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

Or for Loom/other:
🔗 [Watch the demo](YOUR_LINK_HERE)
-->

---

## ✨ Features

| Module | Description |
|--------|-------------|
| **🏠 Landing Page** | Premium marketing page with hero, features, workflow, stats, CTA & footer |
| **🔐 Authentication** | Login, Register & OTP verification with JWT tokens |
| **🛡️ RBAC** | Four distinct roles — Fleet Manager, Dispatcher, Safety Officer, Financial Analyst |
| **🚛 Fleet Management** | Vehicle registry with status tracking, search & filtering |
| **👤 Driver Management** | Driver profiles, assignment, and compliance tracking |
| **📊 Dashboard** | Overview metrics, trip stats & fleet analytics |
| **🗺️ Dispatching** | Trip creation and assignment *(in progress)* |

---

## 🏗️ Tech Stack

### Frontend
- **React 19** — UI library
- **Vite 7** — Build tool & dev server
- **Redux Toolkit** — State management
- **React Router v7** — Client-side routing
- **Axios** — HTTP client
- **Vanilla CSS** — Custom design system (gold/cream palette)

### Backend
- **Express 5** — Web framework
- **MongoDB + Mongoose 9** — Database & ODM
- **JWT** — Token-based authentication
- **Nodemailer** — Email/OTP service
- **Morgan** — HTTP logging
- **Cookie Parser** — Cookie-based token management

---

## 📁 Project Structure

```
TransitOps/
├── frontend/
│   ├── src/
│   │   ├── assets/              # Static images & icons
│   │   ├── features/
│   │   │   ├── auth/            # Auth flow (login, register, OTP, landing)
│   │   │   │   ├── components/  # AuthLeft, LoginForm, RegisterForm, OtpForm
│   │   │   │   ├── hooks/       # useAuth custom hook
│   │   │   │   ├── pages/       # AuthPage, LandingPage
│   │   │   │   ├── services/    # API service layer
│   │   │   │   └── styles/      # auth.css, landing.css
│   │   │   ├── dashboard/       # Dashboard module
│   │   │   ├── drivers/         # Driver management
│   │   │   └── vehicleRegistry/ # Fleet/vehicle management
│   │   ├── App.jsx              # Root component & routing
│   │   ├── store.js             # Redux store configuration
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/              # DB & env configuration
│   │   ├── controllers/         # Route handlers
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # Express routes
│   │   ├── services/            # Business logic
│   │   ├── utils/               # Helpers & utilities
│   │   └── app.js               # Express app setup
│   ├── server.js                # Server entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### 1. Clone the repository
```bash
git clone https://github.com/your-username/TransitOps.git
cd TransitOps
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/transitops
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be running at **http://localhost:5173**

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--gold` | `#B8860B` | Primary accent, buttons, highlights |
| `--gold-light` | `#D4A017` | Hover states, gradients |
| `--bg-dark` | `#111111` | Auth right panel background |
| `--bg-cream` | `#F7F3ED` | Landing page background |
| `--bg-warm` | `#EDE7DA` | Section alternating background |
| `--text-primary` | `#F0EDE8` | Dark-mode text |
| `--text-dark` | `#1A1A1A` | Light-mode text |

**Fonts:** `Inter` (UI) · `Courier Prime` (monospace accents)

---

## 🔑 Role-Based Access

| Role | Access Scope |
|------|-------------|
| **Fleet Manager** | Fleet, Maintenance |
| **Dispatcher** | Dashboard, Trips |
| **Safety Officer** | Drivers, Compliance |
| **Financial Analyst** | Fuel & Expenses, Analytics |

---

## 📜 License

This project is for educational and demonstration purposes.

---

<p align="center">
  <sub>Built with ☕ and dedication — <strong>TransitOps © 2026</strong></sub>
</p>

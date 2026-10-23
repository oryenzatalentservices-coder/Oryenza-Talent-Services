# Oryenza Talent Services — Full-Stack Application (React + Node.js + MySQL)

A clean, production-ready, full-stack recruitment platform for **Oryenza Talent Services**, organized with clean separation into **`frontend/`** and **`backend/`**.

---

## 📁 Project Directory Structure

```
d:\Oryenza_Rushit/
├── frontend/                   # React 18+ & Vite Frontend Single Page Application
│   ├── public/
│   │   ├── assets/             # Brand logos & interactive SVG process simulator
│   │   │   ├── logo.png
│   │   │   ├── circular_brand.png
│   │   │   ├── brand_symbol.png
│   │   │   └── process_journey.html
│   │   └── favicon.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx        # Sticky navigation, CV modal & Admin shortcuts
│   │   │   ├── Hero.jsx          # Value proposition, dual CTAs, brand badge
│   │   │   ├── StatsSection.jsx  # Animated KPI growth stats (clients, placements)
│   │   │   ├── AboutSection.jsx  # Human-first philosophy & checklist
│   │   │   ├── VisionMission.jsx # Purpose: Vision & Mission cards
│   │   │   ├── ServicesSection.jsx # Permanent, Contract, and Sourcing services
│   │   │   ├── IndustriesSection.jsx # 3-row infinite marquee across 21 sectors
│   │   │   ├── ProcessSection.jsx # 5-Stage interactive recruitment journey
│   │   │   ├── FAQSection.jsx    # Accessible recruitment questions accordion
│   │   │   ├── ClosingCTA.jsx    # High-conversion closing banner
│   │   │   ├── ContactSection.jsx # Full-stack employer hiring intake form
│   │   │   ├── CandidateModal.jsx # Job seeker intake & resume upload (.pdf, .doc)
│   │   │   ├── AdminDashboard.jsx # Admin management portal & DB diagnostics
│   │   │   ├── ThemeToggle.jsx   # Dark/Light mode toggle with persistence
│   │   │   └── Footer.jsx        # Category channels, address, and live year
│   │   ├── services/
│   │   │   └── api.js            # Unified REST client with Vite proxy
│   │   ├── styles/
│   │   │   ├── index.css         # Design tokens, dark mode, responsive breakpoints
│   │   │   └── admin.css         # Admin portal & candidate modal styles
│   │   ├── App.jsx               # Master application container
│   │   └── main.jsx
│   ├── vite.config.js            # Configured proxy to backend (port 5000)
│   ├── package.json
│   └── index.html
│
├── backend/                    # Node.js + Express REST API Server
│   ├── config/
│   │   └── db.js                 # MySQL2 connection pool with auto schema setup & fallback
│   ├── controllers/
│   │   ├── inquiryController.js  # CRUD for employer hiring requirements
│   │   ├── candidateController.js# Candidate applications & resume upload (Multer)
│   │   └── statsController.js    # Live KPI metrics & health checks
│   ├── routes/
│   │   ├── inquiryRoutes.js      # /api/inquiries
│   │   ├── candidateRoutes.js    # /api/candidates
│   │   └── statsRoutes.js        # /api/stats, /api/stats/health
│   ├── database/
│   │   └── schema.sql            # MySQL schema for tables & indexes
│   ├── uploads/
│   │   └── resumes/              # Secure directory for uploaded resumes
│   ├── .env                      # Environment variables (DB credentials, port)
│   ├── .env.example
│   ├── package.json
│   └── server.js                 # Express server bootstrap
│
├── package.json                # Root orchestration scripts
└── README.md                   # Project documentation
```

---

## ⚡ Quick Start Guide

### 1. Run Both Frontend and Backend Concurrently

From the project root (`d:\Oryenza_Rushit`):

```bash
npm run dev
```

- **React Frontend**: [http://localhost:5173](http://localhost:5173)
- **Node.js Backend**: [http://localhost:5000](http://localhost:5000)

### 2. Run Independently

To start only the backend:

```bash
npm run dev:backend
# or: cd backend && npm start
```

To start only the frontend:

```bash
npm run dev:frontend
# or: cd frontend && npm run dev
```

To build production bundle:

```bash
npm run build
```

---

## 🗄️ MySQL Database Configuration

The backend is pre-configured for **MySQL 8.0** via `mysql2/promise`.

### Schema (`backend/database/schema.sql`):

1. **`inquiries` Table**: Stores client hiring requirements (name, email, company, phone, requirement type, message, status: `new`, `in_progress`, `contacted`, `closed`).
2. **`candidates` Table**: Stores candidate job applications and resume files (name, email, phone, role, experience, location, skills, resume path, recruitment status: `applied`, `screening`, `interview`, `offered`, `placed`, `rejected`).
3. **`site_stats` Table**: Stores dynamic KPI metrics displayed on the frontend.

### Connecting to Local MySQL:

1. Open `backend/.env`.
2. Update `DB_PASSWORD` to your local MySQL password:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=oryenza_talent_db
   DB_PORT=3306
   ```
3. Restart the backend — it will **automatically create the database `oryenza_talent_db` and tables**!

> **Resilient Fallback Mode**: If MySQL credentials are not yet configured or MySQL is offline, the backend automatically uses **Local Persistence Mode** (`backend/data/local_db.json`). All inquiry submissions, resume uploads, and admin functions continue working seamlessly without errors.

---

## 🛡️ Admin Management Portal

Click the **Shield (🛡️)** icon in the header or the **"Admin Portal"** link in the footer to access:

- **Client Inquiries Tab**: View all inbound hiring requirements, filter by status, update stages, or remove entries.
- **Candidate Talent Pool Tab**: Review job applications, filter candidate statuses, and download/view uploaded resumes.
- **MySQL Diagnostics Tab**: Real-time database connection diagnostics and table statistics.

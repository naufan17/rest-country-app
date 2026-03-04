# 🌍 World Explorer - Rest Country App

World Explorer is a high-performance, modern web application designed for discovering, managing, and analyzing country data globally. Built with Next.js 15, it provides a seamless user experience for exploring demographic trends and geographical distributions.

🌐 **Live Demo:** [https://rest-country-app-psi.vercel.app/](https://rest-country-app-psi.vercel.app/)

## ✨ Key Features

- 📊 **Interactive Dashboards:** Real-time analytics on population distribution and regional demographics.
- 🔄 **Dynamic Synchronization:** One-click synchronization with the REST Countries API with chunked transaction processing.
- ✏️ **Complete CRUD Management:** Robust country management system with form validation (Zod + React Hook Form).
- 🔍 **Advanced Filtering & Search:** Search by name, code, or capital, and filter by global regions.
- 📱 **Modern UI/UX:** Responsive design built with Tailwind CSS, featuring glassmorphism, smooth animations, and toast notifications.

## 🚀 Technical Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS + Framer Motion
- **Forms & Validation:** React Hook Form + Zod
- **Notifications:** Sonner
- **Charts:** Recharts

## 🛠️ How to Run Locally

Follow these steps to set up the project on your machine:

### 1. Clone the repository

```bash
git clone https://github.com/naufan17/rest-country-app.git
cd rest-country-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Database Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Production Build

To create an optimized production build:

```bash
npm run build
npm start
```

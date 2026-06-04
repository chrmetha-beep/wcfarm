# วังเจ้าฟาร์ม (WC Farm)

ระบบจัดการฟาร์มสุกร — Farm Management System

## 📋 Features
- ✅ บันทึกผู้เข้าออก (Visitor Log)
- ✅ บันทึกยาและวัคซีน (Medical Records)
- ✅ บันทึกอาหาร (Feed Records)
- ✅ รายงานปัญหา (Issue Reports)
- ✅ บันทึกการขนส่ง (Delivery Log)
- ✅ จัดการติดต่อ (Contact Management)

## 🛠️ Tech Stack
- **Frontend**: React 18 + Vite
- **Backend**: Supabase (PostgreSQL)
- **Language**: Thai (ไทย)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Supabase account

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 📁 Project Structure
```
wcfarm/
├── src/
│   ├── main.jsx           # Entry point
│   ├── App.jsx            # Main component
│   ├── components/        # React components
│   ├── pages/             # Page components
│   └── lib/               # Utilities & helpers
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── package.json           # Dependencies
├── supabase_setup.sql     # Database schema
└── README.md              # This file
```

## 🗄️ Database Setup

1. Go to [Supabase Console](https://supabase.com/dashboard)
2. Create a new project
3. Copy the SQL from `supabase_setup.sql`
4. Paste it in SQL Editor and run
5. Get your credentials from Project Settings

## 🔐 Environment Variables

Create `.env.local` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 👥 Team
- วัง (Admin)
- พี่ติ่ง (Team Lead)
- พี่นาย (Team Lead)
- และทีมงานอื่นๆ

## 📝 License
Private Project

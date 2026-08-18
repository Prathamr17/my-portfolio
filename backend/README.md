# 🧠 Pratham Raikar — Portfolio Backend

Flask REST API | PostgreSQL/MySQL | JWT Auth | Email Notifications

---

## 📁 Project Structure

```
portfolio-backend/
├── app/
│   ├── __init__.py          # App factory
│   ├── config.py            # Config classes
│   ├── models/              # SQLAlchemy models
│   │   ├── admin.py
│   │   ├── about.py
│   │   ├── skill.py
│   │   ├── project.py
│   │   ├── certificate.py
│   │   ├── platform.py
│   │   ├── internship.py
│   │   ├── achievement.py
│   │   └── contact.py
│   ├── routes/
│   │   ├── auth.py          # /api/auth/*
│   │   ├── public.py        # /api/public/*  (no auth)
│   │   ├── admin.py         # /api/admin/*   (JWT required)
│   │   └── contact.py       # /api/contact
│   ├── services/
│   │   ├── email_service.py
│   │   └── upload_service.py
│   └── utils/
│       └── decorators.py
├── uploads/                 # Uploaded images served statically
├── schema.sql               # Raw SQL schema (reference)
├── seed.py                  # Seed real portfolio data
├── run.py                   # Entry point
├── requirements.txt
└── .env.example
```

---

## ⚙️ Setup — Step by Step

### 1. Clone & create virtual environment
```bash
cd portfolio-backend
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
```

### 2. Install dependencies
```bash
pip install -r requirements.txt
```

### 3. Create your database

**PostgreSQL:**
```sql
CREATE DATABASE portfolio_db;
```

**MySQL:**
```sql
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Create .env file
```bash
cp .env.example .env
# Edit .env with your DB URL, JWT secret, SMTP credentials
```

### 5. Run migrations
```bash
flask db init
flask db migrate -m "Initial schema"
flask db upgrade
```

### 6. Seed the database with Pratham's real data
```bash
python seed.py
```

This will create:
- Admin account: `prathamraikar8@gmail.com` / `Admin@123`  ← **change this!**
- All skills, projects, certificates, platforms, achievements

### 7. Start the server
```bash
flask run
# OR
python run.py
```
API runs on: http://localhost:5000

---

## 📧 Email Setup (Gmail)

1. Go to https://myaccount.google.com/apppasswords
2. Create an App Password for "Mail"
3. Add to .env:
```
MAIL_USERNAME=your.gmail@gmail.com
MAIL_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=prathamraikar8@gmail.com
```

---

## 🔑 API Endpoints Summary

### Auth
| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | /api/auth/login    | Admin login → JWT    |
| GET    | /api/auth/me       | Current admin info   |
| POST   | /api/auth/logout   | Logout (client-side) |

### Public (no auth)
| Method | Endpoint                    | Description               |
|--------|-----------------------------|---------------------------|
| GET    | /api/public/about           | Bio & contact info        |
| GET    | /api/public/skills          | All skill categories      |
| GET    | /api/public/projects        | Projects (filter by ?tag) |
| GET    | /api/public/certificates    | Certs (filter by ?category)|
| GET    | /api/public/platforms       | LeetCode/HackerRank stats |
| GET    | /api/public/internships     | Work timeline             |
| GET    | /api/public/achievements    | Achievement cards         |
| GET    | /api/public/stats           | Aggregate counters        |
| POST   | /api/contact                | Submit contact form       |

### Admin (JWT required)
| Method       | Endpoint                          | Description               |
|--------------|-----------------------------------|---------------------------|
| GET          | /api/admin/dashboard              | Summary stats             |
| GET/PUT      | /api/admin/about                  | View/update bio           |
| GET          | /api/admin/skills                 | All skill categories      |
| POST         | /api/admin/skill-categories       | Create category           |
| PUT/DELETE   | /api/admin/skill-categories/:id   | Update/delete category    |
| POST         | /api/admin/skills                 | Create skill              |
| PUT/DELETE   | /api/admin/skills/:id             | Update/delete skill       |
| GET/POST     | /api/admin/projects               | List/create project       |
| GET/PUT/DEL  | /api/admin/projects/:id           | Detail/update/delete      |
| GET/POST     | /api/admin/certificates           | List/create cert          |
| PUT/DELETE   | /api/admin/certificates/:id       | Update/delete cert        |
| GET/POST     | /api/admin/platforms              | List/create platform      |
| PUT/DELETE   | /api/admin/platforms/:id          | Update/delete platform    |
| GET/POST     | /api/admin/internships            | List/create internship    |
| PUT/DELETE   | /api/admin/internships/:id        | Update/delete internship  |
| GET/POST     | /api/admin/achievements           | List/create achievement   |
| PUT/DELETE   | /api/admin/achievements/:id       | Update/delete achievement |
| GET          | /api/admin/messages               | All contact messages      |
| PUT          | /api/admin/messages/:id/read      | Mark as read              |
| DELETE       | /api/admin/messages/:id           | Delete message            |
| POST         | /api/admin/upload                 | Upload image              |

---

## 🔒 Admin Login

After seeding:
- Email: `prathamraikar8@gmail.com`
- Password: `Admin@123`

**Change the password after first login!**

---

## 🧪 Test with curl

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"prathamraikar8@gmail.com","password":"Admin@123"}'

# Get projects (public)
curl http://localhost:5000/api/public/projects

# Create project (admin)
curl -X POST http://localhost:5000/api/admin/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Project","description":"...","tech_tags":["Python"]}'
```

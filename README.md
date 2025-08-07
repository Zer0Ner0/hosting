# 🌐 MyHosting - Domain & Web Hosting Website

A full-featured domain & hosting platform inspired by Hostinger and NameHero. This project includes a modern frontend using **Next.js + TailwindCSS**, a powerful backend using **Django + MySQL**, and CMS support via **Django Admin**.

## 🚀 Features

- ✅ Clean & responsive design (based on Figma)
- ✅ Hero landing page with domain search box
- ✅ Hosting plan selector with tabbed categories
- ✅ Testimonials and FAQs
- ✅ Blog system via Django Admin
- ✅ External authentication (e.g. Google login)
- ✅ Hosting plan management (via CMS)
- ✅ Chatbot integration (via JS embed or React)
- ✅ Domain search powered by **Enom API**
- ✅ Deployment-ready for **Synology NAS + Cloudflare + Gunicorn/Nginx**

---

## 🧱 Tech Stack

| Layer       | Technology               |
|------------|---------------------------|
| Frontend   | Next.js (Pages Router), TailwindCSS, TypeScript |
| Backend    | Django (REST Framework)   |
| Database   | MySQL                     |
| CMS        | Django Admin              |
| Extras     | Enom API, Google/Auth0 Login, Chatbot Widget |
| Deployment | Synology NAS, Cloudflare, Gunicorn + Nginx |

---

## 📁 Project Structure

```
hosting/
│
├── frontend/                # Next.js with TailwindCSS
│   ├── src/
│   │   ├── pages/           # Includes index.tsx, hosting.tsx etc.
│   │   ├── styles/          # Tailwind globals.css
│   │   └── components/      # Navbar, Footer, DomainSearchBox etc.
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                 # Django backend
│   └── hosting_backend/     # Main Django project
│       ├── models/          # HostingPlan, BlogPost models
│       ├── admin.py         # CMS config
│       ├── views/api/       # REST API endpoints
│
└── shared/                  # Shared assets/config/envs
```

---

## 📌 Pages & Components

- `/` (Home)
  - Hero Section
  - Domain Search Box
  - Hosting Plan Selector
  - Testimonials
  - FAQ Section
- `/hosting`
  - Web Hosting, WordPress Hosting, WooCommerce, Email
- `/builder`
- `/blog`
- `/login` (External OAuth2 via Google/Auth0)

---

## ⚙️ CMS (Admin Panel)

Access all blog posts and hosting plans from Django Admin at `/admin`.

- `BlogPost`: title, content, slug, featured image
- `HostingPlan`: name, price, features, category

---

## 🔐 Authentication

Supports external login (via **Google** or **Auth0**). Auth session/token can be shared between Django and Next.js if needed (e.g. via JWT or cookies).

---

## 🌍 Deployment Plan

- 🔒 Use **Cloudflare DNS** + SSL
- 🖥️ Deploy frontend statically via Synology reverse proxy
- 🐍 Deploy backend (Django) using Gunicorn + Nginx
- 🛠 CI/CD with GitHub Actions (planned)

---

## 📦 Installation (Dev)

### 1. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### 2. Backend (Django)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

> 💡 Make sure MySQL is running and connected in `settings.py`.

---

## ✨ Credits

- Design inspired by [Hostinger](https://www.hostinger.com/) & [NameHero](https://www.namehero.com/)
- Domain search powered by [Enom API](https://www.enom.com/api/)
- Chatbot (planned): GPT-powered or Tawk.to widget

# 🌐 MyHosting - Domain & Web Hosting Website

A full-featured domain & hosting platform inspired by Hostinger and Hosting Malaysia. This project includes a modern frontend using **Next.js + TailwindCSS**, a powerful backend using **Django + MySQL**, and CMS support via **Django Admin**.

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

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| Frontend   | Next.js (Pages Router), TailwindCSS, TypeScript |
| Backend    | Django (REST Framework)                         |
| Database   | MySQL                                           |
| CMS        | Django Admin                                    |
| Extras     | Enom API, Google/Auth0 Login, Chatbot Widget    |
| Deployment | Synology NAS, Cloudflare, Gunicorn + Nginx      |

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

- Design inspired by [Hostinger](https://www.hostinger.com/) & [Hosting Malaysia](https://www.Hosting Malaysia.com/)
- Domain search powered by [Enom API](https://www.enom.com/api/)
- Chatbot (planned): GPT-powered or Tawk.to widget

## 📦 **Components Created**

│  
│ 1. **`EnhancedResponsivePricingCards.tsx`** - The main responsive component with:
│ - ✅ Pixel-perfect design matching Figma specs
│ - ✅ Fully responsive (mobile, tablet, desktop)
│ - ✅ TypeScript support with exported interfaces
│ - ✅ Customizable plans and features
│ - ✅ Interactive expandable feature lists
│ - ✅ Plan selection callbacks
│ - ✅ Accessibility compliant
│  
│ 2. **`hosting-enhanced.tsx`** - Example page showing:
│ - ✅ Default hosting plans
│ - ✅ WordPress-specific plans  
│ - ✅ Email hosting plans
│ - ✅ Different configurations and customizations
│  
│ 3. **`PRICING_CARDS_README.md`** - Comprehensive documentation with:
│ - ✅ Usage examples
│ - ✅ Props reference
│ - ✅ Customization guide
│ - ✅ Best practices
│ - ✅ Troubleshooting
│  
│ ## 🎨 **Design Features**
│  
│ - **Exact color matching** using Hostinger brand colors
│ - **Responsive grid layout** (1 col mobile → 2 col tablet → 3 col desktop)
│ - **"Most Popular" banner** with perfect positioning
│ - **Interactive hover effects** and smooth transitions
│ - **Expandable feature lists** with "See all features" toggle
│ - **Consistent typography** using DM Sans font family
│ - **Accessible icons** with proper contrast ratios
│  
│ ## 🔧 **Technical Features**
│  
│ - **Flexible configuration** - easily customize for any page
│ - **TypeScript interfaces** - fully typed for development safety
│ - **Plan selection handling** - callbacks for user interactions  
│ - **Performance optimized** - minimal re-renders and efficient rendering
│ - **Tailwind CSS** - utility-first styling approach
│ - **Browser compatible** - works across modern browsers
│  
│ ## 📱 **Responsive Behavior**
│  
│ The component automatically adapts:
│ - **Mobile**: Single column, optimized spacing, touch-friendly buttons
│ - **Tablet**: Two columns, balanced layout
│ - **Desktop**: Three columns, full feature display
│  
│ ## 🚀 **Usage Examples**
│  
│ `tsx
│  // Basic usage
│  <EnhancedResponsivePricingCards plans={defaultPlans} />
│  
│  // With customization
│  <EnhancedResponsivePricingCards
│    plans={customPlans}
│    title="WordPress Hosting" 
│    subtitle="Optimized for WordPress"
│    showFeatureLimit={10}
│    onSelectPlan={(planId) => handleSelection(planId)}
│  />
│  `
│  
│ This enhanced responsive version can now be used across **all hosting-related pages** with consistent design, behavior, and user experience while

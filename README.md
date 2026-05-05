# 🛒 FreshCart

<div align="center">

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![DotNet](https://img.shields.io/badge/.NET-Web_API-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**A modern, full-stack multi-vendor e-commerce marketplace.**  
Built with React on the frontend and a .NET Web API on the backend, supporting Customers, Vendors, and Admins with role-based access control.

[🌐 Live Demo](https://freshcart-eg.vercel.app/) • [📦 Backend Repo](https://github.com/Ahmed-devS3B/BackEnd--FreshCart) • [🐛 Report Bug](#) • [✨ Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Role-Based Access](#-role-based-access)

---

## 🌟 Overview

FreshCart is a responsive, feature-rich e-commerce platform that supports three distinct user roles. Customers can browse and purchase products, Vendors can manage their own storefronts, and Admins oversee the entire marketplace — all from dedicated, role-specific dashboards.

---

## ✨ Features

### 🧑‍💼 Customer
- Secure registration and login with JWT authentication
- Real-time product search (search-as-you-type filtering)
- Product catalog with detailed views and related categories
- Shopping cart — Add, Remove, and Clear items
- Personal wishlist to save favorite products
- Order placement (Cash on Delivery) and full order history tracking

### 🏪 Vendor
- Dedicated vendor dashboard for business management
- Full product management — Add, Update, and Delete products
- Product status tracking — Approved, Pending, or Rejected by Admin
- Order management — View orders specific to their products

### 🛡️ Admin
- Comprehensive admin panel with analytics and charts
- Vendor management — Approve, Disapprove, Enable, or Disable vendor accounts
- Product moderation — Accept or Reject product submissions from vendors
- Auto-approval — Enable trusted vendors to bypass manual review

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Bootstrap |
| **Routing** | React Router DOM v7 (Hash Router for GitHub Pages) |
| **State Management** | React Context API (User, Cart, Wishlist, Notification) |
| **Data Fetching** | Axios, TanStack React Query |
| **Form Handling** | Formik + Yup validation |
| **UI Components** | CoreUI, Heroicons, FontAwesome, Recharts, Swiper |
| **Real-time** | Microsoft SignalR |
| **Authentication** | JWT (json web tokens), `jwt-decode` |
| **Backend** | .NET Web API |
| **Database** | PostgreSQL |
| **Deployment** | Vercel (Frontend), Railway (Backend) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Ahmed-devS3B/FreshCart--FrontEnd.git
cd FreshCart--FrontEnd
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**  
Create a `.env.local` file in the root directory (see [Environment Variables](#-environment-variables) below).

4. **Run the development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root with the following:

```env
VITE_API_URL=https://backend-freshcart-production.up.railway.app/api
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=yourpassword
```

> ⚠️ **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

In your API files, these are accessed via:
```js
const BASE_URL = import.meta.env.VITE_API_URL;
```

When deploying to **Vercel**, add these same variables in the Vercel dashboard under **Project Settings → Environment Variables**.

---

## 📁 Project Structure

```
src/
├── api/                  # Axios API calls (adminApi.js, etc.)
├── assets/               # Static images and icons
├── components/
│   ├── Context/          # React Context providers (User, Cart, Wishlist, Notification)
│   ├── GuestRoute/       # Redirects logged-in users away from auth pages
│   ├── ProtectedRoute/   # Guards for Customer, Vendor, and Admin routes
│   ├── Layout/           # Main layout and Admin layout wrappers
│   ├── Navbar/           # Dynamic navbar (changes based on user role)
│   ├── Footer/           # Footer with payment partners and social links
│   ├── Cart/             # Cart item components
│   ├── Charts/           # Recharts-based analytics components
│   └── ...               # Other reusable UI components
├── hooks/
│   └── useOnline.jsx     # Custom hook for internet connectivity detection
├── pages/
│   ├── Admin/            # Admin dashboard, vendors, products panels
│   ├── Cart/             # Shopping cart page
│   ├── Checkout/         # Order placement page
│   ├── Home/             # Landing/home page
│   ├── Login/            # Customer, Vendor, and Admin login pages
│   ├── Orders/           # Order history page
│   ├── ProductDetails/   # Single product detail view
│   ├── ProductSearch/    # Real-time search results page
│   ├── Signup/           # Customer and Vendor registration
│   ├── Unauthorized/     # 403 access denied page
│   ├── VendorDashboard/  # Vendor management panel
│   └── Wishlist/         # Saved products page
├── App.jsx               # Root component with all route definitions
├── main.jsx              # React entry point
└── index.css             # Global styles
```

---

## 🔑 Role-Based Access

FreshCart uses custom route guard components to protect pages based on user role.

| Route | Guard | Access |
|---|---|---|
| `/` `/product` `/search` | Public | Everyone |
| `/cart` `/checkout` `/allorders` | `ProtectedRoute` | Logged-in Customers |
| `/vendor` | `VendorProtectedRoute` | Approved Vendors only |
| `/admin` `/admin/vendors` `/admin/products` | `AdminProtectedRoute` | Admins only |
| `/login` `/signup` `/vendor-login` | `GuestRoute` | Non-logged-in users only |
| `/unauthorized` | Public | Shown on access denial |

### How JWT Auth Works

1. User logs in → backend returns a JWT token
2. Token is stored and decoded using `jwt-decode`
3. User role is extracted from the token payload
4. Route guards check the role before rendering the page
5. Unauthorized access redirects to `/unauthorized`

---

## 🌐 GitHub Pages Notes

This app is configured for GitHub Pages using `HashRouter` from React Router DOM. URLs use the `#` format (e.g., `/#/cart`) which is required for proper client-side routing on GitHub Pages.

A custom `404.html` in the `public/` folder and a redirect script in `index.html` handle page refreshes correctly.

GitHub Pages URL:
```
https://ahmed-devs3b.github.io/FreshCart--FrontEnd/
```

Vercel URL:
```
https://freshcart-eg.vercel.app/
```

---

## 📄 License

This project is for educational and portfolio purposes.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Ahmed-devS3B">Ahmed Ibrahim</a>
</div>

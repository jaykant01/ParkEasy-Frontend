<p align="center">
  <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="110" alt="Angular Logo"/>
</p>

<h1 align="center">🚗 ParkEasy Frontend</h1>

<p align="center">
  Modern Smart Parking Web Application built with Angular
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-17+-red?style=for-the-badge&logo=angular"/>
  <img src="https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript"/>
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwindcss"/>
  <img src="https://img.shields.io/badge/RxJS-Reactive-purple?style=for-the-badge"/>
  <img src="https://img.shields.io/badge/State-Services-green?style=for-the-badge"/>
</p>

---

# 📌 Overview

**ParkEasy Frontend** is a scalable, responsive, and production-ready Angular application designed for managing smart parking systems.

It provides:

- 🔐 JWT Authentication (Login / Register)
- 🅿️ Parking Lot Browsing
- 📅 Slot Booking System
- 📊 User Dashboard
- 👨‍💼 Admin Panel
- 🌙 Responsive & Modern UI
- ⚡ Optimized Lazy Loading Architecture
- 🛡 Route Guards & Role-based Access

---

# 🏗 Architecture Overview

The frontend follows a **modular and scalable architecture**:
### Design Principles

- Feature-based folder structure
- Lazy-loaded modules
- Separation of concerns
- Reusable shared components
- Centralized HTTP handling
- Environment-based configuration

---

# 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Angular 17+ |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Handling | RxJS + Services |
| HTTP Client | Angular HttpClient |
| Auth | JWT Token |
| Forms | Reactive Forms |
| Routing | Angular Router |
| Build Tool | Angular CLI |

---

# 🔐 Authentication Flow

1. User logs in.
2. Backend returns JWT token.
3. Token stored in `localStorage`.
4. HTTP Interceptor attaches token automatically.
5. Route Guards protect private routes.

### HTTP Interceptor Example

```ts
intercept(req: HttpRequest<any>, next: HttpHandler) {
  const token = localStorage.getItem('token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next.handle(req);
}
```
---
### 🌍 Environment Configuration

src/environments/environment.ts

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
---
### 🚀 Getting Started
1️⃣ Clone Repository
git clone https://github.com/your-username/parkeasy-frontend.git
cd parkeasy-frontend

2️⃣ Install Dependencies
npm install
npm i angular-setup
npx ng-setup

3️⃣ Run Development Server
ng serve

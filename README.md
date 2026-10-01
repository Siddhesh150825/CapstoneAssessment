# Smart Restaurant Management System

## Overview
This project is a full‑stack web application built as a capstone project.  
It helps restaurants manage menus, orders, reservations, and feedback while giving customers a smooth online experience.

---

## Tech Stack
- **Frontend:** React, Redux Toolkit, Axios, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** JWT (JSON Web Tokens)
- **Other:** Docker, GitHub Actions (CI/CD)

---

## Features

### Customer
- Register / Login
- Browse menu items
- Add items to cart and checkout
- Redirect to My Orders after placing an order
- View current orders and order history
- Reserve tables
- Submit feedback

### Admin
- Manage users, menu items, orders, reservations, and feedback
- Update order statuses (Preparing → Ready → Delivered)
- Dashboard with CRUD operations
- Secure access via JWT middleware

---

## Project Modules
1. **User Authentication** – JWT login/registration
2. **Menu Management** – CRUD for menu items
3. **Order Management** – Place orders, view `/my-orders`, track status
4. **Reservations** – Book tables by date/time
5. **Feedback** – Ratings and comments
6. **Admin Dashboard** – Manage everything centrally

---

## Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/<your-username>/smart-restaurant-management.git
cd smart-restaurant-management

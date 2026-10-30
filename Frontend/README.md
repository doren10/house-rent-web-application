# RentEase / HouseHunt — House Rent Web Application (MERN Stack)

Full-stack **House Rent Web Application (HouseHunt / RentEase)** built with **MongoDB, Express.js, React.js (Vite + Tailwind CSS + Ant Design), and Node.js**.

---

## 📁 Project Structure

- **[`Backend/`](../Backend)** — Express.js + Mongoose REST API Server (`PORT=8001`)
  - `config/connect.js` — MongoDB connection & automatic initial sample data seeder
  - `controllers/` — `userController.js`, `ownerController.js`, `adminController.js`
  - `middlewares/authMiddleware.js` — JWT cookie & Bearer token verification middleware
  - `models/` — `UserSchema.js`, `PropertySchema.js`, `BookingSchema.js`
  - `routes/` — `userRoutes.js`, `ownerRoutes.js`, `adminRoutes.js`
  - `uploads/` — Multer uploaded property images served statically at `/uploads`
  - `.env` — Environment variables (`PORT`, `MONGO_DB`, `MONGO_URI`, `JWT_KEY`)
  - `index.js` — Express server entry point

- **[`Frontend/`](./)** — React 19 + Vite + Tailwind CSS + Ant Design SPA (`http://localhost:5173`)
  - `src/modules/common/` — `Home.jsx`, `Login.jsx`, `Register.jsx`, `ForgotPassword.jsx`, `Toast.jsx`
  - `src/modules/admin/` — `AdminHome.jsx`, `AllUsers.jsx`, `AllProperty.jsx`, `AllBookings.jsx`
  - `src/modules/user/owner/` — `OwnerHome.jsx`, `AddProperty.jsx`, `AllProperties.jsx`, `AllBookings.jsx`
  - `src/modules/user/renter/` — `RenterHome.jsx`, `AllProperties.jsx`
  - `src/modules/user/AllPropertiesCards.jsx` — Property search, filtering (Address, Ad Type, Property Type), and booking modal

---

## 🚀 How to Run the Project

### 1. Start the Backend Server
```bash
cd Backend
npm install
npm run dev
```
- Runs on: `http://localhost:8001`
- Connects to MongoDB via `.env` (`mongodb://localhost:27017/HouseRent`) and automatically seeds initial sample users, properties, and bookings if the database is empty.

### 2. Start the Frontend Application
```bash
cd Frontend
npm install
npm run dev
```
- Runs on: `http://localhost:5173`

---

## 🔑 Default Demo Accounts (Auto-Seeded)

| Role | Name | Email | Password | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Abhi | `abhi@gmail.com` | `123456` | Full Admin Access |
| **Owner** | Pravanshu | `pravanshu@gmail.com` | `123456` | `granted` (Approved) |
| **Renter** | Ram | `ram@gmail.com` | `123456` | Active Renter/Tenant |

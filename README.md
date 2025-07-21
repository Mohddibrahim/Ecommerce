📦 E-Commerce MERN Website
An advanced, full-featured E-Commerce Web Application built using the MERN stack (MongoDB, Express, React, Node.js) with features like product browsing, cart, wishlist, user authentication, order tracking, review & ratings, admin panel, Razorpay integration, and more.

📌 Table of Contents

Features

Tech Stack

Installation

API Endpoints

Admin Features

✅ Features
👥 User
Register & Login with JWT Auth

Forgot Password with OTP Verification

Profile Management (Edit, Change Password)

Wishlist and Cart (Sync with backend)

Order Placement and Payment (Razorpay)

Order Tracking with Progress Bar

Review and Ratings with Media (Image/Video)

Complaint Submission System

Address Book Management

🛒 Shopping
Product Listing with Filter/Sort

Product Details Page

Add to Cart / Wishlist

Checkout with Address & Payment

Invoice Download (PDF)

🧑‍💼 Admin Panel
View & Manage Users, Sellers

Block/Unblock Sellers

View Complaints and Contact Queries

Reply to User Messages

View Orders, Products, Reviews

Product CRUD

🛠️ Tech Stack
Frontend	Backend	Database	Tools/Libs
React + Vite	Node.js	MongoDB	Axios, Bootstrap
React Router	Express.js	Mongoose	Multer, JWT, bcrypt
Context API	Razorpay API		jsPDF, Cloudinary

⚙️ Installation
1. Clone the Repo
bash
Copy
Edit
git clone https://github.com/yourusername/ecommerce-mern.git
cd ecommerce-mern
2. Setup Backend
bash
Copy
Edit
cd server
npm install
cp .env.example .env   # Add your DB_URI, JWT_SECRET, etc.
npm run dev
3. Setup Frontend
bash
Copy
Edit
cd client
npm install
npm run dev


🔗 API Endpoints
🔒 Auth
POST /api/auth/register – User Registration

POST /api/auth/login – User Login

POST /api/auth/forgot-password – Send OTP

POST /api/auth/reset-password – Reset Password

👤 User
GET /api/users/profile

PATCH /api/users/profile

GET /api/users/wishlist

GET /api/users/orders

🛍️ Product
GET /api/products/

GET /api/products/:id

POST /api/products/ (admin only)

📝 Reviews
GET /api/reviews/:productId

POST /api/reviews/

PATCH /api/reviews/:id

DELETE /api/reviews/:id

📦 Orders
POST /api/orders/place

GET /api/orders/user

PATCH /api/orders/:id/cancel

GET /api/orders/:id/invoice

📬 Contact / Complaint
POST /api/contact

POST /api/complaints

🛡️ Admin
GET /api/admin/users

GET /api/admin/complaints

POST /api/admin/contact/reply

PATCH /api/admin/seller/block/:id

🛠️ Admin Features
Feature	Description
Complaint Management	View and respond to complaints
User & Seller Control	Block/Unblock sellers
Contact Replies	Reply to contact messages
Orders Overview	View and manage all orders
Product Management	Add/Edit/Delete products

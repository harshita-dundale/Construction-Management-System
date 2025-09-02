# 🏗️ Builder & Worker Collaboration System – ConstructHub

A full-stack **MERN** web application designed to simplify collaboration between **builders** and **workers** in construction projects.  
The system manages **attendance, payroll, job applications, track status and browse job** with role-based dashboards for both builders and workers.

---

## 🚀 Features

### 👷 Worker
- browse job and apply for this
- track status of applied job pending, rejected, accepted or joined  
- Track attendance history (present/absent)  
- View payment summaries & history  
- Secure login and access only to own data
- Update and manage personal profile details with image upload (Cloudinary integration)

### 🏗️ Builder
- Add projects and manage job postings, view posted jobs
- Accept or reject worker applications
- filter worker applications by experience and status
- Mark daily attendance (individual or bulk)  
- Automatic payroll summary based on attendance  
- View attendance/payment history per worker & project
- Material Management add, update, delete and search material
- Manage profile details with image upload (Cloudinary integration)

---

## 🛠 Tech Stack
- **Frontend:** React.js, Redux Toolkit, Bootstrap, Auth0 
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Authentication:** Auth0 (JWT for secure access)  
- **Version Control:** Git, GitHub


 ⚙️ Installation & Setup
# Clone the repository
git clone <your-repo-link>

# Go to project directory
cd construction-management-system

# Install dependencies
npm install

# Run backend server
cd backend
npm install
npm start

# Run frontend
cd frontend
npm install
npm start

🔑 Environment Variables
Create a .env file in backend folder with:

MONGO_URI=your_mongodb_connection_string
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
AUTH0_DOMAIN=your_auth0_domain
PORT=5000

📌 Usage
Builders login → create/manage jobs, track attendance, monitor site profit/loss
Workers login → browse jobs, apply, check status & history
Real-time updates ensure smooth communication between builders and workers

🏆 Learning Outcomes
Role-based access system in MERN stack
Integrating Auth0 authentication in full-stack projects
Building real-time dashboards with React and APIs
Designing scalable MongoDB database structures

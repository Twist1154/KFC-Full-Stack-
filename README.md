# 🍗 KFC Drive-Through Voice Ordering App  

This application allows customers to place orders at a KFC drive-through using **voice commands**. It provides a seamless ordering experience through a **React + Vite** frontend, **Express.js** backend, and **Houndify** for voice recognition.  

---

## 🚀 Key Technologies  

### **Frontend (React + Vite)**  
✅ **Material-UI** for a sleek and responsive interface  
✅ **Grid layout** to display menu items  
✅ **Floating microphone button** for hands-free ordering  
✅ **Order summary and cart management**  

### **Voice Recognition (Houndify)**  
The `HoundifyService` class powers voice recognition:  
🔹 Initializes the **Houndify client**  
🔹 Captures audio from the user’s microphone  
🔹 Converts **speech to text**  
🔹 Provides **real-time transcription updates**  
🔹 Delivers **text-to-speech feedback**  

### **Backend (Express + PostgreSQL)**  
The server handles:  
🔹 **Menu management** – Stores and retrieves menu items  
🔹 **Cart management** – Tracks session-based shopping carts  
🔹 **Order processing** – Creates and tracks orders  
🔹 **Database interactions** – Stores orders and menu data  

---

## 🎤 How It Works  

### 🛒 **Voice Ordering Process**  
1️⃣ User clicks the **microphone button**  
2️⃣ Speaks their order (e.g., *"I want a 21-piece bucket"*)  
3️⃣ System recognizes the items and **adds them to the cart**  
4️⃣ Provides **voice feedback** to confirm the order  

### 🛍️ **Cart Management**  
✔️ Tracks carts using **session IDs (UUID)**  
✔️ Supports **adding/removing items**  
✔️ **Calculates total prices** dynamically  
✔️ Persists cart data **between page refreshes**  

### 🏷️ **Order Processing**  
✔️ **Validates orders** before checkout  
✔️ Stores order details in **PostgreSQL**  
✔️ Handles the **checkout process**  
✔️ Maintains **order history** for tracking  

---

## 🔄 Data Flow  

```plaintext
User Voice Command
  ↓
Houndify Service (Speech-to-Text)
  ↓
React Frontend
  ↓
API Service / Order Service
  ↓
Express Backend
  ↓
PostgreSQL Database
```

---

## 🎯 Summary  
This application delivers a **modern, hands-free** ordering experience, replicating a real KFC drive-through but via a **web interface**. 🚗🎙️  

---

## 📜 Scripts & Setup  

This project is powered by **Vite (React)** for the frontend and **Express.js** for the backend. Below are the key scripts used in `package.json`:  

### **Main Scripts**  
| Script          | Command                 | Description |
|----------------|-------------------------|-------------|
| **Start Frontend** | `npm run dev` | Starts the **Vite development server** |
| **Build Frontend** | `npm run build` | Builds the production-ready frontend |
| **Preview Frontend** | `npm run preview` | Serves the built frontend locally |
| **Start Backend (Admin Panel)** | `npm run start:admin` | Runs the **Express.js admin server** |
| **Run Linter** | `npm run lint` | Runs **ESLint** to check for code issues |

---

## 🛠️ Tech Stack  

### **Frontend**  
✅ **React (Vite) + MUI**  
✅ **Axios** for API requests  
✅ **RecordRTC** for audio capture  

### **Backend**  
✅ **Express.js** for server-side logic  
✅ **PostgreSQL** with **Sequelize ORM**  
✅ **UUID** for cart session tracking  

### **Voice Recognition**  
✅ **Houndify** for **speech-to-text**  

### **Development Tools**  
✅ **ESLint** for linting (`@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)  
✅ **CORS & Dotenv** for environment configurations  
✅ **Vite + React Plugin** for frontend optimizations  

---

## 📌 How to Run the Project  

1️⃣ **Clone the Repository:**  
```sh
git clone https://github.com/your-repo/kfc-drive-through.git
cd kfc-drive-through
```
2️⃣ **Install Dependencies:**
```sh
npm install
```
3️⃣ **Start the Backend:**
```sh 
npm run start:admin
```
4️⃣ **Start the Frontend:**
```sh
npm run dev
```
---

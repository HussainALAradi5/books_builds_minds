# 📖 Books Builds Minds

👨‍💻 By: Hussain Al Aradi  
📧 [Gmail](mailto:hussainaradi.ha@gmail.com) | 🐙 [GitHub](https://github.com/HussainALAradi5) | 💼 [LinkedIn](https://www.linkedin.com/in/hussainalaradi/)

---

## 📝 Description

**Books Builds Minds** is a full-stack bookstore web app offering a smooth, responsive, and interactive experience. Users can browse, review, and purchase books with a clean UI and intuitive UX.

---

## 🧰 Technologies Used

- React (Frontend)
- Flask (Backend)
- PostgreSQL (Database)
- JavaScript, Python, HTML, CSS
- Node.js & Vite

---

## 🚀 Getting Started

### 🔧 Backend Setup (Flask + PostgreSQL)

#### 🐘 Install PostgreSQL

**Ubuntu/Linux:**

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS (Homebrew):**

```bash
brew update
brew install postgresql
brew services start postgresql
```

**Windows:**

- Download from: https://www.postgresql.org/download/windows
- Add PostgreSQL to PATH
- Run:

```powershell
psql -U postgres
```

---

#### 🗃️ Create Database & Role

```bash
sudo -i -u postgres
psql
```

Inside `psql`:

```sql
CREATE ROLE your_username WITH LOGIN PASSWORD 'your_password';
CREATE DATABASE your_database_name OWNER your_username;
\q
```

---

### 🔐 Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://your_username:your_password@localhost/your_database_name
SECRET_KEY=your_generated_key_here
VITE_API_URL=http://localhost:5000/api
```

Generate a secret key:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### 🧪 Python Virtual Environment

**Ubuntu/Linux/macOS:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Windows (PowerShell):**

```powershell
python -m venv .venv
.venv\Scripts\activate
```

---

### 📦 Install Python Packages

```bash
pip install -r requirements.txt
```

---

### ⚛️ React Client Setup (Already Installed)

Your React frontend is already set up using **Vite**. To run the development server:

```bash
cd client
npm run dev
```

Then visit:  
🌐 `http://localhost:5173`

If needed, reinstall dependencies:

```bash
npm install
```

To build for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

---

## 📚 Project Overview

Books Builds Minds is designed to be scalable, user-friendly, and visually engaging. It supports user authentication, book reviews, purchase flow, and admin features.

---

## 📌 Instructions: TBA

---

## 🧭 UML Diagrams

<details>
<summary>📊 UML Diagram</summary>

![UML Diagram](./images/Books_Builds_Minds-UML_Diagram.drawio.png)

</details>

<details>
<summary>📐 Hierarchy Diagram</summary>

![Hierarchy Diagram](./images/Books_Builds_Minds-Hierarchy_diagram.drawio.png)

</details>

---

## 🌟 Features

1. User account creation/edit/removal
2. Review system with edit/delete options
3. Authentication system
4. Responsive UI and smooth UX
5. Review history tracking
6. Book purchasing

---

## 🖼️ Screenshots

- authorization:

![image#0](../books_builds_minds/images/screen_01.png.png)
![image#1](../books_builds_minds/images/authorization.png)
![image#2](../books_builds_minds/images/authorization_02.png)
![gust_view](../books_builds_minds/images/gust_view.png)
![interactive](../books_builds_minds/images/intractive.gif)

![interactive_with_user](../books_builds_minds/images/intractive_with_user.gif)

### 📸 Showcase: TBA

### 🎞️ Animated Showcase: TBA

---

## 🚧 Future Updates

- [ ] Add API to fetch books
- [ ] Organize books into categories
- [ ] More enhancements coming soon...
- [ ] add mobile version

---

## 🙌 Credits

- Google (for images)

---

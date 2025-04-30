

# Dhyan - Daily Task Scheduling & Management UI

> *Focus on what matters — one task at a time.*

---

## 📚 Project Overview

**Dhyan** is a lightweight task management web application built using **Next.js** and **TailwindCSS**.  
It allows users to **plan**, **start**, **track**, and **complete** their daily tasks with a visual, intuitive interface.

Users can:
- Add up to **5 tasks** per day.
- Set a title, description, and estimated completion time.
- Start one task at a time with a live **progress bar**.
- Complete tasks and track how many tasks they finished.
- **Drag and drop** to reorder tasks.
- Persist their task data even after refreshing (via **localStorage**).

No backend server is required — everything works in the browser!

---

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Drag and Drop**: [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (lightweight library)
- **Persistence**: Browser's LocalStorage
- **Animations**: Framer Motion (optional)

---

## ✨ Features

- **Add, Edit, Delete** daily tasks.
- **Start Task** with a live animated **progress bar**.
- Only **one task** can be in progress at a time.
- **Complete Task** once progress is finished.
- **Drag-and-Drop** task reordering.
- **Simple Analytics**: See the number of completed tasks today.
- **Persistent Data** across page refreshes.
- **Responsive UI** for mobile and desktop.

---

## 📂 Project Structure

```
/dhyan
 ├── /app
 │    ├── page.tsx (Home page)
 │    ├── /components
 │    │    ├── TaskCard.tsx
 │    │    ├── TaskForm.tsx
 │    │    ├── ProgressBar.tsx
 │    │    ├── TaskList.tsx
 │    │    └── StatsBar.tsx
 │    ├── /hooks
 │    │    └── useTasks.ts (Custom hook for task management)
 │    ├── /types
 │    │    └── task.ts (TypeScript types)
 │    └── /utils
 │         └── localStorageHelpers.ts (Helpers for localStorage)
 ├── tailwind.config.ts
 ├── postcss.config.js
 ├── next.config.js
 ├── package.json
 ├── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/dhyan.git
cd dhyan
```

### 2. Install Dependencies
```bash
npm install
```
or
```bash
yarn install
```

### 3. Run the Development Server
```bash
npm run dev
```
or
```bash
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

---

## 🏗 Building for Production
To create an optimized production build:
```bash
npm run build
npm run start
```
The app will be available at `localhost:3000`.

---

## 🧩 Usage Guide

1. **Add Task**:
   - Click "Add Task" button.
   - Fill in Title, Description, and Estimated Time (minutes).
   - Save.

2. **Start Task**:
   - Press the "Start Task" button on any pending task.
   - Progress bar will start based on estimated time.

3. **Complete Task**:
   - After finishing, click "Complete Task".

4. **Drag and Drop**:
   - Rearrange tasks by dragging them.

5. **Persistence**:
   - Tasks will remain even if you refresh the page.

---

## 🔥 Bonus Features (Optional)

- **Daily Reset**: Tasks automatically clear the next day.
- **Dark Mode**: Toggle light/dark themes.
- **Simple Statistics**: Number of tasks created/completed today.
- **Animations**: Smooth transitions between actions.

---

## 📸 Screenshots (optional)

> _Add screenshots or GIF demos here if you want._

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Inspired by the need for better daily focus.
- Built with ❤️ using Next.js and TailwindCSS.

---

# 🚀 Ready to stay focused? Start with **Dhyan**!

---
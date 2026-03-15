---
description: How to start the AjantaElloraOdyssey project
---
To run this project locally, follow these steps:

1. **Start the Backend Server**
   Run the following command in your terminal:
   ```bash
   npm start
   ```
   This will start the server on [http://localhost:5000](http://localhost:5000).

2. **Open the Frontend**
   - **Option A (Recommended)**: Open [http://localhost:5000/blog.html](http://localhost:5000/blog.html) in your browser. This uses the backend server to serve the frontend files directly.
   - **Option B (Development)**: If you use VS Code Live Server, open `public/blog.html` and run the Live Server. The frontend is configured to automatically fall back to the backend on port 5000 if it detects a port mismatch.

3. **Verify Connection**
   - Ensure you see the "Latest Stories" with seeded blog posts.
   - If you see "Failed to load blogs", check if the terminal running `npm start` shows "MongoDB connected successfully".

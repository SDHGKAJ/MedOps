# Docker Commands Cheat Sheet for MedOps

## The Easy Way (Docker Compose)
Use these commands in this directory (`c:\Users\arsha\Desktop\MedOps`) to manage the entire application at once.

* **Start the full application:**
  ```bash
  docker-compose up
  ```

* **Start the full app in the background (detached mode):**
  ```bash
  docker-compose up -d
  ```

* **Stop the running application:**
  ```bash
  docker-compose down
  ```

* **Build fresh images strictly (run this if you change code in the Dockerfiles or package.json):**
  ```bash
  docker-compose up --build
  ```

* **Completely wipe running containers and delete old images built by this project:**
  ```bash
  docker-compose down --rmi all
  ```

---

## The Hard Way (Manual Docker Run)
If you want to run the specific images manually instead of relying on `docker-compose.yml`:

* **Run the Frontend manually (mapped to port 8080):**
  ```bash
  docker run -p 8080:80 medops-frontend:latest
  ```

* **Run the Backend manually (passing the Atlas .env file):**
  ```bash
  docker run -p 5000:5000 --env-file ./backend/.env medops-backend:latest
  ```

---

## The Nuclear Option (Clean up disk space)
* **Delete ALL unused Docker containers, networks, and images from your entire computer (highly recommended to save space):**
  ```bash
  docker system prune -a
  ```

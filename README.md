🚀 Node.js + Redis + MySQL with Docker Compose

**📖 Overview**
This project demonstrates a Node.js API interacting with Redis (cache) and MySQL (database).

✅ Checks Redis cache first for requested data
✅ If cache miss, fetches data from MySQL
✅ Stores results back in Redis for faster subsequent requests

This is an excellent example of using Docker Compose for multi-container applications.

**🛠️ Technologies Used**
Technology	 Purpose
Node.js	     Backend API
Redis	       Cache layer
MySQL	       Database

**Docker	Containerization**

Compose	Multi-container orchestration

**⚡ Project Setup**
Clone this repository:
git clone <your-github-repo-url>
cd <your-project-folder>
Make sure Docker & Docker Compose are installed:
docker --version
docker-compose --version
(Optional) Install Node.js dependencies locally:
npm install

**📝 Creating docker-compose.yml**
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - MYSQL_HOST=mysql
      - MYSQL_USER=root
      - MYSQL_PASSWORD=example
      - MYSQL_DATABASE=testdb
    depends_on:
      - redis
      - mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: testdb
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql

volumes:
  mysql-data:
📦 Build & Push Docker Image
Build your Node.js Docker image:
docker build -t <your-dockerhub-username>/node-redis-mysql-app:latest .
Login to Docker Hub:
docker login
Push the image:
docker push <your-dockerhub-username>/node-redis-mysql-app:latest
🏃 Running the Project

Run all containers:

docker-compose up
Node.js app → localhost:3000
Redis → localhost:6379
MySQL → localhost:3306

Node.js API fetches data from Redis first; if not found, it queries MySQL and updates Redis cache.

🧹 Clean Up

Stop and remove all containers:

docker-compose down

Remove containers and volumes (for MySQL data):

docker-compose down -v
🔗 Workflow Diagram
+-----------------+
|   Node.js App   |
+-----------------+
        |
        v
  +-------------+
  |   Redis     |  <-- Cache Layer
  +-------------+
        |
        v
  +-------------+
  |   MySQL     |  <-- Persistent Storage
  +-------------+
🎯 Summary

This project demonstrates:

Multi-container orchestration using Docker Compose
Node.js interaction with Redis + MySQL
Building, pushing, and running Docker images
Real-world caching + DB workflow

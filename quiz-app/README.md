# 🧠 Quiz App – Microservices-Based Architecture

A full-stack quiz management system designed using Node.js, Express, MongoDB, and Docker. This app follows microservices principles to ensure scalability and maintainability. The system consists of an API gateway, a user authentication service, a quiz management service, and a shared MongoDB instance.

---

## 🚀 Features

- 🧾 User registration and login (JWT-based)
- 🎯 Quiz creation, question grouping, and option-based answering
- 🧪 Submit entire quiz at once
- 📊 Track scores and multiple attempts
- 🔐 Protected routes using JWT
- 🧩 Microservices architecture
- 🐳 Fully containerized using Docker & Docker Compose

---

## 🛠 Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Docker
- Docker Compose
- MongoDB Compass (optional for DB viewing)

---

## 📦 Folder Structure

```
quiz-app/
├── api-gateway/
├── user-service/
│   ├── models/
│   ├── routes/
│   └── index.js
├── quiz-service/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── index.js
├── docker-compose.yml
└── README.md
```

---

## 🧰 Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/Nikhil-Mane/Quiz-app.git
cd quiz-app
```

2. Start all services using Docker:
```bash
docker-compose up --build
```

3. Open:
- API Gateway: http://localhost:3000
- MongoDB Compass (optional): `mongodb://localhost:27017`

---

## 🔐 Authentication (User Service)

### `POST /api/auth/signup`
Registers a new user.

```json
{
  "email": "test@example.com",
  "password": "test123"
}
```

### `POST /api/auth/login`
Authenticates user and returns a JWT.

```json
{
  "email": "test@example.com",
  "password": "test123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Use in headers:
```
Authorization: Bearer <token>
```

---

## ❓ Quiz APIs (Protected by JWT)

### `POST /api/quizzes`
Create a quiz with multiple questions.

```json
{
  "title": "Frontend Fundamentals",
  "questions": [
    {
      "text": "What does HTML stand for?",
      "options": ["Hyper Text Markup Language", "Hot Mail", "How To Make Lasagna"],
      "correct_option": 0
    },
    {
      "text": "Which one is a JavaScript framework?",
      "options": ["Laravel", "Django", "React", "Flask"],
      "correct_option": 2
    }
  ]
}
```

---

### `GET /api/quizzes/:quizId`
Retrieve quiz (without showing correct answers).

---

### `POST /api/quizzes/:quizId/submit`
Submit all answers at once.

#### Request:
```json
{
  "answers": [
    { "question_id": "64f123...", "selected_option": 0 },
    { "question_id": "64f456...", "selected_option": 2 }
  ]
}
```

#### Response:
```json
{
  "attempt": 2,
  "score": 2,
  "total_questions": 2,
  "passed": true,
  "answers": [
    {
      "question_id": "64f123...",
      "selected_option": 0,
      "is_correct": true,
      "correct_option": 0
    },
    ...
  ]
}
```

---

### `GET /api/quizzes/:quizId/results/:userId`
View all attempt results for a specific user and quiz.

#### Response:
```json
{
  "attempts": 2,
  "results": [
    {
      "attempt": 1,
      "score": 1,
      "passed": false
    },
    {
      "attempt": 2,
      "score": 2,
      "passed": true
    }
  ]
}
```

---

## 🧪 Sample Quiz Data for Testing

```json
{
  "title": "JavaScript Basics",
  "questions": [
    {
      "text": "What is the result of typeof null?",
      "options": ["object", "null", "undefined", "function"],
      "correct_option": 0
    },
    {
      "text": "Who maintains Node.js?",
      "options": ["Facebook", "Google", "Microsoft", "OpenJS Foundation"],
      "correct_option": 3
    }
  ]
}
```
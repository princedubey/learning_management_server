<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://academyocean.com/img/webflow/solution/retail/center-lms-img.png" alt="Project logo"></a>
</p>

<h3 align="center">LMS Backend Server</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/princedubey/LMS-Server.svg)](https://github.com/princedubey/employee-management-server/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/princedubey/LMS-Server.svg)](https://github.com/princedubey/employee-management-server/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> 
    Welcome to the Learning Management System (LMS). This project provides a comprehensive set of features to manage courses, users, orders, notifications, and more. 
    <br> 
    The system includes functionalities for course management, user authentication, notifications, analytics, and layout management.
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)
- [Acknowledgements](#acknowledgements)

## 🧐 About <a name = "about"></a>

The Learning Management System (LMS) is a platform designed to manage and deliver online courses. It includes features for user authentication, course creation and management, order processing, notifications, analytics, and layout customization. The backend system is built using the stack (MongoDB, Express.js, Node.js, Redis, NodeMailer) and integrates with Cloudinary for image management.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:

- Node.js
- MongoDB
- Cloudinary Account
- Redis

### Installing

1. **Clone the repository:**

   ```sh
   git clone https://github.com/princedubey/LMS-Server.git
   cd LMS-Server
   npm install

2. **Install dependencies:**
   ```sh
   npm install

3. **Set up environment variables:**
    ```sh
    PORT = 3000
    VERSION = v1
    NODE_ENV = DEV
    ORIGIN = ['http://localhost:3000']
    JWT_SECRET = kseh83efhJGEo93JFleh50uhdihdf

    DB_URL = mongodb+srv://username:password@lms.zo8ir99.mongodb.net/?retryWrites=true&w=majority&appName=lms

    EMAIL_USER = prince@gmail.com
    EMAIL_PASS = aoihoefofbohfoehfod

    CLOUD_NAME = dippi7922qdu0
    CLOUD_API_KEY = 4165274322419915279
    CLOUD_SECRET_KEY = QQll8d3o2r213oS78783Yo6ch43Vq8HEc

    REDIS_URL = redis://default:AdW2AAInDK_*^ze2DFmNzExODUzNDAxZGY0NDU3YWVlNGIzY2QyMDUxMDExMXAxNTQ3MTA@healthy-tapir-54710.upstash.io:6379

4. **Start the server:**
    ```sh
    npm start

## 🎈 Usage <a name="usage"></a>

Access the API at http://localhost:3000/api.

## 🚀 Deployment <a name = "deployment"></a>

For deployment purposes will create cloud services soon.

## ⛏️ Built Using <a name = "built_using"></a>

- [MongoDB](https://www.mongodb.com/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [NodeJs](https://nodejs.org/en/) - Server Environment
- [Cloudinary](https://cloudinary.com/) - Image upload Cloud
- [Redis](https://redis.io/) - Cache In memory Database

## ✍️ Authors <a name = "authors"></a>

- [@princedubey](https://github.com/princedubey) - Idea & Complete Development

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Hat tip to anyone whose'll become part of this project.
- Thank you for your contributions.


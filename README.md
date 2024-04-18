
# User Management API

This is a RESTful API for managing user data. It allows you to register new users, authenticate users, retrieve user information, update user profiles, and delete user accounts.

## Base URL

The base URL for accessing the API is:

```
http://localhost:4100/
```

## Endpoints

### Register a New User

- **URL:** `POST /users/register`
- **Description:** Register a new user with a unique email address and a secure password.
- **Request Body:**
  - `name`: User's name
  - `email`: User's email address
  - `password`: User's password
  - `role`: User's role (optional, defaults to 'User')
- **Access:** Public

### Login

- **URL:** `POST /users/login`
- **Description:** Authenticate a user and generate an access token for authorization.
- **Request Body:**
  - `email`: User's email address
  - `password`: User's password
- **Access:** Public

### Get All Users
- **URL:**  `URL: GET /users`
- **Description:** Description: Get a list of all users along with role counts (Admin, Manager, Staff, User).
- **Access:** Access: Protected (Requires authentication token) and role should be Admin or Manager

### Get Limited Users

- **URL:** `GET /users?page=1&limit=3`
- **Description:** Get a limited number of users with optional pagination parameters for page and limit.
- **Access:** Protected (Requires authentication token) and role should be Admin or Manager

### Get User by ID

- **URL:** `GET /users/:id`
- **Description:** Get user details by user ID.
- **Access:** Public

### Update User

- **URL:** `PUT /users/:id`
- **Description:** Update user details by user ID.
- **Access:** Public

### Delete User

- **URL:** `DELETE /users/:id`
- **Description:** Delete user account by user ID.
- **Access:** Public

### Upload Profile Picture

- **URL:** `POST /users/upload`
- **Description:** Upload a profile picture for the authenticated user.
- **Access:** Protected (Requires authentication token)

### Get Users by CreatedAt Month

- **URL:** `GET /users/month/:month`
- **Description:** Get users created in a specific month.
- **Access:** Public

## Usage

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Set up your MongoDB database and configure the connection string in `.env` file.
4. Start the server using `npm start`.

## Dependencies

- Express.js: Web framework for Node.js
- Mongoose: MongoDB object modeling for Node.js
- Bcrypt: Password hashing library
- JSON Web Token (JWT): Authentication and authorization library
- Multer: Middleware for handling file uploads
- Redis: In-memory data structure store (optional, for caching)
- Cloudinary: Cloud-based image and video storage

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
mongoURL=your_mongodb_connection_string
port=4100
JWT_SECRET=the_secret_key
redisName='default'
redisPassword=your_redis_password
cloudName=your_cloudinary_cloud_name
apiKey=your_cloudinary_api_key
apiSecret=your_cloudinary_api_secret
```

## Author

Your Name
- GitHub: [Your GitHub Profile](https://github.com/yourusername)

---

Feel free to adjust the environment variables section as per your specific configuration. This README.md provides a basic structure that you can expand upon with more detailed information about your API and setup.
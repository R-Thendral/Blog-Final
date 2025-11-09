# BlogSphere - Full-Stack Blog Application

This is a unified full-stack application that combines both frontend (React) and backend (Express/Node.js) in a single directory.

## Features

- User authentication (Register/Login)
- Create, read, update, and delete blog posts
- Comments on posts
- Like/unlike posts
- Role-based access (Reader, Author, Admin)
- Modern UI with Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the root of the `frontend` directory with the following variables:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/blogsphere

# JWT Secret Key (change this to a random string in production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port (default: 5000)
PORT=5000

# Node Environment
NODE_ENV=development
```

### 3. Database Setup

Make sure MongoDB is running on your system. You can:
- Install MongoDB locally, or
- Use MongoDB Atlas (cloud) and update the `MONGO_URI` accordingly

### 4. Running the Application

#### Development Mode

To run both frontend and backend together:
```bash
npm run dev
```

This will start:
- Express server on port 5000 (API)
- React development server on port 3000 (Frontend)

Alternatively, you can run them separately:
```bash
# Terminal 1: Start the backend API server
npm run server

# Terminal 2: Start the React frontend
npm run client
```

#### Production Mode

1. Build the React app:
```bash
npm run build
```

2. Set `NODE_ENV=production` in your `.env` file

3. Start the server:
```bash
npm start
```

The server will serve both the API and the React app from port 5000.

## Project Structure

```
frontend/
├── config/          # Database configuration
├── models/          # Mongoose models (User, Post, Comment, Like)
├── routes/          # API routes (auth, posts, comments, likes)
├── middleware/      # Authentication middleware
├── src/             # React frontend source code
│   ├── components/  # React components
│   ├── pages/       # Page components
│   ├── context/     # React context (AuthContext)
│   └── utils/       # Utility functions (axios config)
├── public/          # Public static files
├── server.js        # Express server (serves API + React in production)
└── package.json     # Dependencies and scripts
```

## API Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (Author/Admin only)
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments` - Add comment
- `DELETE /api/comments/:id` - Delete comment
- `GET /api/likes/post/:postId` - Get likes count
- `POST /api/likes/post/:postId` - Like a post
- `DELETE /api/likes/post/:postId` - Unlike a post

## Technologies Used

- **Frontend**: React, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens), bcrypt

## Notes

- In development, the React app runs on port 3000 and the API on port 5000
- In production, everything is served from port 5000
- The API routes are prefixed with `/api`
- Make sure MongoDB is running before starting the server


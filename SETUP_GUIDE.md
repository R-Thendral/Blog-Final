# Complete Setup Guide - BlogSphere

Follow these steps to run the application:

## Prerequisites

Before starting, make sure you have installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Choose one option:
  - **Option A**: MongoDB Community Server (local) - [Download here](https://www.mongodb.com/try/download/community)
  - **Option B**: MongoDB Atlas (cloud, free tier available) - [Sign up here](https://www.mongodb.com/cloud/atlas/register)

---

## Step-by-Step Instructions

### Step 1: Navigate to the Frontend Directory

Open your terminal/command prompt and navigate to the frontend folder:

```bash
cd NewBlog/frontend
```

### Step 2: Install Dependencies

Install all required packages:

```bash
npm install
```

This will install all frontend and backend dependencies. Wait for it to complete (may take 2-5 minutes).

### Step 3: Set Up MongoDB

#### If using Local MongoDB:
1. Make sure MongoDB is installed and running
2. Start MongoDB service:
   - **Windows**: MongoDB should start automatically, or run `net start MongoDB` in admin command prompt
   - **Mac/Linux**: Run `sudo systemctl start mongod` or `brew services start mongodb-community`

#### If using MongoDB Atlas (Cloud):
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier)
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for all IPs)
5. Get your connection string (it will look like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/blogsphere`)

### Step 4: Create Environment Variables File

Create a `.env` file in the `frontend` directory:

**For Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/blogsphere
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/blogsphere?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
PORT=5000
NODE_ENV=development
```

**Important Notes:**
- Replace `your_super_secret_jwt_key_change_this_in_production_12345` with a random string (at least 32 characters)
- Replace the MongoDB Atlas connection string with your actual credentials
- Make sure there are **no spaces** around the `=` sign
- The `.env` file should be in the `frontend` folder (same level as `package.json`)

### Step 5: Verify MongoDB Connection

Make sure MongoDB is running and accessible:
- **Local**: Check if MongoDB service is running
- **Atlas**: Verify your connection string is correct

### Step 6: Run the Application

#### Development Mode (Recommended for first time):

Run both frontend and backend together:

```bash
npm run dev
```

This will start:
- ✅ Backend API server on **http://localhost:5000**
- ✅ React frontend on **http://localhost:3000**

You should see output like:
```
🚀 BlogSphere Server running on port 5000
🔧 Development mode: API server running
💡 Run "npm run dev" to start both frontend and backend
```

And in another process:
```
Compiled successfully!
You can now view blogsphere in the browser.
  Local:            http://localhost:3000
```

#### Alternative: Run Separately (Two Terminals)

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### Step 7: Access the Application

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the BlogSphere homepage

### Step 8: Test the Application

1. **Register a new user:**
   - Click "Register" or go to `/register`
   - Fill in username, email, and password
   - Click "Register"

2. **Login:**
   - Click "Login" or go to `/login`
   - Enter your email and password
   - Click "Login"

3. **Create a post (if you're an author):**
   - After registration, you'll be a "reader" by default
   - To create posts, you need "author" role (you can manually change this in the database, or modify the registration to allow author role)

---

## Production Mode

To run in production:

1. **Build the React app:**
   ```bash
   npm run build
   ```

2. **Update `.env` file:**
   ```env
   NODE_ENV=production
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access the app:**
   - Go to: **http://localhost:5000**
   - Both API and frontend are served from the same port

---

## Troubleshooting

### Issue: "Cannot connect to MongoDB"
- **Solution**: Make sure MongoDB is running (local) or your Atlas connection string is correct

### Issue: "Port 5000 already in use"
- **Solution**: Change the PORT in `.env` file to a different port (e.g., 5001)

### Issue: "Port 3000 already in use"
- **Solution**: React will automatically use the next available port (3001, 3002, etc.)

### Issue: "Module not found" errors
- **Solution**: Run `npm install` again in the frontend directory

### Issue: "JWT_SECRET is not defined"
- **Solution**: Make sure your `.env` file exists and has JWT_SECRET defined

### Issue: CORS errors
- **Solution**: The server already has CORS enabled. If issues persist, check that the frontend is connecting to the correct API URL

---

## Quick Command Reference

```bash
# Install dependencies
npm install

# Development mode (both frontend and backend)
npm run dev

# Backend only
npm run server

# Frontend only
npm run client

# Build for production
npm run build

# Production mode
npm start
```

---

## Need Help?

- Check the console for error messages
- Verify all environment variables are set correctly
- Make sure MongoDB is running
- Ensure all dependencies are installed

---

## Next Steps

After the app is running:
1. Register a user account
2. Explore the blog features
3. Create posts (if you have author role)
4. Test comments and likes functionality

Enjoy your BlogSphere application! 🚀


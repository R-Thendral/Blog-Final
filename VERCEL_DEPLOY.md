# Deploying BlogSphere to Vercel

This guide will help you deploy your full-stack BlogSphere application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. MongoDB Atlas account (or your MongoDB connection string)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Step-by-Step Deployment

### 1. Prepare Your Code

Make sure your code is committed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Set Up Environment Variables in Vercel

Before deploying, you'll need to set up environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

**Important Notes:**
- For MongoDB Atlas, use a connection string like: `mongodb+srv://username:password@cluster.mongodb.net/blogsphere`
- Make sure to whitelist Vercel's IP addresses (or use `0.0.0.0/0` for all IPs) in MongoDB Atlas
- Use a strong, random string for `JWT_SECRET`

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `NewBlog/frontend` (if your repo has the NewBlog folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. Add environment variables (from Step 2)
6. Click **"Deploy"**

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to your frontend directory:
   ```bash
   cd NewBlog/frontend
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. Follow the prompts and add environment variables when asked

### 4. Configure Build Settings

If deploying via dashboard, make sure these settings are correct:

- **Root Directory**: `NewBlog/frontend` (or just `frontend` if that's your root)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

### 5. Update API Base URL (if needed)

The app is configured to use relative paths in production, so it should work automatically. However, if you need to set a custom API URL, you can add:

```
REACT_APP_API_URL=https://your-vercel-app.vercel.app
```

But this shouldn't be necessary since we're using relative paths.

### 6. Test Your Deployment

After deployment:

1. Visit your Vercel URL (e.g., `https://your-app.vercel.app`)
2. Test the following:
   - ✅ Home page loads
   - ✅ Register a new user
   - ✅ Login
   - ✅ Create a post (if you're an author)
   - ✅ View posts
   - ✅ Delete posts

## Troubleshooting

### Issue: API routes return 404

**Solution**: Make sure `vercel.json` is in the `frontend` directory and the routes are configured correctly.

### Issue: MongoDB connection fails

**Solution**: 
- Check your `MONGO_URI` environment variable in Vercel
- Make sure MongoDB Atlas allows connections from anywhere (or add Vercel IPs)
- Verify your MongoDB credentials are correct

### Issue: Build fails

**Solution**:
- Check build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Issue: Environment variables not working

**Solution**:
- Make sure variables are set in Vercel dashboard
- Redeploy after adding/changing environment variables
- Check variable names match exactly (case-sensitive)

## Project Structure for Vercel

```
frontend/
├── api/
│   └── index.js          # Serverless function for API
├── build/                # React build output (generated)
├── config/               # Database config
├── models/               # Mongoose models
├── routes/               # API routes
├── src/                  # React source code
├── vercel.json           # Vercel configuration
├── package.json
└── .env                  # Local env (not deployed)
```

## Important Notes

1. **MongoDB Atlas**: Use MongoDB Atlas (cloud) for production. Local MongoDB won't work on Vercel.

2. **Environment Variables**: Never commit `.env` files. Set them in Vercel dashboard.

3. **Build Time**: The first build may take a few minutes. Subsequent builds are faster.

4. **Serverless Functions**: API routes run as serverless functions on Vercel, which is perfect for this app.

5. **Custom Domain**: You can add a custom domain in Vercel settings after deployment.

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Make sure MongoDB Atlas is accessible

Happy deploying! 🚀


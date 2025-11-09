# Quick Vercel Deployment Guide

## 🚀 Deploy in 5 Minutes

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `NewBlog/frontend`
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blogsphere
JWT_SECRET=your_random_secret_key_here
NODE_ENV=production
```

### Step 4: Deploy!

Click **"Deploy"** and wait for it to complete.

## ✅ That's it!

Your app will be live at `https://your-app.vercel.app`

## 📝 Important Notes

- Use **MongoDB Atlas** (not local MongoDB)
- Make sure MongoDB Atlas allows connections from `0.0.0.0/0` (all IPs)
- The API will be at `/api/*` routes automatically
- Frontend will be served from the root

## 🔧 Troubleshooting

**API not working?** Check that `vercel.json` and `api/index.js` are in the `frontend` folder.

**Build fails?** Make sure all dependencies are in `package.json`.

**Database errors?** Verify `MONGO_URI` is correct and MongoDB Atlas allows connections.


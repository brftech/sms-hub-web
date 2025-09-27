# Environment Variables Setup

## 📁 Environment File Structure

This project uses Vite's environment file loading system with the following priority order:

### 1. `.env.local` (Highest Priority)
- **Purpose**: Your actual local development environment variables
- **Status**: ✅ **Contains real values** - automatically loaded by Vite
- **Git**: ❌ **Excluded from git** (contains sensitive data)
- **Usage**: This file is used when running `npm run dev`

### 2. `.env.development` (Template)
- **Purpose**: Template/reference file for development setup
- **Status**: 📝 **Contains placeholder values** - for reference only
- **Git**: ✅ **Included in git** (safe template)
- **Usage**: Copy this to `.env.local` and fill in real values

### 3. `.env.production` (Template)
- **Purpose**: Template/reference file for production deployment
- **Status**: 📝 **Contains placeholder values** - for reference only
- **Git**: ✅ **Included in git** (safe template)
- **Usage**: Reference for setting Vercel environment variables

## 🚀 Quick Setup

### For Local Development:
1. The `.env.local` file already exists with your development values
2. Just run `npm run dev` - Vite will automatically load `.env.local`

### For New Developers:
1. Copy the template: `cp .env.development .env.local`
2. Edit `.env.local` with your actual Supabase keys and API keys
3. Run `npm run dev`

### For Production Deployment:
1. Use `.env.production` as a reference
2. Set all variables in Vercel Dashboard → Settings → Environment Variables
3. Deploy with `vercel --prod`

## 🔐 Security Notes

- **`.env.local`**: Contains real API keys - never commit to git
- **`.env.development`**: Safe template with placeholder values
- **`.env.production`**: Safe template with placeholder values
- **Vercel**: Production values should be set in Vercel dashboard, not in files

## 📋 Current Environment Files

```
.env.local          ← Your actual development values (gitignored)
.env.development    ← Development template (in git)
.env.production     ← Production template (in git)
```

## 🎯 Vite Loading Priority

Vite loads environment files in this order (later files override earlier ones):
1. `.env` (not used in this project)
2. `.env.local` ✅ **Your actual values**
3. `.env.development` (template only)
4. `.env.production` (template only)

This means `.env.local` takes precedence and is used for local development.

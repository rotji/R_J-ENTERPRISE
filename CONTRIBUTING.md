# Contributing to R_J-ENTERPRISE

## 🚀 Quick Start

### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes
- Write code
- Add tests if needed
- Ensure code compiles

### 3. Test Locally
```bash
# Backend tests
cd backend && npm test

# Frontend tests  
cd frontend && npm test

# TypeScript compilation
cd backend && npm run check
cd frontend && npm run build
```

### 4. Create Pull Request
- Push your branch to GitHub
- Create Pull Request to `main` branch
- Fill out the PR template
- Wait for CI/CD checks to pass

### 5. Wait for Review & Merge
- CI/CD must pass (automatic)
- Get approval from team member
- Address any review comments
- Merge when approved ✅

## 🛡️ Branch Protection

The `main` branch is protected:
- ❌ No direct pushes allowed
- ✅ Must use Pull Requests
- ✅ CI/CD checks must pass
- ✅ Requires code review approval

## 🧪 Testing Requirements

All PRs must pass:
- Backend TypeScript compilation
- Frontend TypeScript compilation  
- Backend unit tests
- Frontend unit tests
- Build process for both apps

## 🚨 Emergency Fixes

For urgent production fixes:
1. Create `hotfix/urgent-fix-name` branch
2. Make minimal necessary changes
3. Follow same PR process (but prioritized review)
4. Deploy immediately after merge

## 💡 Best Practices

- Keep PRs small and focused
- Write descriptive commit messages
- Add tests for new features
- Update documentation if needed
- Test locally before creating PR

## ❓ Questions?

If you're unsure about anything, create a draft PR and ask for guidance!
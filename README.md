# R_J ENTERPRISE

[![CI/CD Pipeline](https://github.com/rotji/R_J-ENTERPRISE/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/rotji/R_J-ENTERPRISE/actions/workflows/ci-cd.yml)

## 📌 Project Overview  
R_J ENTERPRISE is a collaborative platform where individuals contribute equal amounts of money to pool resources for bulk purchasing of goods. The purchased goods are then shared equally among all participants, maximizing value and reducing individual costs.

## ⚙️ Tech Stack  
- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Testing**: Vitest for both frontend and backend
- **CI/CD**: GitHub Actions with automated testing and deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or higher
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rotji/R_J-ENTERPRISE.git
   cd R_J-ENTERPRISE
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# TypeScript compilation check
cd backend && npm run check
cd frontend && npm run build
```

## 🛡️ Contributing

This repository uses protected branches and CI/CD:

- **Main branch** is protected - no direct pushes
- **All changes** must go through Pull Requests
- **CI/CD must pass** before merging
- **Code review** required for all PRs

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📁 Project Structure

```
R_J-ENTERPRISE/
├── backend/           # Express.js API server
│   ├── src/          # TypeScript source code
│   ├── tests/        # Backend tests
│   └── package.json
├── frontend/         # React application
│   ├── src/          # React components and pages
│   ├── tests/        # Frontend tests
│   └── package.json
└── .github/          # CI/CD workflows and templates
```

## 🔄 CI/CD Pipeline

Every Pull Request triggers:
- ✅ TypeScript compilation check
- ✅ Unit tests for backend and frontend
- ✅ Build verification
- ✅ Code quality checks

Only passing PRs can be merged to main.

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Developed with ❤️ by the R_J Enterprise team.
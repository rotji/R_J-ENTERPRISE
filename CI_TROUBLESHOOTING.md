# CI/CD Troubleshooting Guide

## Common Issues and Resolutions

### 1. MockUser._id Scope Issues
**Error:** `TypeError: Cannot read properties of undefined (reading '_id')`

**Cause:** Tests referencing `mockUser._id` outside of proper test scope where `mockUser` is initialized.

**Solution:** 
- Move test data creation inside individual test functions
- Use standalone ObjectId instances instead of relying on external state
- Ensure all mock data is self-contained within each test

### 2. Test Isolation Issues
**Best Practices:**
- Initialize all mock data within the test function scope
- Use `beforeEach` to reset state, not to create shared data
- Avoid dependencies between tests
- Use standalone ObjectId instances: `new mongoose.Types.ObjectId('507f...')`

### 3. Frontend Test Issues
**Common Fixes:**
- Ensure proper mocking of external dependencies
- Use `vi.mock()` for all external modules
- Wrap components in proper test providers (BrowserRouter, etc.)

## Running Tests Locally

### Backend:
```bash
cd backend
npm test
```

### Frontend:
```bash
cd frontend  
npm test
```

## CI/CD Pipeline Status
The pipeline runs tests for both frontend and backend. All tests must pass for the PR to be mergeable.

**Current Status:** All scope issues resolved ✅
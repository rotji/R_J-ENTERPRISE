# Branch Protection Rules

Configure these in GitHub Repository Settings > Branches:

## Main Branch Protection
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - ✅ Node.js 18.x tests
  - ✅ Node.js 20.x tests  
- ✅ Require branches to be up to date before merging
- ✅ Require linear history
- ✅ Include administrators (recommended)

## Status Checks Required
- `test (18.x)` - Backend + Frontend tests on Node 18
- `test (20.x)` - Backend + Frontend tests on Node 20

This ensures:
1. No direct pushes to main
2. All tests must pass before merge
3. Code review required
4. Latest changes included
AUTHENTICATION
// USER REGISTRATION
User submits email, username, password
→ Validate input
→ Check if email already exists in DB
→ Hash password
→ Save new user to DB
→ Return success or error

// USER LOGIN
User submits email and password
→ Validate input
→ Find user by email
→ Compare password hash
→ If match, generate JWT token
→ Return token & user info

// AUTH MIDDLEWARE
On protected routes
→ Read Authorization header
→ Verify JWT token
→ Attach user data to request if valid

USER DASHBOARD AND CONTEXT
// FETCH USER DASHBOARD DATA
On dashboard load
→ Send GET request with JWT
→ Backend returns user info, pool membership, notifications

// CONTEXT LOGIC
AuthContext:
→ Holds user info & login state globally

PoolContext:
→ Holds user’s joined/created pools & related actions

POOL CREATION AND LISTING
// CREATE A POOL
User fills CreatePoolForm
→ Validate inputs (amount, title, category, members, etc.)
→ POST request to /api/pools/create
→ Save pool to DB, with user as creator
→ Notify participants

// LIST ALL POOLS
On /pools page load
→ GET request to /api/pools/list
→ Return all pools from DB
→ Render PoolCard for each pool

// JOIN A POOL
User clicks “Join Pool” button
→ POST request to /api/pools/join
→ Add user to pool members in DB
→ Notify pool creator

// SEARCH POOLS
User types in search bar
→ Debounce input
→ GET request to /api/pools/search?query=
→ Return matching pools

PAYMENT FLOW
// PAY TO CONFIRM
User in a pool clicks “Confirm Payment”
→ POST request to /api/pools/pay
→ Create transaction entry
→ Initiate Paystack transaction
→ Redirect user to Paystack
→ On success, webhook sends callback
→ Mark user as “Paid” in DB

// WEBHOOK HANDLING
Receive webhook from Paystack
→ Verify signature
→ Match transaction with user & pool
→ Update transaction status
→ Notify user and pool creator

VENDOR BIDDING SYSTEM
// VENDORS SUBMIT BID
Vendor logs in → views available pools
→ Selects a pool
→ Enters bid amount & message
→ POST to /api/vendor/bid
→ Store bid in DB linked to vendor & pool

// POOL CREATOR VIEWS BIDS
User views own pool
→ GET request to /api/pools/bids/:poolId
→ Shows all vendor bids

// ADMIN SELECTS WINNING BID
Admin logs in → views pools with bids
→ Click “Select Vendor”
→ POST to /api/admin/select-vendor
→ Mark selected vendor in DB
→ Notify vendor & users

ADMIN DASHBOARD
// ADMIN LOGIN
Admin logs in like user
→ Backend checks role === 'admin'
→ Grants access to admin routes

// VIEW TRANSACTIONS, USERS, BIDS
On admin dashboard load
→ Fetch stats for:
   - Number of users
   - All pool transactions
   - Bidding history

// APPROVE PAYMENTS
Admin views pending transactions
→ Click “Approve”
→ Backend marks transaction as approved
→ Notify users

MESSAGING AND NOTIFICATION
// POOL CHAT OR MESSAGING
User sends message in pool chat
→ POST message to /api/message/send
→ Save to DB with sender + pool ID
→ Update UI in real-time using WebSocket or polling

// NOTIFICATIONS
Trigger notifications when:
→ New bid submitted
→ User joins pool
→ Payment confirmed
→ Vendor selected
→ Admin actions
Store notifications in DB, display via bell icon

FRONTEND LAYOUT AND NAVIGATION
// NAVIGATION BAR
Show dynamic Navbar
→ Show login/register or dashboard/logout based on auth
→ Hamburger menu on mobile

// SIDEBAR (DASHBOARDS)
Authenticated users see:
→ Sidebar with links to dashboard, pools, profile
→ Sidebar collapsible with mobile support

GUARDS AND ROLE ACCESS
// withAuth.tsx (HOC)
Wrap protected pages
→ If no JWT, redirect to login

// withAdmin.tsx
If user is not admin
→ Redirect to dashboard

// Role-based rendering
Only show AdminSidebar, Vendor tables, etc. for correct roles

DATABASE LOGIC (SCHEMAS)
// USER
- id, username, email, passwordHash
- role (user, admin, vendor)
- joinedPools: [poolId]
- notifications: [text]

// POOL
- id, creatorId, title, amount, category
- members: [userId]
- status: active, full, paid, completed
- vendors: [vendorBidIds]

// TRANSACTION
- id, poolId, userId
- amount, status (pending, success, failed)
- timestamp

// BID
- id, poolId, vendorId
- amount, message, status

// MESSAGE
- id, senderId, poolId, message, timestamp

// ADMIN
- id, username, email, role: 'admin'

UTILS AND HOOKS LOGIC
// useAuth.ts
Handles user login, logout, session check

// usePool.ts
Fetches user’s pools, create/join actions

// validators.ts
Handles input validation rules

// dbConnect.ts
MongoDB connection setup with Mongoose

DEPLOYMENT AND ENV
// ENV VARS (.env)
- MONGO_URI
- JWT_SECRET
- PAYSTACK_SECRET_KEY
- CLIENT_URL
- NODE_ENV

// DEPLOYMENT FLOW
→ Use GitHub Actions or Vercel/Render for CI/CD
→ Protect secrets
→ Auto deploy on push to main

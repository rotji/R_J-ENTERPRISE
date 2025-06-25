# ========== BASICS ==========

/frontend/                          # // Vite React TypeScript frontend
├── public/                         # // Static files (logo, icons, etc.)
│   └── logo.png
├── src/
│   ├── assets/                     # // Images, icons, etc.
│   ├── components/                 # // Basic UI components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.module.css      # // Used if Tailwind falls short
│   ├── pages/                      # // Top-level pages
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── styles/                     # // Tailwind only
│   │   ├── tailwind.config.ts
│   │   └── postcss.config.js
│   ├── types/                      # // Global types
│   │   └── index.d.ts
│   └── main.tsx                    # // Vite app entry
│   └── App.tsx                     # // Root component
├── .eslintrc.js
├── tsconfig.json
├── index.html
└── vite.config.ts

/backend/                           # // Node/Express TypeScript backend
├── src/
│   ├── controllers/                # // Auth logic
│   │   ├── authController.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   ├── middleware/
│   │   ├── authMiddleware.ts       # // JWT verify
│   ├── config/
│   │   ├── db.ts                   # // MongoDB connection
│   ├── utils/
│   │   ├── jwt.ts
│   └── index.ts                    # // Entry (like server.ts)
├── .env
├── tsconfig.json
└── package.json

/database/                          # // Mongoose models
├── models/
│   ├── User.ts                     # // Basic User schema
│   └── Pool.ts                     # // Basic Pool schema

# ========== MEDIUMS ==========

/frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── CreatePool.tsx
│   │   └── AllPools.tsx
│   ├── components/
│   │   ├── PoolCard.tsx
│   │   ├── CreatePoolForm.tsx
│   │   └── SearchBar.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── usePool.ts
│   ├── utils/
│   │   └── validators.ts

/backend/
├── src/
│   ├── controllers/
│   │   ├── poolController.ts
│   ├── routes/
│   │   ├── poolRoutes.ts
│   │   └── userRoutes.ts
│   ├── services/
│   │   └── paystackService.ts      # // Paystack logic

/database/
├── models/
│   ├── Vendor.ts
│   ├── Bid.ts
│   ├── Transaction.ts
│   └── Message.ts

# ========== COMPLEXS ==========

/frontend/
├── src/
│   ├── pages/
│   │   ├── AdminDashboard.tsx
│   │   └── VendorDashboard.tsx
│   ├── components/dashboard/
│   │   ├── AdminSidebar.tsx
│   │   ├── VendorBiddingTable.tsx
│   │   └── TransactionHistory.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── PoolContext.tsx
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   └── PoolProvider.tsx
│   ├── guards/
│   │   ├── withAuth.tsx
│   │   └── withAdmin.tsx

/backend/
├── src/
│   ├── routes/
│   │   ├── vendorRoutes.ts
│   │   ├── adminRoutes.ts
│   ├── controllers/
│   │   ├── vendorController.ts
│   │   └── adminController.ts
│   ├── services/
│   │   ├── biddingService.ts
│   │   └── auditLogger.ts
│   ├── middleware/
│   │   ├── adminAuth.ts
│   ├── webhooks/
│   │   └── paystackWebhook.ts

/database/
├── models/
│   ├── Admin.ts
│   ├── Notification.ts
│   └── AuditLog.ts
├── utils/
│   └── roleAccess.ts


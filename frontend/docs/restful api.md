| Action                 | Route                    | Method | Description                   |
| ---------------------- | ------------------------ | ------ | ----------------------------- |
| Register User          | `/api/auth/register`     | POST   | Create new user               |
| Login User             | `/api/auth/login`        | POST   | Authenticate user             |
| Get Current User       | `/api/user/me`           | GET    | Get logged-in user's info     |
| Create Pool            | `/api/pools`             | POST   | Create a new pool             |
| List All Pools         | `/api/pools`             | GET    | Get list of all pools         |
| Get Single Pool        | `/api/pools/:id`         | GET    | Get info for one pool         |
| Join a Pool            | `/api/pools/:id/join`    | POST   | Join a specific pool          |
| Pay to a Pool          | `/api/pools/:id/pay`     | POST   | Confirm payment to a pool     |
| Admin: Approve Payment | `/api/admin/:id/approve` | PUT    | Admin approves a pool payment |

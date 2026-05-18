# ⚡ Quick Reference Card

## 🚀 Start Application (2 Commands)

```bash
# Terminal 1
cd backend && mvn spring-boot:run

# Terminal 2  
cd frontend && npm run dev
```

**Open**: http://localhost:5173

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:8080 |
| **Swagger UI** | http://localhost:8080/swagger-ui.html |
| **H2 Console** | http://localhost:8080/h2-console |

---

## 🗄️ H2 Database Connection

```
JDBC URL: jdbc:h2:file:./data/bookstore
Username: sa
Password: (leave empty)
```

---

## 🎨 Updated Pages

✅ **Navbar** - Clean, sticky, active highlighting
✅ **Home** - Hero + Categories + Features  
✅ **Books** - Table view with badges
✅ **Dashboard** - Stats cards + Quick Actions
✅ **Payment Success** - Centered modal

---

## 📊 Pre-Seeded Data

- **5 Categories**: Fiction, Non-Fiction, Science, History, Technology
- **15 Books**: Clean Code, 1984, Sapiens, Design Patterns, etc.

---

## 🔐 Test User

```
Email: demo@bookstore.com
Password: demo123
```

---

## 🎯 Key Features

**User**:
- Browse books
- Search & filter
- Add to cart/wishlist
- Place orders
- View order history

**Admin**:
- Dashboard with stats
- Manage products
- Manage orders
- Manage users

---

## 🎨 Design Colors

- **Primary**: `#2563eb` (Blue)
- **Success**: `#10b981` (Green)  
- **Alert**: `#dc2626` (Red)
- **Background**: `#f5f5f5` (Grey)

---

## 📚 Documentation

- `COMPLETE_SUMMARY.md` - Full overview
- `DEMO_GUIDE.md` - How to demo
- `backend/DATABASE_SETUP.md` - Database guide
- `frontend/UI_REDESIGN_SUMMARY.md` - UI changes

---

## 🐛 Quick Fixes

**Backend won't start**:
```bash
lsof -i :8080
kill -9 <PID>
```

**Frontend won't start**:
```bash
lsof -i :5173
kill -9 <PID>
```

**Reset database**:
```bash
rm -rf backend/data/bookstore.mv.db
```

---

## ✅ Demo Checklist

- [ ] Backend running
- [ ] Frontend running
- [ ] Can browse books
- [ ] Can register/login
- [ ] Dashboard loads
- [ ] Swagger works

---

## 🎉 You're Ready!

Everything is set up and ready to demo! 🚀

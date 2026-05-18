# 🚀 Quick Start Guide

## Current Setup: ✅ Ready to Run!

Your application is configured with **H2 database** by default. No setup needed!

```bash
cd backend
mvn spring-boot:run
```

**Access:**
- API: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html
- H2 Console: http://localhost:8080/h2-console

---

## 🔄 Want to Use MySQL Instead?

### 1️⃣ Install MySQL (one-time setup)

```bash
# macOS
brew install mysql
brew services start mysql
```

### 2️⃣ Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE bookstore;
EXIT;
```

### 3️⃣ Update Password

Edit: `backend/src/main/resources/application-mysql.properties`

Change line 5:
```properties
spring.datasource.password=YOUR_MYSQL_ROOT_PASSWORD
```

### 4️⃣ Switch Profile

Edit: `backend/src/main/resources/application.properties`

Change line 6:
```properties
spring.profiles.active=mysql
```

### 5️⃣ Run Application

```bash
mvn spring-boot:run
```

Done! Your app now uses MySQL! 🎉

---

## 📊 Profile Cheat Sheet

| Profile | Database | When to Use |
|---------|----------|-------------|
| `dev` | H2 | Default, no setup needed |
| `mysql` | MySQL | Local development with MySQL |
| `prod` | PostgreSQL | Cloud deployment |

**Switch profiles in:** `application.properties` → `spring.profiles.active=`

---

## 🆘 Common Issues

### "Access denied for user 'root'"
```bash
# Update password in application-mysql.properties
spring.datasource.password=your_actual_mysql_password
```

### "Unknown database 'bookstore'"
```bash
mysql -u root -p
CREATE DATABASE bookstore;
```

### "MySQL not running"
```bash
brew services start mysql
```

---

## 📚 More Details

See `DATABASE_SETUP.md` for complete documentation.

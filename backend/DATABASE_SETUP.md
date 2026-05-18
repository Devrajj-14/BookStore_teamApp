# Database Setup Guide

This application supports three database configurations:

## 🎯 Quick Start (No Setup Required)

**Default: H2 Database**
```bash
# Just run the application - H2 is already configured
mvn spring-boot:run
```
- ✅ No installation needed
- ✅ Data persists in `./data/bookstore.mv.db` file
- ✅ Access H2 Console: http://localhost:8080/h2-console
- ⚠️ Not recommended for production

---

## 🐬 MySQL Setup (Local Development)

### Step 1: Install MySQL

**macOS:**
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

**Windows:**
- Download from: https://dev.mysql.com/downloads/mysql/
- Run installer and follow wizard

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### Step 2: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Run these SQL commands:
CREATE DATABASE bookstore;
CREATE USER 'bookstore_user'@'localhost' IDENTIFIED BY 'bookstore123';
GRANT ALL PRIVILEGES ON bookstore.* TO 'bookstore_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Update Configuration

Edit `src/main/resources/application-mysql.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bookstore?useSSL=false&serverTimezone=UTC
spring.datasource.username=bookstore_user
spring.datasource.password=bookstore123
```

### Step 4: Run with MySQL Profile

```bash
# Option 1: Change in application.properties
spring.profiles.active=mysql

# Option 2: Run with command line argument
mvn spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=mysql

# Option 3: Set environment variable
export SPRING_PROFILES_ACTIVE=mysql
mvn spring-boot:run
```

### Verify MySQL Connection

```bash
# Check if database was created
mysql -u bookstore_user -p
USE bookstore;
SHOW TABLES;
```

You should see tables like: `users`, `products`, `categories`, `carts`, etc.

---

## 🐘 PostgreSQL Setup (Production/Cloud)

### Option 1: Supabase (Free Cloud PostgreSQL)

1. **Create Account**: https://supabase.com
2. **Create New Project**
3. **Get Connection Details**:
   - Go to Project Settings → Database
   - Copy connection string

4. **Update Configuration**:

Edit `src/main/resources/application-prod.properties`:

```properties
spring.datasource.url=jdbc:postgresql://db.xxx.supabase.co:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your-password
```

5. **Run with Production Profile**:

```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=prod
```

### Option 2: Local PostgreSQL

```bash
# macOS
brew install postgresql
brew services start postgresql

# Create database
createdb bookstore

# Update application-prod.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/bookstore
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

## 🔄 Switching Between Databases

### Method 1: Edit application.properties

```properties
# Use H2 (default)
spring.profiles.active=dev

# Use MySQL
spring.profiles.active=mysql

# Use PostgreSQL
spring.profiles.active=prod
```

### Method 2: Command Line

```bash
# H2
mvn spring-boot:run

# MySQL
mvn spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=mysql

# PostgreSQL
mvn spring-boot:run -Dspring-boot.run.arguments=--spring.profiles.active=prod
```

### Method 3: Environment Variable

```bash
# macOS/Linux
export SPRING_PROFILES_ACTIVE=mysql
mvn spring-boot:run

# Windows
set SPRING_PROFILES_ACTIVE=mysql
mvn spring-boot:run
```

---

## 📊 Database Comparison

| Database | Setup Difficulty | Data Persistence | Production Ready | Cost |
|----------|-----------------|------------------|------------------|------|
| **H2** | ⭐ Very Easy | ✅ File-based | ⚠️ Demo only | Free |
| **MySQL** | ⭐⭐ Easy | ✅ Yes | ✅ Yes | Free (local) |
| **PostgreSQL** | ⭐⭐ Easy | ✅ Yes | ✅ Yes | Free (Supabase) |

---

## 🐛 Troubleshooting

### MySQL Connection Issues

**Error: "Access denied for user"**
```bash
# Reset password
mysql -u root -p
ALTER USER 'bookstore_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

**Error: "Unknown database 'bookstore'"**
```bash
mysql -u root -p
CREATE DATABASE bookstore;
```

**Error: "Communications link failure"**
```bash
# Check if MySQL is running
brew services list  # macOS
sudo systemctl status mysql  # Linux

# Start MySQL
brew services start mysql  # macOS
sudo systemctl start mysql  # Linux
```

### H2 Console Access

- **URL**: http://localhost:8080/h2-console
- **JDBC URL**: `jdbc:h2:file:./data/bookstore`
- **Username**: `sa`
- **Password**: *(leave empty)*

### PostgreSQL Connection Issues

**Error: "Connection refused"**
- Check if PostgreSQL is running
- Verify host and port in connection string
- Check firewall settings

---

## 🚀 Deployment Recommendations

### Development
- Use **H2** or **MySQL** locally
- Easy to reset and test

### Staging/Testing
- Use **PostgreSQL** (Supabase free tier)
- Matches production environment

### Production
- Use **PostgreSQL** (managed service)
- Options: AWS RDS, Google Cloud SQL, Azure Database
- Enable SSL connections
- Regular backups

---

## 📝 Notes

- All databases use the same JPA entities
- Schema is auto-created on first run (`ddl-auto=update`)
- DataSeeder runs automatically and seeds 15 books + 5 categories
- To reset data: delete database and restart application

---

## 🆘 Need Help?

- MySQL Docs: https://dev.mysql.com/doc/
- PostgreSQL Docs: https://www.postgresql.org/docs/
- Supabase Docs: https://supabase.com/docs
- Spring Boot Database: https://spring.io/guides/gs/accessing-data-mysql/

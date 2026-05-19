# BookStore Team App

A full-stack bookstore application built with Spring Boot (backend) and React (frontend), featuring role-based access control, Supabase PostgreSQL, JWT authentication, and a complete shopping experience.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, React Router, Axios           |
| Backend   | Spring Boot 3.2, Spring Security, JPA   |
| Database  | Supabase (PostgreSQL) / H2 (dev)        |
| Auth      | JWT (JSON Web Tokens)                   |
| Docs      | Swagger / OpenAPI 3                     |
| Build     | Maven, Vite                             |

---

## Getting Started

### Prerequisites
- Java 17+ (tested on Java 25)
- Node.js 18+
- Maven 3.8+

### 1. Clone the Repository
```bash
git clone https://github.com/Devrajj-14/BookStore_teamApp.git
cd BookStore_teamApp
git checkout develop
```

### 2. Backend Setup

```bash
cd backend
```

**Development — H2 in-memory database (no setup required):**
```bash
mvn spring-boot:run
```
The application starts on `http://localhost:8080` using H2 by default.

**Production — Supabase PostgreSQL:**

Create `src/main/resources/application-prod.properties` locally. Do not commit this file.
```properties
spring.datasource.url=jdbc:postgresql://db.<your-project-id>.supabase.co:5432/postgres?sslmode=require
spring.datasource.username=postgres
spring.datasource.password=your-password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=false
logging.level.com.bookstore=INFO
```

Switch the active profile in `application.properties`:
```properties
spring.profiles.active=prod
```

Run:
```bash
mvn spring-boot:run
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

---

## Role-Based Access

| Role    | Access                                                      |
|---------|-------------------------------------------------------------|
| USER    | Browse books, cart, wishlist, orders, profile               |
| ADMIN   | All user access + manage books, view all orders and users   |

### Admin Credentials

The admin account is automatically created in the database on first application startup via `DataSeeder`. No manual database setup is required.

```
Email:    admin@bookstore.com
Password: Admin@123
```

---

## Features

### Customer
- Register and login with JWT authentication
- Browse and search books by title, author, or category
- Add to cart, update quantities, and proceed to checkout
- Place orders with delivery address selection
- Wishlist management
- Profile and address management
- Book reviews and ratings

### Admin
- Dashboard with statistics (users, orders, revenue, low stock alerts)
- Add, edit, and delete books
- View and manage all orders
- View all registered users

---

## Project Structure

```
bookstore/
├── backend/                  # Spring Boot application
│   ├── src/main/java/com/bookstore/
│   │   ├── config/           # DataSeeder, CORS, Swagger
│   │   ├── common/           # ApiResponse, AppConstants, OrderStatus
│   │   ├── entity/           # JPA entities (User, Product, Order, Cart...)
│   │   ├── exception/        # Global exception handler
│   │   ├── security/         # JWT filter, SecurityConfig, UserDetailsService
│   │   └── modules/          # Feature modules
│   │       ├── admin/        # Admin dashboard and user management
│   │       ├── cart/         # Cart service and mapper
│   │       ├── customer/     # Profile and address management
│   │       ├── order/        # Order placement and tracking
│   │       ├── product/      # Book CRUD
│   │       ├── user/         # Authentication (register/login)
│   │       └── wishlist/     # Wishlist service and mapper
│   └── src/main/resources/
│       ├── application.properties        # Active profile selector
│       ├── application-dev.properties    # H2 config (committed)
│       └── application-prod.properties  # Supabase config (not committed)
│
└── frontend/                 # React application
    └── src/
        ├── api/              # Axios client and API modules
        ├── components/       # Navbar, PrivateRoute, AdminRoute
        ├── context/          # AuthContext (JWT and user state)
        ├── layouts/          # MainLayout
        ├── pages/            # All pages
        │   └── admin/        # Dashboard, ProductManagement, OrderManagement
        └── routes/           # AppRoutes
```

---

## API Reference

### Public Endpoints
| Method | Endpoint               | Description        |
|--------|------------------------|--------------------|
| POST   | `/api/auth/register`   | Register new user  |
| POST   | `/api/auth/login`      | Login, returns JWT |
| GET    | `/api/products`        | List all books     |
| GET    | `/api/products/{id}`   | Get book by ID     |
| GET    | `/api/products/search` | Search books       |

### Authenticated (USER)
| Method | Endpoint            | Description      |
|--------|---------------------|------------------|
| GET    | `/api/cart`         | Get cart         |
| POST   | `/api/cart/add`     | Add to cart      |
| GET    | `/api/orders/my`    | My orders        |
| POST   | `/api/orders`       | Place order      |
| GET    | `/api/wishlist`     | Get wishlist     |

### Admin Only
| Method | Endpoint                   | Description       |
|--------|----------------------------|-------------------|
| POST   | `/api/products`            | Add book          |
| PUT    | `/api/products/{id}`       | Update book       |
| DELETE | `/api/products/{id}`       | Delete book       |
| GET    | `/api/admin/dashboard`     | Dashboard stats   |
| GET    | `/api/admin/users`         | All users         |
| GET    | `/api/orders/admin`        | All orders        |

Full API documentation is available at `http://localhost:8080/swagger-ui/index.html`.

---

## Database

- **Development**: H2 file-based database at `backend/data/bookstore.mv.db`
- **Production**: Supabase PostgreSQL — tables are auto-created by Hibernate on first run
- **Seeded data**: 5 categories, 15 books, and 1 admin user created on first startup

---

## Branch Structure

| Branch    | Purpose                      |
|-----------|------------------------------|
| `main`    | Stable, production-ready code |
| `develop` | Active development branch    |

---

## Contributing

All contributions go through the `develop` branch via pull requests. Do not push directly to `main`.

---

## Important Notes

- Never commit `application-prod.properties` — it contains database credentials.
- The file is listed in `.gitignore` and will not be tracked by git.
- Each developer must create their own local `application-prod.properties` when using Supabase.
- For local development, use the default `dev` profile — H2 requires no additional setup.

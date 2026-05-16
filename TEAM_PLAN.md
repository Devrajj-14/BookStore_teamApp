# BookStore Team Plan

> **Single source of truth for the team. Do not rely on IMPLEMENTATION_GUIDE.md — it contains incorrect status information. Use only this file.**

---

## Codebase Status

### FULLY IMPLEMENTED ✅

| File | Notes |
|------|-------|
| `BookStoreApplication.java` | Entry point, works |
| `entity/User.java` | Full JPA entity, Lombok @Data |
| `entity/Product.java` | Full JPA entity, references Category |
| `entity/Category.java` | Full JPA entity |
| `entity/Cart.java` | Full JPA entity, OneToOne with User |
| `entity/CartItem.java` | Full JPA entity, ManyToOne Cart + Product |
| `entity/Wishlist.java` | Full JPA entity, OneToOne with User |
| `entity/WishlistItem.java` | Full JPA entity, unique constraint (wishlist_id, product_id) |
| `entity/Order.java` | Full JPA entity, ManyToOne User + Address |
| `entity/OrderItem.java` | Full JPA entity, ManyToOne Order + Product |
| `entity/CustomerProfile.java` | Full JPA entity, OneToOne with User |
| `entity/Address.java` | Full JPA entity, ManyToOne CustomerProfile |
| `entity/Feedback.java` | Full JPA entity, unique constraint (user_id, product_id) |
| `config/CorsConfig.java` | Working CORS — localhost:3000, 5173, 4200 |
| `config/SwaggerConfig.java` | Working Swagger — JWT Bearer scheme configured |
| `controller/HealthController.java` | GET /api/health and GET /api/ |
| `security/SecurityConfig.java` | BCryptPasswordEncoder bean — but PERMITS ALL REQUESTS (JWT not wired yet) |
| `common/ApiResponse.java` | ✅ Implemented by Devraj |
| `common/AppConstants.java` | ✅ Implemented by Devraj — JWT, roles, messages, pagination |
| `common/OrderStatus.java` | ✅ Implemented by Devraj — PENDING through REFUNDED |
| `exception/ResourceNotFoundException.java` | ✅ Implemented by Devraj |
| `exception/BadRequestException.java` | ✅ Implemented by Devraj |
| `exception/GlobalExceptionHandler.java` | ✅ Implemented by Devraj |
| `frontend/src/App.jsx` | BrowserRouter wrapper |
| `frontend/src/routes/AppRoutes.jsx` | All routes declared |
| `frontend/src/layouts/MainLayout.jsx` | Navbar + Outlet + Footer |
| `frontend/src/components/Navbar.jsx` | Static nav links |
| `frontend/src/components/Footer.jsx` | Static footer |

### STUBS — correct package, empty body ⚠️

| File | What's needed |
|------|--------------|
| `security/JwtUtil.java` | generateToken, validateToken, extractEmail, extractUserId |
| `security/JwtAuthFilter.java` | OncePerRequestFilter reading Bearer token |
| `security/UserDetailsServiceImpl.java` | loadUserByUsername using UserRepository |
| `modules/cart/repository/CartRepository.java` | Interface exists, needs custom query methods |
| `modules/cart/repository/CartItemRepository.java` | Interface exists, needs custom query methods |
| `modules/cart/dto/CartResponse.java` | Empty class — needs fields |
| `modules/cart/dto/CartItemResponse.java` | Empty class — needs fields |
| `modules/cart/dto/AddToCartRequest.java` | Empty class — needs fields + validation |
| `modules/cart/dto/UpdateCartItemRequest.java` | Empty class — needs fields + validation |
| `modules/cart/service/CartService.java` | Empty @Service — full business logic needed |
| `modules/cart/controller/CartController.java` | Empty @RestController — all endpoints needed |
| `modules/wishlist/repository/WishlistRepository.java` | Interface exists, needs findByUserId |
| `modules/wishlist/repository/WishlistItemRepository.java` | Interface exists, needs custom queries |
| `modules/wishlist/dto/WishlistResponse.java` | Empty class |
| `modules/wishlist/dto/WishlistItemResponse.java` | Empty class |
| `modules/wishlist/service/WishlistService.java` | Empty @Service |
| `modules/wishlist/controller/WishlistController.java` | Empty @RestController |
| `modules/customer/repository/CustomerProfileRepository.java` | Interface exists, needs findByUserId |
| `modules/customer/repository/AddressRepository.java` | Interface exists, needs custom queries |
| `modules/customer/dto/CustomerDetailsRequest.java` | Empty class |
| `modules/customer/dto/CustomerDetailsResponse.java` | Empty class |
| `modules/customer/dto/AddressRequest.java` | Empty class |
| `modules/customer/dto/AddressResponse.java` | Empty class |
| `modules/customer/service/CustomerService.java` | Empty @Service |
| `modules/customer/controller/CustomerController.java` | Empty @RestController |
| `modules/order/repository/OrderRepository.java` | Interface exists, needs custom queries |
| `modules/order/repository/OrderItemRepository.java` | Interface exists, needs custom queries |
| `modules/order/dto/OrderRequest.java` | Empty class |
| `modules/order/dto/OrderResponse.java` | Empty class |
| `modules/order/dto/OrderItemResponse.java` | Empty class |
| `modules/order/dto/OrderStatusUpdateRequest.java` | Empty class |
| `modules/order/service/OrderService.java` | Empty @Service |
| `modules/order/controller/OrderController.java` | Empty @RestController |
| `modules/feedback/repository/FeedbackRepository.java` | Interface exists, needs custom queries |
| `modules/feedback/dto/FeedbackRequest.java` | Empty class |
| `modules/feedback/dto/FeedbackResponse.java` | Empty class |
| `modules/feedback/dto/RatingSummary.java` | Empty class |
| `modules/feedback/service/FeedbackService.java` | Empty @Service |
| `modules/feedback/controller/FeedbackController.java` | Empty @RestController |
| `modules/admin/dto/DashboardResponse.java` | Empty class |
| `modules/admin/dto/UserListResponse.java` | Empty class |
| `modules/admin/service/AdminService.java` | Empty @Service |
| `modules/admin/controller/AdminController.java` | Empty @RestController |

### CRITICAL BUG — wrong package declarations 🔴

These files have the **wrong package declaration** inside them. They will NOT compile as-is:

| File (path) | Declared package | Correct package |
|-------------|-----------------|-----------------|
| `modules/user/repository/UserRepository.java` | `com.bookstore.repository` | `com.bookstore.modules.user.repository` |
| `modules/user/dto/RegisterRequest.java` | `com.bookstore.dto` | `com.bookstore.modules.user.dto` |
| `modules/user/dto/LoginRequest.java` | `com.bookstore.dto` | `com.bookstore.modules.user.dto` |
| `modules/user/dto/AuthResponse.java` | `com.bookstore.dto` | `com.bookstore.modules.user.dto` |
| `modules/user/dto/UserResponse.java` | `com.bookstore.dto` | `com.bookstore.modules.user.dto` |
| `modules/user/service/AuthService.java` | `com.bookstore.service` | `com.bookstore.modules.user.service` |
| `modules/user/service/UserService.java` | `com.bookstore.service` | `com.bookstore.modules.user.service` |
| `modules/user/controller/AuthController.java` | `com.bookstore.controller` | `com.bookstore.modules.user.controller` |
| `modules/user/controller/UserController.java` | `com.bookstore.controller` | `com.bookstore.modules.user.controller` |
| `modules/product/repository/ProductRepository.java` | `com.bookstore.repository` | `com.bookstore.modules.product.repository` |
| `modules/product/dto/ProductResponse.java` | unknown (likely wrong) | `com.bookstore.modules.product.dto` |
| `modules/product/service/ProductService.java` | `com.bookstore.service` | `com.bookstore.modules.product.service` |
| `modules/product/controller/ProductController.java` | `com.bookstore.controller` | `com.bookstore.modules.product.controller` |

### FRONTEND — all pages are placeholder stubs ⚠️

| File | Status |
|------|--------|
| `pages/Home.jsx` | Stub — placeholder only |
| `pages/Books.jsx` | Stub — placeholder only |
| `pages/BookDetails.jsx` | Stub — placeholder only |
| `pages/Login.jsx` | Stub — placeholder only |
| `pages/Register.jsx` | Stub — placeholder only |
| `pages/Cart.jsx` | Stub — placeholder only |
| `pages/Checkout.jsx` | Stub — placeholder only |
| `pages/Orders.jsx` | Stub — placeholder only |
| `pages/NotFound.jsx` | Stub — 404 message only |
| axios | NOT INSTALLED — needs `npm install axios` |
| AuthContext | MISSING — needs to be created |
| API client | MISSING — no axios instance or fetch abstraction |
| PrivateRoute | MISSING — no protected route component |
| Wishlist page | MISSING — not in routes |
| Profile page | MISSING — not in routes |

---

## What Devraj Has Built

**Truly implemented (working code):**
- All 12 JPA entities with proper relationships, Lombok, and timestamps
- Spring Boot project skeleton with correct pom.xml dependencies
- CORS and Swagger configuration
- Health check endpoint
- BCryptPasswordEncoder bean
- common/ApiResponse.java, AppConstants.java, OrderStatus.java
- exception/ResourceNotFoundException.java, BadRequestException.java, GlobalExceptionHandler.java
- React frontend with BrowserRouter, routing, Navbar, Footer layout
- application.properties with H2, JWT secret placeholder, Swagger URLs

**Created as stubs (exist but do nothing):**
- All user module files (9 files) — wrong packages, all empty
- All product module files — wrong packages, all empty
- Security layer (JwtUtil, JwtAuthFilter, UserDetailsServiceImpl) — empty
- All cart, wishlist, customer, order, feedback, admin module files — stubs
- All frontend pages — placeholder stubs

---

## Tech Stack Confirmed

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | Java | 17 |
| Framework | Spring Boot | 3.2.0 (from parent POM) |
| Build | Maven | via spring-boot-starter-parent 3.2.0 |
| ORM | Spring Data JPA / Hibernate | managed by Spring Boot 3.2.0 |
| Security | Spring Security | managed by Spring Boot 3.2.0 |
| JWT | io.jsonwebtoken jjwt | 0.11.5 (api + impl + jackson) |
| API Docs | springdoc-openapi-starter-webmvc-ui | 2.3.0 |
| DB (dev) | H2 in-memory | managed by Spring Boot |
| DB (prod) | PostgreSQL via Supabase | managed by Spring Boot |
| Lombok | Lombok | managed by Spring Boot |
| Validation | spring-boot-starter-validation | managed by Spring Boot 3.2.0 |
| Frontend | React | 18.2.0 |
| Bundler | Vite | 5.0.8 |
| Routing | react-router-dom | 6.20.0 |
| HTTP client | axios | NOT YET INSTALLED — run `npm install axios` |
| CSS | Plain CSS | no UI framework installed |

---

## Package Structure

```
com.bookstore
├── BookStoreApplication.java            ✅ complete
├── common/
│   ├── ApiResponse.java                 ✅ Devraj
│   ├── AppConstants.java                ✅ Devraj
│   └── OrderStatus.java                 ✅ Devraj
├── config/
│   ├── CorsConfig.java                  ✅ complete
│   └── SwaggerConfig.java               ✅ complete
├── controller/
│   └── HealthController.java            ✅ complete
├── entity/                              ✅ ALL 12 COMPLETE
│   ├── User.java
│   ├── Product.java
│   ├── Category.java
│   ├── Cart.java / CartItem.java
│   ├── Wishlist.java / WishlistItem.java
│   ├── Order.java / OrderItem.java
│   ├── CustomerProfile.java / Address.java
│   └── Feedback.java
├── exception/
│   ├── GlobalExceptionHandler.java      ✅ Devraj
│   ├── ResourceNotFoundException.java   ✅ Devraj
│   └── BadRequestException.java         ✅ Devraj
├── security/
│   ├── SecurityConfig.java              ⚠️ partial (no JWT filter)
│   ├── JwtUtil.java                     🔴 empty stub
│   ├── JwtAuthFilter.java               🔴 empty stub
│   └── UserDetailsServiceImpl.java      🔴 empty stub
└── modules/
    ├── user/                            🔴 all stubs + WRONG PACKAGES
    ├── product/                         🔴 all stubs + WRONG PACKAGES
    ├── cart/                            ⚠️ stubs, correct packages
    ├── wishlist/                        ⚠️ stubs, correct packages
    ├── customer/                        ⚠️ stubs, correct packages
    ├── order/                           ⚠️ stubs, correct packages
    ├── feedback/                        ⚠️ stubs, correct packages
    └── admin/                           ⚠️ stubs, correct packages
```

---

## Phases and Tasks

### Phase 1 — Entities
**Status: [x] COMPLETE — Devraj built all 12 entities**

### Phase 2 — Foundation + Core Backend APIs

**Foundation:**
- [x] Devraj: `common/ApiResponse.java` ✓
- [x] Devraj: `common/AppConstants.java` ✓
- [x] Devraj: `common/OrderStatus.java` ✓
- [x] Devraj: `exception/ResourceNotFoundException.java` ✓
- [x] Devraj: `exception/BadRequestException.java` ✓
- [x] Devraj: `exception/GlobalExceptionHandler.java` ✓

**Rajveer — Auth, JWT, Security, User, Customer Profile:**
- [ ] Fix package + implement `modules/user/repository/UserRepository.java`
- [ ] Fix package + implement `modules/user/dto/RegisterRequest.java`
- [ ] Fix package + implement `modules/user/dto/LoginRequest.java`
- [ ] Fix package + implement `modules/user/dto/AuthResponse.java`
- [ ] Fix package + implement `modules/user/dto/UserResponse.java`
- [ ] Implement `security/JwtUtil.java`
- [ ] Implement `security/UserDetailsServiceImpl.java`
- [ ] Implement `security/JwtAuthFilter.java`
- [ ] Update `security/SecurityConfig.java` — add JWT filter, @EnableMethodSecurity
- [ ] Fix package + implement `modules/user/service/AuthService.java`
- [ ] Fix package + implement `modules/user/controller/AuthController.java`
- [ ] Fix package + implement `modules/user/service/UserService.java`
- [ ] Fix package + implement `modules/user/controller/UserController.java`
- [ ] Implement `modules/customer/repository/CustomerProfileRepository.java`
- [ ] Implement `modules/customer/repository/AddressRepository.java`
- [ ] Implement `modules/customer/dto/` (all 4 DTOs)
- [ ] Implement `modules/customer/service/CustomerService.java`
- [ ] Implement `modules/customer/controller/CustomerController.java`

**Devraj — Product Catalog:**
- [ ] Fix package + implement `modules/product/repository/ProductRepository.java`
- [ ] Create `modules/product/repository/CategoryRepository.java`
- [ ] Fix package + implement `modules/product/dto/ProductResponse.java`
- [ ] Create `modules/product/dto/ProductRequest.java` and `CategoryResponse.java`
- [ ] Fix package + implement `modules/product/service/ProductService.java`
- [ ] Fix package + implement `modules/product/controller/ProductController.java`

### Phase 3 — Rajveer Frontend + Bhramika Backend

**Rajveer — Frontend Auth + Profile:**
- [ ] `npm install axios` in frontend/
- [ ] Create `src/api/axiosClient.js`
- [ ] Create `src/api/authApi.js`
- [ ] Create `src/context/AuthContext.jsx`
- [ ] Implement `src/pages/Login.jsx`
- [ ] Implement `src/pages/Register.jsx`
- [ ] Create `src/components/PrivateRoute.jsx`
- [ ] Create `src/pages/Profile.jsx`
- [ ] Update `src/routes/AppRoutes.jsx` — protected routes
- [ ] Update `src/components/Navbar.jsx` — auth-aware

**Bhramika — Cart + Wishlist Backend:**
- [ ] `modules/cart/repository/CartRepository.java` — add query methods
- [ ] `modules/cart/repository/CartItemRepository.java` — add query methods
- [ ] Implement all cart DTOs
- [ ] Implement `modules/cart/service/CartService.java`
- [ ] Implement `modules/cart/controller/CartController.java`
- [ ] `modules/wishlist/repository/WishlistRepository.java` — add query methods
- [ ] `modules/wishlist/repository/WishlistItemRepository.java` — add query methods
- [ ] Implement wishlist DTOs
- [ ] Implement `modules/wishlist/service/WishlistService.java`
- [ ] Implement `modules/wishlist/controller/WishlistController.java`

### Phase 4 — Bhramika Frontend + Karthik Backend

**Bhramika — Cart + Wishlist Frontend:**
- [ ] Create `src/api/cartApi.js` and `src/api/wishlistApi.js`
- [ ] Create `src/context/CartContext.jsx`
- [ ] Implement `src/pages/Cart.jsx`
- [ ] Create `src/pages/Wishlist.jsx`
- [ ] Add `/wishlist` route to AppRoutes.jsx
- [ ] Update Navbar with wishlist + cart count

**Karthik — Order + Feedback Backend:**
- [ ] `modules/order/repository/OrderRepository.java` — add query methods
- [ ] `modules/order/repository/OrderItemRepository.java` — add query methods
- [ ] Implement all order DTOs
- [ ] Implement `modules/order/service/OrderService.java`
- [ ] Implement `modules/order/controller/OrderController.java`
- [ ] `modules/feedback/repository/FeedbackRepository.java` — add query methods
- [ ] Implement all feedback DTOs
- [ ] Implement `modules/feedback/service/FeedbackService.java`
- [ ] Implement `modules/feedback/controller/FeedbackController.java`

### Phase 5 — Karthik Frontend + Devraj Admin

**Karthik — Order + Feedback Frontend:**
- [ ] Create `src/api/orderApi.js` and `src/api/feedbackApi.js`
- [ ] Implement `src/pages/Checkout.jsx`
- [ ] Implement `src/pages/Orders.jsx`
- [ ] Implement `src/pages/BookDetails.jsx`

**Devraj — Admin + Core Frontend:**
- [ ] Implement `modules/admin/service/AdminService.java`
- [ ] Implement `modules/admin/controller/AdminController.java`
- [ ] Create admin frontend pages
- [ ] Implement `src/pages/Home.jsx`
- [ ] Implement `src/pages/Books.jsx`

### Phase 6 — Tests, Swagger, Docker, Submission

- [ ] Rajveer: Unit + integration tests for auth module
- [ ] Devraj: Unit tests for ProductService
- [ ] Bhramika: Unit tests for CartService, WishlistService
- [ ] Karthik: Unit tests for OrderService, FeedbackService
- [ ] Devraj: Verify Swagger UI at /swagger-ui.html
- [ ] Devraj: Dockerfile (backend + frontend) + docker-compose.yml
- [ ] All: Final integration testing
- [ ] All: Update README.md

---

## Ownership Rules

| File / Area | Owner | Rule |
|-------------|-------|------|
| `common/ApiResponse.java` | Devraj | No one else modifies |
| `common/AppConstants.java` | Devraj | No one else modifies |
| `common/OrderStatus.java` | Devraj | No one else modifies |
| `entity/*.java` | Devraj | Read-only for everyone. Raise changes in chat |
| `config/CorsConfig.java` | Devraj | Do not touch |
| `config/SwaggerConfig.java` | Devraj | Do not touch |
| `pom.xml` | Devraj | Announce additions in chat before adding |
| `application.properties` | Devraj | No one modifies without Devraj's approval |
| `security/SecurityConfig.java` | Rajveer | Only Rajveer modifies |
| `security/JwtUtil.java` | Rajveer | Only Rajveer modifies |
| `security/JwtAuthFilter.java` | Rajveer | Only Rajveer modifies |
| `security/UserDetailsServiceImpl.java` | Rajveer | Only Rajveer modifies |
| `modules/user/**` | Rajveer | Only Rajveer modifies |
| `modules/customer/**` | Rajveer | Only Rajveer modifies |
| `modules/product/**` | Devraj | Only Devraj modifies |
| `modules/cart/**` | Bhramika | Only Bhramika modifies |
| `modules/wishlist/**` | Bhramika | Only Bhramika modifies |
| `modules/order/**` | Karthik | Only Karthik modifies |
| `modules/feedback/**` | Karthik | Only Karthik modifies |
| `modules/admin/**` | Devraj | Only Devraj modifies |
| `frontend/src/routes/AppRoutes.jsx` | Coordinated | Each adds own routes — merge carefully |
| `frontend/src/components/Navbar.jsx` | Rajveer | Others ask before modifying |

---

## Branch Rules

```
main      — final submission only (do not push directly)
develop   — integration branch — always pull before starting
feature/  — one branch per person per task
```

**Naming:**
```
feature/rajveer-auth-jwt
feature/devraj-product-module
feature/bhramika-cart-wishlist
feature/karthik-order-feedback
```

**Dead branches to delete (no code in them — all at old boilerplate commit):**
```
feature/auth, feature/cart, feature/product, feature/wishlist,
feature/order, feature/feedback, feature/admin, feature/profile,
feature/dashboard, feature/configuration
```
Ask Devraj to delete these from remote.

**Git workflow every session:**
```bash
git checkout develop
git pull origin develop
git checkout feature/your-branch   # or -b to create
git rebase develop                 # get latest from team
# ... work ...
git add <specific files>
git commit -m "feat(module): description"
git push origin feature/your-branch
```

---

## How to Start Your Session

**Rajveer — paste this every session:**
```
I am Rajveer on the BookStore team app at c:\Users\Rajveer Singh\Bookstore_teamApp
My ownership: auth, JWT, Spring Security, user module, customer profile, frontend auth pages.
Step 1: Read TEAM_PLAN.md
Step 2: Run git log origin/develop --oneline -10 to see what's merged
Step 3: Read only files relevant to my current task
Do NOT touch files outside my ownership.
Current task: [FILL IN]
```

**Devraj — paste this every session:**
```
I am Devraj on the BookStore team app.
My ownership: common utilities, product module, admin module, entities (read-only),
frontend Home + Books + admin pages, Docker, pom.xml, application.properties.
Step 1: Read TEAM_PLAN.md
Step 2: Run git log origin/develop --oneline -10
Step 3: Read only files relevant to my current task
Current task: [FILL IN]
```

**Bhramika — paste this every session:**
```
I am Bhramika on the BookStore team app.
My ownership: cart module (backend + frontend), wishlist module (backend + frontend).
Step 1: Read TEAM_PLAN.md
Step 2: Run git log origin/develop --oneline -10
Step 3: Check if UserRepository (Rajveer) and ProductRepository (Devraj) are in develop before writing services
Step 4: Read only files relevant to my current task
Do NOT touch security, user, product, order, or entity files.
Current task: [FILL IN]
```

**Karthik — paste this every session:**
```
I am Karthik on the BookStore team app.
My ownership: order module (backend + frontend), feedback module, Checkout page, Orders page, BookDetails page.
Step 1: Read TEAM_PLAN.md
Step 2: Run git log origin/develop --oneline -10
Step 3: Check if SecurityConfig (Rajveer), ProductRepository (Devraj), CartRepository (Bhramika) are in develop before writing OrderService
Step 4: Read only files relevant to my current task
Do NOT touch security, user, product, cart, or entity files.
Current task: [FILL IN]
```

---

## Current Blockers

1. **Rajveer's security layer is completely unimplemented** — JwtUtil, JwtAuthFilter, UserDetailsServiceImpl are empty stubs. SecurityConfig permits all requests. Cart, Wishlist, Order, Feedback, Admin all need auth to work.

2. **User module has wrong package declarations** — All 9 user module files must be rewritten with correct packages before any auth endpoint can compile.

3. **Product module has wrong package declarations** — All 4 product module files need fixing by Devraj.

4. **Dead branches on remote** — feature/auth, feature/cart, feature/product, feature/wishlist, feature/order, feature/feedback, feature/admin, feature/profile, feature/dashboard, feature/configuration are all stale. Devraj should delete them.

5. **Frontend has no axios** — Run `npm install axios` in frontend/ before building any API-connected page.

---

## Coordination Signals

| When | Message |
|------|---------|
| Starting | `STARTING — [name] — [task] — branch: feature/[name]` |
| PR open | `PR OPEN — [name] — feature/[branch] — [link]` |
| Merged | `MERGED — [name] — feature/[branch] — unblocks: [who]` |
| Blocked | `BLOCKED — [name] — waiting on: [whose PR]` |

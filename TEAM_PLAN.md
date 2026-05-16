# BookStore Team Plan

> **Single source of truth. Read this at the start of every session before touching any code.**

---

## Branch Assignments (Devraj's Original Structure — Follow This)

| Branch | Owner | Scope |
|--------|-------|-------|
| `feature/configuration` | **Devraj** | ApiResponse, AppConstants, OrderStatus, all exception classes ✅ DONE — needs PR |
| `feature/product` | **Devraj** | Product catalog — repository, service, controller, DTOs ✅ DONE — needs PR |
| `feature/admin` | **Devraj** | Admin service, controller, DTOs + admin frontend pages |
| `feature/dashboard` | **Devraj** | Admin dashboard frontend + Home + Books pages |
| `feature/auth` | **Rajveer** | JWT, Spring Security, user module (register, login, get/update profile) |
| `feature/profile` | **Rajveer** | Customer profile, addresses + frontend Login, Register, Profile pages |
| `feature/cart` | **Bhramika** | Cart backend + Cart frontend page |
| `feature/wishlist` | **Bhramika** | Wishlist backend + Wishlist frontend page |
| `feature/order` | **Karthik** | Order backend + Checkout + Orders frontend pages |
| `feature/feedback` | **Karthik** | Feedback backend + BookDetails frontend page |

**Rule: You only commit to your assigned branch(es). PRs go feature → develop. Never commit directly to develop or main.**

---

## Current Status of Every Branch

| Branch | Status | Notes |
|--------|--------|-------|
| `develop` | ✅ Base + TEAM_PLAN | Has entities, config, partial common utilities. Others merge into here via PR |
| `feature/configuration` | ✅ DONE — PR PENDING | ApiResponse, OrderStatus, all 3 exception classes fully implemented |
| `feature/product` | ✅ DONE — PR PENDING | Full product API with search, filter, pagination, categories |
| `feature/auth` | 🔴 Not started | At original boilerplate — Rajveer starts here |
| `feature/profile` | 🔴 Not started | At original boilerplate — Rajveer starts here after feature/auth |
| `feature/cart` | 🔴 Not started | At original boilerplate — Bhramika starts here |
| `feature/wishlist` | 🔴 Not started | At original boilerplate — Bhramika starts here after feature/cart |
| `feature/order` | 🔴 Not started | At original boilerplate — Karthik starts here |
| `feature/feedback` | 🔴 Not started | At original boilerplate — Karthik starts here |
| `feature/admin` | 🔴 Not started | Devraj starts after configuration and product are merged |
| `feature/dashboard` | 🔴 Not started | Devraj starts last |

---

## What Is Already Built and Must Not Be Touched

### Entities — ALL 12 COMPLETE in develop ✅
```
User, Product, Category
Cart, CartItem
Wishlist, WishlistItem
Order, OrderItem
CustomerProfile, Address
Feedback
```
**Never modify entity files without Devraj's approval.**

### Config — COMPLETE in develop ✅
- `config/CorsConfig.java` — allows localhost 3000, 5173, 4200
- `config/SwaggerConfig.java` — JWT Bearer auth configured
- `controller/HealthController.java` — GET /api/health works

### Common utilities — COMPLETE in feature/configuration ✅ (not yet in develop)
- `common/ApiResponse.java`
- `common/OrderStatus.java`
- `exception/ResourceNotFoundException.java`
- `exception/BadRequestException.java`
- `exception/GlobalExceptionHandler.java`

### Product module — COMPLETE in feature/product ✅ (not yet in develop)
- `modules/product/repository/ProductRepository.java` + `CategoryRepository.java`
- `modules/product/dto/ProductRequest.java` + `ProductResponse.java`
- `modules/product/service/ProductService.java`
- `modules/product/controller/ProductController.java`

---

## Merge Order — Everyone Follow This Sequence

```
1. Devraj: PR feature/configuration → develop   (resolves any conflicts)
   Chat: "MERGED: configuration — everyone rebase before starting"

2. Devraj: PR feature/product → develop
   Chat: "MERGED: product"

3. Everyone: rebase their branch onto develop
   git fetch origin
   git checkout feature/<your-branch>
   git rebase origin/develop

4. Rajveer: implement feature/auth → PR → develop
   Chat: "MERGED: auth — Bhramika + Karthik can now use SecurityContext"

5. Bhramika: implement feature/cart → PR → develop
   Chat: "MERGED: cart — Karthik can now use CartRepository in OrderService"

6. Karthik: implement feature/order (can start repositories + DTOs earlier)
   Karthik: implement feature/feedback

7. Rajveer: implement feature/profile → PR → develop

8. Bhramika: implement feature/wishlist → PR → develop

9. Devraj: implement feature/admin → PR → develop

10. All: final integration testing → develop → main
```

---

## Rajveer — Tasks for feature/auth

Rebase onto develop first, then implement these files in order:

**Step 1 — Fix and implement repositories + DTOs (no compile dependencies)**

| File | What to write |
|------|--------------|
| `modules/user/repository/UserRepository.java` | Fix package to `com.bookstore.modules.user.repository`. Add: `Optional<User> findByEmail(String email)`, `boolean existsByEmail(String email)` |
| `modules/user/dto/RegisterRequest.java` | Fix package. Fields: `String name` (@NotBlank), `String email` (@Email @NotBlank), `String password` (@NotBlank @Size(min=6)) |
| `modules/user/dto/LoginRequest.java` | Fix package. Fields: `String email` (@Email @NotBlank), `String password` (@NotBlank) |
| `modules/user/dto/AuthResponse.java` | Fix package. Fields: `String token`, `String type = "Bearer"`, `Long userId`, `String email`, `String name`, `String role` |
| `modules/user/dto/UserResponse.java` | Fix package. Fields: `Long id`, `String name`, `String email`, `String role`, `LocalDateTime createdAt` |

**Step 2 — Security layer**

| File | What to write |
|------|--------------|
| `security/JwtUtil.java` | `generateToken(UserDetails)`, `validateToken(String, UserDetails)`, `extractEmail(String)` — uses `@Value("${jwt.secret}")` and `@Value("${jwt.expiration}")` |
| `security/UserDetailsServiceImpl.java` | Implements `UserDetailsService`. `loadUserByUsername(email)` → calls `UserRepository.findByEmail` |
| `security/JwtAuthFilter.java` | Extends `OncePerRequestFilter`. Reads `Authorization: Bearer <token>`, validates, sets `SecurityContextHolder` |
| `security/SecurityConfig.java` | Add `@EnableMethodSecurity`. Wire `JwtAuthFilter` before `UsernamePasswordAuthenticationFilter`. Permit `/api/auth/**`, `/api/products/**`, `/swagger-ui/**`, `/v3/api-docs/**`, `/h2-console/**`. Secure everything else. |

**Step 3 — Service + Controller**

| File | What to write |
|------|--------------|
| `modules/user/service/AuthService.java` | Fix package. `register()` → validate email unique, hash password with BCrypt, save User with role "USER", return AuthResponse. `login()` → authenticate, generate JWT, return AuthResponse. |
| `modules/user/controller/AuthController.java` | Fix package. `POST /api/auth/register` → calls AuthService.register. `POST /api/auth/login` → calls AuthService.login. Both return `ResponseEntity<ApiResponse<AuthResponse>>`. |
| `modules/user/service/UserService.java` | Fix package. `getMyProfile(email)` → find user by email, return UserResponse. `updateProfile(email, request)` → update name, save, return UserResponse. |
| `modules/user/controller/UserController.java` | Fix package. `GET /api/users/me` → get email from SecurityContext, call UserService. `PUT /api/users/me` → same. Both `@PreAuthorize("isAuthenticated()")`. |

**API this branch delivers:**
```
POST /api/auth/register   — public
POST /api/auth/login      — public
GET  /api/users/me        — JWT required
PUT  /api/users/me        — JWT required
```

---

## Rajveer — Tasks for feature/profile

Start this after feature/auth is merged into develop.

| File | What to write |
|------|--------------|
| `modules/customer/repository/CustomerProfileRepository.java` | `Optional<CustomerProfile> findByUserId(Long userId)` |
| `modules/customer/repository/AddressRepository.java` | `List<Address> findByCustomerProfileId(Long id)`, `Optional<Address> findByCustomerProfileIdAndIsDefaultTrue(Long id)` |
| `modules/customer/dto/CustomerDetailsRequest.java` | Fields: phone, preferenceNotes |
| `modules/customer/dto/CustomerDetailsResponse.java` | Fields: id, phone, preferenceNotes, List<AddressResponse> addresses |
| `modules/customer/dto/AddressRequest.java` | Fields: line1, line2, city, state, pincode, isDefault |
| `modules/customer/dto/AddressResponse.java` | Fields: id, line1, line2, city, state, pincode, isDefault |
| `modules/customer/service/CustomerService.java` | getProfile, updateProfile, addAddress, deleteAddress, setDefaultAddress |
| `modules/customer/controller/CustomerController.java` | GET/PUT /api/customers/me, POST/DELETE /api/customers/me/addresses |
| `frontend/src/pages/Login.jsx` | Full login form |
| `frontend/src/pages/Register.jsx` | Full register form |
| `frontend/src/pages/Profile.jsx` | Profile + address management |
| `frontend/src/context/AuthContext.jsx` | Auth state, token storage |
| `frontend/src/api/axiosClient.js` | Axios instance + JWT interceptor |
| `frontend/src/api/authApi.js` | login(), register() |
| `frontend/src/components/PrivateRoute.jsx` | Redirect if not authenticated |
| `frontend/src/components/Navbar.jsx` | Auth-aware — show user name + logout |

---

## Bhramika — Tasks for feature/cart

**Wait for feature/configuration + feature/auth to merge into develop, then rebase, then start.**

| File | What to write |
|------|--------------|
| `modules/cart/repository/CartRepository.java` | `Optional<Cart> findByUserId(Long userId)` |
| `modules/cart/repository/CartItemRepository.java` | `List<CartItem> findByCartId(Long cartId)`, `Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId)` |
| `modules/cart/dto/CartResponse.java` | Fields: id, userId, List<CartItemResponse> items, BigDecimal totalAmount |
| `modules/cart/dto/CartItemResponse.java` | Fields: id, productId, title, author, imageUrl, quantity, unitPrice, subtotal |
| `modules/cart/dto/AddToCartRequest.java` | Fields: productId (@NotNull), quantity (@Min(1)) |
| `modules/cart/dto/UpdateCartItemRequest.java` | Fields: quantity (@Min(1)) |
| `modules/cart/service/CartService.java` | getCart (create if not exists), addToCart (check stock, merge qty if same product), updateItem, removeItem, clearCart, calculateTotal |
| `modules/cart/controller/CartController.java` | GET /api/cart, POST /api/cart/items, PUT /api/cart/items/{id}, DELETE /api/cart/items/{id}, DELETE /api/cart — all @PreAuthorize("isAuthenticated()") |
| `frontend/src/pages/Cart.jsx` | List items, update qty, remove, show total, checkout button |

---

## Bhramika — Tasks for feature/wishlist

| File | What to write |
|------|--------------|
| `modules/wishlist/repository/WishlistRepository.java` | `Optional<Wishlist> findByUserId(Long userId)` |
| `modules/wishlist/repository/WishlistItemRepository.java` | `List<WishlistItem> findByWishlistId(Long id)`, `Optional<WishlistItem> findByWishlistIdAndProductId(Long wishlistId, Long productId)`, `boolean existsByWishlistIdAndProductId(Long wishlistId, Long productId)` |
| `modules/wishlist/dto/WishlistResponse.java` | Fields: id, userId, List<WishlistItemResponse> items |
| `modules/wishlist/dto/WishlistItemResponse.java` | Fields: id, productId, title, author, imageUrl, price |
| `modules/wishlist/service/WishlistService.java` | getWishlist (create if not exists), addItem (reject duplicates), removeItem |
| `modules/wishlist/controller/WishlistController.java` | GET /api/wishlist, POST /api/wishlist/items, DELETE /api/wishlist/items/{id} |
| `frontend/src/pages/Wishlist.jsx` | List items, move to cart button, remove button |

---

## Karthik — Tasks for feature/order

**Wait for feature/auth + feature/cart to merge, then rebase, then start service layer.**
*Repositories and DTOs can be started immediately after feature/configuration merges.*

| File | What to write |
|------|--------------|
| `modules/order/repository/OrderRepository.java` | `List<Order> findByUserIdOrderByCreatedAtDesc(Long userId)`, `Optional<Order> findByIdAndUserId(Long id, Long userId)`, `List<Order> findAllByOrderByCreatedAtDesc()` |
| `modules/order/repository/OrderItemRepository.java` | `List<OrderItem> findByOrderId(Long orderId)` |
| `modules/order/dto/OrderRequest.java` | Fields: deliveryAddressId (@NotNull) |
| `modules/order/dto/OrderResponse.java` | Fields: id, status, totalAmount, createdAt, List<OrderItemResponse> items, AddressResponse deliveryAddress |
| `modules/order/dto/OrderItemResponse.java` | Fields: id, productId, title, quantity, unitPrice, subtotal |
| `modules/order/dto/OrderStatusUpdateRequest.java` | Fields: OrderStatus status |
| `modules/order/service/OrderService.java` | placeOrder (convert cart items → order items, deduct stock, clear cart), getUserOrders, getOrderById, cancelOrder (PENDING only), admin: getAllOrders, updateOrderStatus |
| `modules/order/controller/OrderController.java` | POST /api/orders, GET /api/orders, GET /api/orders/{id}, PUT /api/orders/{id}/cancel, admin endpoints |
| `frontend/src/pages/Checkout.jsx` | Select delivery address, confirm order |
| `frontend/src/pages/Orders.jsx` | Order history, status, cancel button |

---

## Karthik — Tasks for feature/feedback

| File | What to write |
|------|--------------|
| `modules/feedback/repository/FeedbackRepository.java` | `findByProductIdOrderByCreatedAtDesc`, `findByUserId`, `findByUserIdAndProductId`, `@Query` average rating, `countByProductId` |
| `modules/feedback/dto/FeedbackRequest.java` | Fields: productId, rating (@Min(1) @Max(5)), comment |
| `modules/feedback/dto/FeedbackResponse.java` | Fields: id, userId, userName, productId, rating, comment, createdAt |
| `modules/feedback/dto/RatingSummary.java` | Fields: averageRating, totalCount, Map<Integer, Long> starDistribution |
| `modules/feedback/service/FeedbackService.java` | submitFeedback (one per user per product), updateFeedback, deleteFeedback, getProductFeedback, getRatingSummary |
| `modules/feedback/controller/FeedbackController.java` | POST/PUT/DELETE /api/feedback, GET /api/feedback/product/{id}, GET /api/feedback/product/{id}/summary |
| `frontend/src/pages/BookDetails.jsx` | Product info, rating display, feedback list, feedback form, add to cart, add to wishlist |

---

## Devraj — Tasks for feature/admin and feature/dashboard

Start after feature/configuration and feature/product are merged.

| File | What to write |
|------|--------------|
| `modules/admin/dto/DashboardResponse.java` | totalUsers, totalProducts, totalOrders, totalRevenue, lowStockCount |
| `modules/admin/dto/UserListResponse.java` | id, name, email, role, createdAt |
| `modules/admin/service/AdminService.java` | getDashboardStats, getAllUsers, getLowStockProducts |
| `modules/admin/controller/AdminController.java` | GET /api/admin/dashboard, /users, /products/low-stock — all @PreAuthorize("hasRole('ADMIN')") |
| `frontend/src/pages/Home.jsx` | Featured books, category links |
| `frontend/src/pages/Books.jsx` | Book listing, search bar, category filter, pagination |
| Frontend admin pages | Dashboard, ProductManagement, OrderManagement, UserManagement |

---

## Git Workflow — Every Session

```bash
# Always start here
git fetch origin
git checkout feature/<your-branch>
git rebase origin/develop          # get everyone's latest merged work

# Work + test one file at a time

# Commit after each working file
git add <specific file path>
git commit -m "feat(module): what this file does"

# Push regularly (at least at end of each session)
git push origin feature/<your-branch>

# When your entire branch task is done — open PR into develop on GitHub
# Post in group chat: PR OPEN — [name] — [link]
```

---

## Ownership Rules

| File / Area | Owner |
|-------------|-------|
| `entity/*.java` | Devraj — read-only for everyone |
| `config/*.java` | Devraj — do not touch |
| `pom.xml` | Devraj — announce before adding dependencies |
| `application.properties` | Devraj — no changes without approval |
| `common/*.java` + `exception/*.java` | Devraj |
| `security/*.java` | Rajveer |
| `modules/user/**` + `modules/customer/**` | Rajveer |
| `modules/product/**` + `modules/admin/**` | Devraj |
| `modules/cart/**` + `modules/wishlist/**` | Bhramika |
| `modules/order/**` + `modules/feedback/**` | Karthik |
| `frontend/src/context/` + `frontend/src/api/` | Rajveer creates first |
| `frontend/src/routes/AppRoutes.jsx` | Coordinated — each person adds their own routes |
| `frontend/src/components/Navbar.jsx` | Rajveer — others ask before modifying |

---

## Session Start Prompt (paste into AI every session)

**Rajveer:**
```
I am Rajveer on the BookStore team app.
Repo: c:\Users\Rajveer Singh\Bookstore_teamApp
My branches: feature/auth (then feature/profile)
My ownership: security layer (JwtUtil, JwtAuthFilter, UserDetailsServiceImpl, SecurityConfig),
user module (modules/user/**), customer module (modules/customer/**),
frontend auth pages, AuthContext, PrivateRoute, axiosClient.

Do first:
1. Read TEAM_PLAN.md
2. git log origin/develop --oneline -10
3. Read only files for my current task. Do not touch files outside my ownership.
Current task: [FILL IN]
```

**Devraj:**
```
I am Devraj on the BookStore team app.
My branches: feature/configuration, feature/product, feature/admin, feature/dashboard
My ownership: common utilities, exceptions, entities (read-only), product module,
admin module, frontend Home + Books + admin pages, Docker, pom.xml.

Do first:
1. Read TEAM_PLAN.md
2. git log origin/develop --oneline -10
3. Read only files for my current task.
Current task: [FILL IN]
```

**Bhramika:**
```
I am Bhramika on the BookStore team app.
My branches: feature/cart, feature/wishlist
My ownership: cart module (modules/cart/**), wishlist module (modules/wishlist/**),
frontend Cart page, Wishlist page.

Do first:
1. Read TEAM_PLAN.md
2. git log origin/develop --oneline -10
3. Before writing service layer, verify these are in develop:
   - modules/user/repository/UserRepository.java (Rajveer)
   - modules/product/repository/ProductRepository.java (Devraj)
   - common/ApiResponse.java (Devraj)
4. Read only files for my current task.
Never touch security, user, product, order, entity, or config files.
Current task: [FILL IN]
```

**Karthik:**
```
I am Karthik on the BookStore team app.
My branches: feature/order, feature/feedback
My ownership: order module (modules/order/**), feedback module (modules/feedback/**),
frontend Checkout, Orders, BookDetails pages.

Do first:
1. Read TEAM_PLAN.md
2. git log origin/develop --oneline -10
3. Before writing OrderService, verify these are in develop:
   - security/SecurityConfig.java (Rajveer — feature/auth merged)
   - modules/product/repository/ProductRepository.java (Devraj)
   - modules/cart/repository/CartRepository.java (Bhramika — feature/cart merged)
   - common/ApiResponse.java (Devraj)
4. Read only files for my current task.
Never touch security, user, product, cart, entity, or config files.
Current task: [FILL IN]
```

---

## Coordination Signals

| When | Format |
|------|--------|
| Starting | `STARTING — [name] — [task] — branch: feature/[branch]` |
| PR open | `PR OPEN — [name] — feature/[branch] — [GitHub link] — needs review` |
| PR merged | `MERGED — [name] — feature/[branch] — unblocks: [who]` |
| Blocked | `BLOCKED — [name] — waiting on: [whose PR / what]` |

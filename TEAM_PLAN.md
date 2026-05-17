# BookStore Team Plan

> **Single source of truth. Read this at the start of every session before touching any code.**
> Last updated: 2026-05-17

---

## Branch Assignments

| Branch | Owner | Scope |
|--------|-------|-------|
| `feature/configuration` | **Devraj** | ApiResponse, AppConstants, OrderStatus, exception classes |
| `feature/product` | **Devraj** | Product catalog — repository, service, controller, DTOs |
| `feature/admin` | **Devraj** | Admin backend + admin frontend pages |
| `feature/dashboard` | **Devraj** | Home page, Books page (partially done via admin branch) |
| `feature/auth` | **Rajveer** | JWT, Spring Security, user module |
| `feature/profile` | **Rajveer** | Customer profile + addresses + frontend auth pages |
| `feature/cart` | **Bhramika** | Cart backend + Cart frontend page |
| `feature/wishlist` | **Bhramika** | Wishlist backend + Wishlist frontend page |
| `feature/order` | **Karthik** | Order backend + Checkout + Orders frontend pages |
| `feature/feedback` | **Karthik** | Feedback backend + BookDetails frontend page |

**Rule: You only commit to your assigned branch(es). PRs go feature → develop. Never commit directly to develop or main.**

---

## Current Status — What Is Done

| Branch | Status | What's in develop |
|--------|--------|-------------------|
| `feature/configuration` | ✅ MERGED | ApiResponse, AppConstants, OrderStatus, all exception classes |
| `feature/product` | ✅ MERGED | Full product API — ProductRepository, CategoryRepository, ProductService, ProductController, DTOs |
| `feature/admin` | ✅ MERGED | AdminService, AdminController, DashboardResponse, UserListResponse + admin frontend pages (Dashboard, ProductManagement, OrderManagement, UserManagement) |
| `feature/auth` | ✅ MERGED (PR #1) | JwtUtil, JwtAuthFilter, UserDetailsServiceImpl, SecurityConfig, UserRepository, AuthService, AuthController, UserService, UserController, all auth DTOs |
| `feature/order` | ✅ MERGED (PR #2) | OrderRepository, OrderItemRepository, OrderRequest, OrderResponse, OrderItemResponse, OrderStatusUpdateRequest — **service + controller + frontend still TODO** |
| `feature/feedback` | ✅ MERGED (PR #3) | FeedbackRepository, FeedbackRequest, FeedbackResponse, RatingSummary — **service + controller + frontend still TODO** |
| `feature/profile` | ✅ MERGED (PR #4) | CustomerProfileRepository, AddressRepository, all customer DTOs, CustomerService, CustomerController + frontend: Login.jsx, Register.jsx, Profile.jsx, AuthContext, axiosClient, authApi, profileApi, PrivateRoute, Navbar (auth-aware), AppRoutes updated |
| `feature/cart` | 🟡 IN PROGRESS | CartRepository, CartItemRepository, CartResponse, AddToCartRequest, UpdateCartItemRequest on branch — **NOT merged. Service + controller + Cart.jsx still TODO** |
| `feature/wishlist` | 🟡 IN PROGRESS | WishlistRepository, WishlistItemRepository, WishlistResponse, WishlistItemResponse on branch — **NOT merged. Service + controller + Wishlist.jsx still TODO** |
| `feature/dashboard` | 🟡 PARTIAL | Home.jsx and Books.jsx updated via admin branch — already in develop. Branch itself has no new commits |

---

## What Is in develop RIGHT NOW (safe to depend on)

### Backend
```
security/
  JwtUtil.java, JwtAuthFilter.java, UserDetailsServiceImpl.java, SecurityConfig.java

modules/user/
  repository/UserRepository.java         — findByEmail, existsByEmail
  service/AuthService.java, UserService.java
  controller/AuthController.java, UserController.java
  dto/RegisterRequest, LoginRequest, AuthResponse, UserResponse

modules/customer/
  repository/CustomerProfileRepository.java, AddressRepository.java
  service/CustomerService.java
  controller/CustomerController.java
  dto/AddressRequest, AddressResponse, CustomerDetailsRequest, CustomerDetailsResponse

modules/product/
  repository/ProductRepository.java, CategoryRepository.java
  service/ProductService.java
  controller/ProductController.java
  dto/ProductRequest, ProductResponse

modules/admin/
  service/AdminService.java
  controller/AdminController.java
  dto/DashboardResponse, UserListResponse

modules/order/           — repositories + DTOs only (service/controller TODO)
modules/feedback/        — repository + DTOs only (service/controller TODO)

common/ApiResponse.java, AppConstants.java, OrderStatus.java
exception/ResourceNotFoundException.java, BadRequestException.java, GlobalExceptionHandler.java
entity/  — all 12 entities (User, Product, Category, Cart, CartItem, Wishlist, WishlistItem, Order, OrderItem, CustomerProfile, Address, Feedback)
```

### Frontend
```
src/api/axiosClient.js       — axios instance, auto-attaches Bearer token
src/api/authApi.js           — register(), login()
src/api/profileApi.js        — getCustomerDetails(), addAddress(), etc.
src/context/AuthContext.jsx  — user state, login(), logout(), localStorage
src/components/PrivateRoute.jsx
src/components/Navbar.jsx    — auth-aware (shows Profile/Logout or Login/Register)
src/routes/AppRoutes.jsx     — /profile, /cart, /checkout, /orders behind PrivateRoute; admin routes included
src/pages/Login.jsx          — working form
src/pages/Register.jsx       — working form
src/pages/Profile.jsx        — customer details + address management
src/pages/Home.jsx           — basic working page
src/pages/Books.jsx          — book listing with search and pagination
src/pages/admin/             — Dashboard, ProductManagement, OrderManagement, UserManagement
```

### Live API endpoints
```
POST /api/auth/register           public
POST /api/auth/login              public
GET  /api/users/me                JWT required
PUT  /api/users/me                JWT required
GET  /api/customers/details       JWT + USER role
PUT  /api/customers/details       JWT + USER role
POST /api/customers/addresses     JWT + USER role
PUT  /api/customers/addresses/{id}       JWT + USER role
DELETE /api/customers/addresses/{id}     JWT + USER role
PUT  /api/customers/addresses/{id}/default  JWT + USER role
GET  /api/products/**             public
GET  /api/categories/**           public
GET  /api/admin/**                JWT + ADMIN role
```

---

## What Still Needs to Be Done

### Bhramika — feature/cart (IMMEDIATE — unblocks Karthik)

Rebase onto develop first: `git rebase origin/develop`

Already done on branch (NOT yet in develop):
- ✅ CartRepository, CartItemRepository
- ✅ CartResponse, AddToCartRequest, UpdateCartItemRequest

Still TODO:

| File | What to write |
|------|--------------|
| `modules/cart/dto/CartItemResponse.java` | Fields: id, productId, title, author, imageUrl, quantity, unitPrice, subtotal |
| `modules/cart/service/CartService.java` | getCart (auto-create), addToCart (check stock, merge if same product), updateItem, removeItem, clearCart |
| `modules/cart/controller/CartController.java` | GET /api/cart, POST /api/cart/items, PUT /api/cart/items/{id}, DELETE /api/cart/items/{id}, DELETE /api/cart — all `@PreAuthorize("isAuthenticated()")` |
| `frontend/src/pages/Cart.jsx` | List items, update qty, remove, show total, Checkout button |

**Use axiosClient from `src/api/axiosClient.js` — it auto-sends the JWT token.**

After PR merged → post in chat: `MERGED: cart — Karthik can now depend on CartRepository`

---

### Bhramika — feature/wishlist

Already done on branch (NOT yet in develop):
- ✅ WishlistRepository, WishlistItemRepository
- ✅ WishlistResponse, WishlistItemResponse

Still TODO:

| File | What to write |
|------|--------------|
| `modules/wishlist/service/WishlistService.java` | getWishlist (auto-create), addItem (reject duplicates), removeItem |
| `modules/wishlist/controller/WishlistController.java` | GET /api/wishlist, POST /api/wishlist/items, DELETE /api/wishlist/items/{id} — all `@PreAuthorize("isAuthenticated()")` |
| `frontend/src/pages/Wishlist.jsx` | List items, remove button, move-to-cart button |

---

### Karthik — feature/order

**Wait for feature/cart to merge before writing OrderService** (needs CartRepository to clear cart on order).

Already done in develop:
- ✅ OrderRepository, OrderItemRepository
- ✅ OrderRequest, OrderResponse, OrderItemResponse, OrderStatusUpdateRequest

Still TODO:

| File | What to write |
|------|--------------|
| `modules/order/service/OrderService.java` | placeOrder (pull from cart → create order items → deduct stock → clear cart), getUserOrders, getOrderById, cancelOrder (PENDING only), admin: getAllOrders, updateOrderStatus |
| `modules/order/controller/OrderController.java` | POST /api/orders, GET /api/orders, GET /api/orders/{id}, PUT /api/orders/{id}/cancel — user endpoints `@PreAuthorize("isAuthenticated()")`. Admin endpoints `@PreAuthorize("hasRole('ADMIN')")` |
| `frontend/src/pages/Checkout.jsx` | Show cart summary, select delivery address from CustomerProfile, confirm order button |
| `frontend/src/pages/Orders.jsx` | Order history list, status badge, cancel button for PENDING orders |

**Key dependency:** OrderService.placeOrder must call CartRepository to clear the cart after order is placed. Import `CartRepository` from `modules/cart/repository/CartRepository.java`.

---

### Karthik — feature/feedback

Already done in develop:
- ✅ FeedbackRepository, FeedbackRequest, FeedbackResponse, RatingSummary

Still TODO:

| File | What to write |
|------|--------------|
| `modules/feedback/service/FeedbackService.java` | submitFeedback (one review per user per product — check with findByUserIdAndProductId), getProductFeedback, getRatingSummary |
| `modules/feedback/controller/FeedbackController.java` | POST /api/feedback `@PreAuthorize("isAuthenticated()")`, GET /api/feedback/product/{id} public, GET /api/feedback/product/{id}/summary public |
| `frontend/src/pages/BookDetails.jsx` | Product info, average rating display, feedback list, submit review form (if logged in), add to cart button, add to wishlist button |

---

### Devraj — feature/dashboard

Home.jsx and Books.jsx are already updated in develop (came in via admin branch). Check if any dashboard polish is still needed.

---

## Remaining Merge Order

```
5. Bhramika: PR feature/cart → develop
   Chat: "MERGED: cart — Karthik start OrderService now"

6. Karthik: implement OrderService + OrderController + Checkout.jsx + Orders.jsx → PR → develop
   Karthik: implement FeedbackService + FeedbackController + BookDetails.jsx → PR → develop

7. Bhramika: PR feature/wishlist → develop
   Chat: "MERGED: wishlist"

8. All: rebase all remaining branches onto develop, integration test → develop → main
```

---

## Rajveer — ALL TASKS COMPLETE ✅

Both branches fully implemented and merged:
- `feature/auth` — PR #1 merged ✅
- `feature/profile` — PR #4 merged ✅

No further backend or frontend tasks assigned to Rajveer.

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
| `frontend/src/context/` + `frontend/src/api/` | Rajveer owns — others can add new api files |
| `frontend/src/routes/AppRoutes.jsx` | Coordinated — each person adds their own routes |
| `frontend/src/components/Navbar.jsx` | Rajveer owns — others ask before modifying |

---

## Git Workflow — Every Session

```bash
# Always start here
git fetch origin
git checkout feature/<your-branch>
git rebase origin/develop

# Commit after each file
git add <specific-file>
git commit -m "[YourName]: what this file does"

# Push at end of session
git push origin feature/<your-branch>

# When branch is complete — open PR on GitHub into develop
# Post in group chat: PR OPEN — [name] — [link]
```

**Commit message format by person:**
- Rajveer: `[Rajveer]: description`
- Devraj: `[Devraj]: description`
- Bhramika: `[Brahmika] Added: description`
- Karthik: `[Kartikeya] Added: description`

---

## Session Start Prompt (paste into AI every session)

**Rajveer:**
```
I am Rajveer on the BookStore team app.
Repo: c:\Users\Rajveer Singh\Bookstore_teamApp
All my tasks are COMPLETE (feature/auth PR #1 merged, feature/profile PR #4 merged).
Read TEAM_PLAN.md and git log origin/develop --oneline -10 to confirm current state.
```

**Devraj:**
```
I am Devraj on the BookStore team app.
Repo: [repo path]
My branches: feature/dashboard (check if anything remains — Home.jsx + Books.jsx already in develop)
My ownership: common utilities, exceptions, entities, product module, admin module, pom.xml, config.

Do first:
1. Read TEAM_PLAN.md
2. git log origin/develop --oneline -10
3. Read only files for my current task.
Current task: [FILL IN]
```

**Bhramika:**
```
I am Bhramika on the BookStore team app.
Repo: [repo path]
My branches: feature/cart (IN PROGRESS), feature/wishlist (IN PROGRESS)
My ownership: modules/cart/**, modules/wishlist/**, frontend Cart.jsx, Wishlist.jsx

Do first:
1. Read TEAM_PLAN.md
2. git fetch origin && git checkout feature/cart && git rebase origin/develop
3. Auth is in develop — use axiosClient from src/api/axiosClient.js (auto-sends JWT)
4. CartRepository and DTOs are already on this branch. Next: CartService → CartController → Cart.jsx
Never touch security, user, product, order, entity, or config files.
Current task: [FILL IN]
```

**Karthik:**
```
I am Karthik on the BookStore team app.
Repo: [repo path]
My branches: feature/order (IN PROGRESS), feature/feedback (IN PROGRESS)
My ownership: modules/order/**, modules/feedback/**, frontend Checkout.jsx, Orders.jsx, BookDetails.jsx

Do first:
1. Read TEAM_PLAN.md
2. git fetch origin && git checkout feature/order && git rebase origin/develop
3. Repositories + DTOs are already in develop. Next: OrderService (needs feature/cart merged first) → OrderController → frontend pages
4. For FeedbackService — can start now, no cart dependency
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

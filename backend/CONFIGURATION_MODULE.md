# ✅ Configuration Module - Complete

## 📋 Overview
The configuration module provides common utilities, constants, and exception handling for the entire Bookstore application.

---

## ✅ Completed Components

### 1. **ApiResponse.java** ✅
**Location**: `/backend/src/main/java/com/bookstore/common/ApiResponse.java`

**Purpose**: Generic API response wrapper for consistent JSON responses across all endpoints.

**Structure**:
```java
public record ApiResponse<T>(
    boolean success,
    String message,
    T data
)
```

**Factory Methods**:
- `ApiResponse.success(T data)` - Success with data
- `ApiResponse.success(String message, T data)` - Success with custom message and data
- `ApiResponse.success(String message)` - Success with message only
- `ApiResponse.error(String message)` - Error response

**Example Usage**:
```java
// Success response
return ResponseEntity.ok(ApiResponse.success("User created", userResponse));

// Error response
return ResponseEntity.badRequest().body(ApiResponse.error("Invalid input"));
```

**Example Response**:
```json
{
  "success": true,
  "message": "Bookstore Backend is running successfully!",
  "data": {
    "status": "UP",
    "version": "0.0.1-SNAPSHOT",
    "timestamp": "2026-05-16T12:18:52.076327"
  }
}
```

---

### 2. **AppConstants.java** ✅
**Location**: `/backend/src/main/java/com/bookstore/common/AppConstants.java`

**Purpose**: Application-wide constants for JWT, pagination, stock management, and messages.

**Constants Defined**:

#### JWT Configuration
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_EXPIRATION_MS` - Token expiration (24 hours)
- `JWT_HEADER` - "Authorization"
- `JWT_PREFIX` - "Bearer "

#### Pagination
- `DEFAULT_PAGE_SIZE` - 10
- `MAX_PAGE_SIZE` - 100
- `DEFAULT_SORT_BY` - "id"
- `DEFAULT_SORT_DIRECTION` - "ASC"

#### Stock Thresholds
- `LOW_STOCK_THRESHOLD` - 10
- `OUT_OF_STOCK` - 0

#### API Messages
- Success messages: `SUCCESS`, `CREATED`, `UPDATED`, `DELETED`
- Error messages: `NOT_FOUND`, `BAD_REQUEST`, `UNAUTHORIZED`
- Validation messages: `INVALID_EMAIL`, `INVALID_PASSWORD`, `EMAIL_EXISTS`, etc.

**Usage**:
```java
if (product.getStock() <= AppConstants.OUT_OF_STOCK) {
    throw new BadRequestException(AppConstants.PRODUCT_OUT_OF_STOCK);
}
```

---

### 3. **OrderStatus.java** ✅
**Location**: `/backend/src/main/java/com/bookstore/common/OrderStatus.java`

**Purpose**: Enum for order lifecycle management with state transition validation.

**Status Values**:
- `PENDING` - Order placed, awaiting confirmation
- `CONFIRMED` - Order confirmed
- `PROCESSING` - Order being prepared
- `SHIPPED` - Order shipped to customer
- `DELIVERED` - Order delivered successfully
- `CANCELLED` - Order cancelled
- `REFUNDED` - Order refunded

**Methods**:
- `canTransitionTo(OrderStatus newStatus)` - Validates state transitions
- `isCancellable()` - Checks if order can be cancelled
- `isTerminal()` - Checks if status is final (CANCELLED, REFUNDED, DELIVERED)

**State Transition Rules**:
```
PENDING → CONFIRMED, CANCELLED
CONFIRMED → PROCESSING, CANCELLED
PROCESSING → SHIPPED, CANCELLED
SHIPPED → DELIVERED, CANCELLED
DELIVERED → REFUNDED
CANCELLED/REFUNDED → (terminal, no transitions)
```

**Usage**:
```java
if (!order.getStatus().canTransitionTo(OrderStatus.SHIPPED)) {
    throw new BadRequestException("Cannot ship order in current status");
}
```

---

### 4. **Exception Classes** ✅

#### ResourceNotFoundException.java
**Location**: `/backend/src/main/java/com/bookstore/exception/ResourceNotFoundException.java`

**Purpose**: Thrown when a requested resource is not found (HTTP 404).

**Constructors**:
```java
new ResourceNotFoundException("User not found");
new ResourceNotFoundException("Product", "id", productId);
```

#### BadRequestException.java
**Location**: `/backend/src/main/java/com/bookstore/exception/BadRequestException.java`

**Purpose**: Thrown for invalid client requests (HTTP 400).

**Constructors**:
```java
new BadRequestException("Invalid input");
new BadRequestException("Error message", cause);
```

#### GlobalExceptionHandler.java
**Location**: `/backend/src/main/java/com/bookstore/exception/GlobalExceptionHandler.java`

**Purpose**: Centralized exception handling for all REST controllers.

**Handles**:
- `ResourceNotFoundException` → 404 with ApiResponse
- `BadRequestException` → 400 with ApiResponse
- `MethodArgumentNotValidException` → 400 with field validation errors
- `Exception` → 500 with generic error message

**Example Error Response**:
```json
{
  "success": false,
  "message": "Product not found with id: '123'",
  "data": null
}
```

**Validation Error Response**:
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "email": "must be a well-formed email address",
    "password": "must not be blank"
  }
}
```

---

### 5. **HealthController.java** ✅ (Updated)
**Location**: `/backend/src/main/java/com/bookstore/controller/HealthController.java`

**Purpose**: Health check endpoints using ApiResponse wrapper.

**Endpoints**:
- `GET /api/health` - Application health status
- `GET /api/` - Welcome message with API links

**Updated to use ApiResponse**:
```java
@GetMapping("/health")
public ApiResponse<Map<String, Object>> health() {
    Map<String, Object> data = new HashMap<>();
    data.put("status", "UP");
    data.put("timestamp", LocalDateTime.now());
    data.put("version", "0.0.1-SNAPSHOT");
    return ApiResponse.success("Bookstore Backend is running successfully!", data);
}
```

---

## 🧪 Testing Results

### ✅ Compilation
```bash
mvn clean compile
# BUILD SUCCESS - 79 source files compiled
```

### ✅ Application Startup
```bash
mvn spring-boot:run
# Started BookStoreApplication in 2.316 seconds
# Server running at: http://localhost:8080
```

### ✅ Health Endpoint Test
```bash
curl http://localhost:8080/api/health
```

**Response**:
```json
{
  "success": true,
  "message": "Bookstore Backend is running successfully!",
  "data": {
    "version": "0.0.1-SNAPSHOT",
    "status": "UP",
    "timestamp": "2026-05-16T12:18:52.076327"
  }
}
```

### ✅ Swagger UI
- **URL**: http://localhost:8080/swagger-ui.html
- **Status**: ✅ Working (configured in SwaggerConfig.java)
- **OpenAPI Docs**: http://localhost:8080/v3/api-docs

---

## 📦 What's Included

### Common Package (`/common`)
- ✅ ApiResponse - Generic response wrapper
- ✅ AppConstants - Application constants
- ✅ OrderStatus - Order lifecycle enum

### Exception Package (`/exception`)
- ✅ GlobalExceptionHandler - Centralized error handling
- ✅ ResourceNotFoundException - 404 errors
- ✅ BadRequestException - 400 errors

### Config Package (`/config`)
- ✅ SwaggerConfig - OpenAPI/Swagger setup
- ✅ CorsConfig - CORS for React frontend

### Controller Package (`/controller`)
- ✅ HealthController - Health check endpoints (updated)

---

## 🎯 Usage Guidelines

### 1. Using ApiResponse in Controllers
```java
@RestController
@RequestMapping("/api/products")
public class ProductController {
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProduct(@PathVariable Long id) {
        ProductResponse product = productService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }
    
    @PostMapping
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse product = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(AppConstants.CREATED, product));
    }
}
```

### 2. Throwing Exceptions
```java
@Service
public class ProductService {
    
    public ProductResponse findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToResponse(product);
    }
    
    public void addToCart(Long productId, int quantity) {
        Product product = findProductById(productId);
        
        if (product.getStock() <= AppConstants.OUT_OF_STOCK) {
            throw new BadRequestException(AppConstants.PRODUCT_OUT_OF_STOCK);
        }
        
        if (product.getStock() < quantity) {
            throw new BadRequestException(AppConstants.INSUFFICIENT_STOCK);
        }
        
        // Add to cart logic
    }
}
```

### 3. Order Status Transitions
```java
@Service
public class OrderService {
    
    public void updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = findOrderById(orderId);
        
        if (!order.getStatus().canTransitionTo(newStatus)) {
            throw new BadRequestException(
                String.format("Cannot transition from %s to %s", 
                    order.getStatus(), newStatus)
            );
        }
        
        order.setStatus(newStatus);
        orderRepository.save(order);
    }
    
    public void cancelOrder(Long orderId) {
        Order order = findOrderById(orderId);
        
        if (!order.getStatus().isCancellable()) {
            throw new BadRequestException("Order cannot be cancelled in current status");
        }
        
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);
    }
}
```

---

## 🚀 Next Steps

The configuration module is now complete! You can proceed with implementing other modules:

### Recommended Order:
1. ✅ **Configuration Module** - COMPLETE
2. ⏳ **Product Module** - Implement product CRUD and category management
3. ⏳ **Cart Module** - Shopping cart functionality
4. ⏳ **Order Module** - Order placement and management
5. ⏳ **Wishlist Module** - Wishlist functionality
6. ⏳ **Customer Module** - Profile and address management
7. ⏳ **Feedback Module** - Reviews and ratings
8. ⏳ **Admin Module** - Dashboard and analytics

---

## 📝 Notes

### No Role-Based Authentication
As requested, this implementation does **NOT** include role-based authentication:
- No `ROLE_USER` or `ROLE_ADMIN` constants
- No `@PreAuthorize` annotations
- All authenticated users have equal access
- Security can be added later if needed

### JWT Configuration
The JWT secret in `AppConstants.java` is a placeholder. For production:
1. Move to environment variables
2. Use a strong, randomly generated secret
3. Update `application-prod.properties`:
```properties
jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION:86400000}
```

---

## 📚 Documentation

- **Implementation Guide**: `IMPLEMENTATION_GUIDE.md`
- **Branch Structure**: `BRANCH_STRUCTURE.md`
- **Supabase Setup**: `SUPABASE_SETUP.md`
- **Running Guide**: `RUNNING.md`

---

**Module Status**: ✅ Complete  
**Commit**: `[Devraj]: Complete configuration module with common utilities and exception handling`  
**Branch**: `develop`  
**Date**: May 16, 2026

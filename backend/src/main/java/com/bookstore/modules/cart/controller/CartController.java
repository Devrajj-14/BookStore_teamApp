package com.bookstore.modules.cart.controller;

import com.bookstore.common.ApiResponse;
import com.bookstore.modules.cart.dto.AddToCartRequest;
import com.bookstore.modules.cart.dto.CartResponse;
import com.bookstore.modules.cart.dto.UpdateCartItemRequest;
import com.bookstore.modules.cart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // GET /api/cart — get current user's cart
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        CartResponse cart = cartService.getCart();
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    // POST /api/cart/add — add item to cart
    @PostMapping("/add")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(@Valid @RequestBody AddToCartRequest request) {
        CartResponse cart = cartService.addToCart(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Item added to cart", cart));
    }

    // PUT /api/cart/items/{id} — update cart item quantity
    @PutMapping("/items/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartResponse cart = cartService.updateCartItem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated", cart));
    }

    // DELETE /api/cart/items/{id} — remove single item
    @DeleteMapping("/items/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> removeCartItem(@PathVariable Long id) {
        cartService.removeCartItem(id);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/cart/clear — clear entire cart
    @DeleteMapping("/clear")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> clearCart() {
        cartService.clearCart();
        return ResponseEntity.noContent().build();
    }
}

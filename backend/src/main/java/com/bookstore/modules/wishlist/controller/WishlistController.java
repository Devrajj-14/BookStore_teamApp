package com.bookstore.modules.wishlist.controller;

import com.bookstore.common.ApiResponse;
import com.bookstore.modules.wishlist.dto.WishlistResponse;
import com.bookstore.modules.wishlist.service.WishlistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // GET /api/wishlist — get current user's wishlist
    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<WishlistResponse>> getWishlist() {
        WishlistResponse wishlist = wishlistService.getWishlist();
        return ResponseEntity.ok(ApiResponse.success(wishlist));
    }

    // POST /api/wishlist/add/{productId} — add product to wishlist
    @PostMapping("/add/{productId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<WishlistResponse>> addToWishlist(@PathVariable Long productId) {
        WishlistResponse wishlist = wishlistService.addToWishlist(productId);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Product added to wishlist", wishlist));
    }

    // DELETE /api/wishlist/remove/{productId} — remove product from wishlist
    @DeleteMapping("/remove/{productId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId) {
        wishlistService.removeFromWishlist(productId);
        return ResponseEntity.noContent().build();
    }

    // GET /api/wishlist/check/{productId} — check if product is in wishlist
    @GetMapping("/check/{productId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Boolean>> checkInWishlist(@PathVariable Long productId) {
        boolean inWishlist = wishlistService.isInWishlist(productId);
        return ResponseEntity.ok(ApiResponse.success(inWishlist));
    }
}

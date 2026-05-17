package com.bookstore.modules.wishlist.service;

import com.bookstore.entity.Product;
import com.bookstore.entity.User;
import com.bookstore.entity.Wishlist;
import com.bookstore.entity.WishlistItem;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.modules.product.repository.ProductRepository;
import com.bookstore.modules.user.repository.UserRepository;
import com.bookstore.modules.wishlist.dto.WishlistItemResponse;
import com.bookstore.modules.wishlist.dto.WishlistResponse;
import com.bookstore.modules.wishlist.repository.WishlistItemRepository;
import com.bookstore.modules.wishlist.repository.WishlistRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           WishlistItemRepository wishlistItemRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    // --- Get current logged-in user's ID via SecurityContext ---
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }

    // --- Get or create wishlist for user ---
    private Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            Wishlist newWishlist = new Wishlist();
            newWishlist.setUser(user);
            return wishlistRepository.save(newWishlist);
        });
    }

    // --- Build WishlistResponse from Wishlist entity ---
    private WishlistResponse buildWishlistResponse(Wishlist wishlist) {
        List<WishlistItem> items = wishlistItemRepository.findByWishlistId(wishlist.getId());

        List<WishlistItemResponse> itemResponses = items.stream().map(item -> {
            WishlistItemResponse r = new WishlistItemResponse();
            r.setId(item.getId());
            r.setProductId(item.getProduct().getId());
            r.setProductTitle(item.getProduct().getTitle());
            r.setProductAuthor(item.getProduct().getAuthor());
            r.setProductImage(item.getProduct().getImageUrl());
            r.setProductPrice(item.getProduct().getPrice());
            r.setInStock(item.getProduct().getStockQuantity() > 0);
            return r;
        }).collect(Collectors.toList());

        WishlistResponse response = new WishlistResponse();
        response.setId(wishlist.getId());
        response.setUserId(wishlist.getUser().getId());
        response.setItems(itemResponses);
        response.setTotalItems(itemResponses.size());
        return response;
    }

    // --- Get wishlist ---
    public WishlistResponse getWishlist() {
        Long userId = getCurrentUserId();
        Wishlist wishlist = getOrCreateWishlist(userId);
        return buildWishlistResponse(wishlist);
    }

    // --- Add product to wishlist ---
    @Transactional
    public WishlistResponse addToWishlist(Long productId) {
        Long userId = getCurrentUserId();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        Wishlist wishlist = getOrCreateWishlist(userId);

        if (wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId)) {
            throw new BadRequestException("Product is already in your wishlist");
        }

        WishlistItem item = new WishlistItem();
        item.setWishlist(wishlist);
        item.setProduct(product);
        wishlistItemRepository.save(item);

        return buildWishlistResponse(wishlist);
    }

    // --- Remove product from wishlist ---
    @Transactional
    public void removeFromWishlist(Long productId) {
        Long userId = getCurrentUserId();
        Wishlist wishlist = getOrCreateWishlist(userId);

        WishlistItem item = wishlistItemRepository
                .findByWishlistIdAndProductId(wishlist.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in wishlist"));

        wishlistItemRepository.delete(item);
    }

    // --- Check if product is in wishlist ---
    public boolean isInWishlist(Long productId) {
        Long userId = getCurrentUserId();
        Wishlist wishlist = getOrCreateWishlist(userId);
        return wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId);
    }
}

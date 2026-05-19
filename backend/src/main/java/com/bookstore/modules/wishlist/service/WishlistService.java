package com.bookstore.modules.wishlist.service;

import com.bookstore.modules.BaseService;
import com.bookstore.modules.wishlist.dto.WishlistResponse;

public interface WishlistService extends BaseService {

    WishlistResponse getWishlist();

    WishlistResponse addToWishlist(Long productId);

    void removeFromWishlist(Long productId);

<<<<<<< HEAD
    boolean isInWishlist(Long productId);
=======
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }

    private Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            Wishlist newWishlist = new Wishlist();
            newWishlist.setUser(user);
            return wishlistRepository.save(newWishlist);
        });
    }

    // --- Build WishlistResponse using MapStruct ---
    private WishlistResponse buildWishlistResponse(Wishlist wishlist) {
        List<WishlistItem> items = wishlistItemRepository.findByWishlistId(wishlist.getId());
        List<WishlistItemResponse> itemResponses = wishlistMapper.toWishlistItemResponseList(items);

        WishlistResponse response = wishlistMapper.toWishlistResponse(wishlist);
        response.setItems(itemResponses);
        response.setTotalItems(itemResponses.size());
        return response;
    }

    public WishlistResponse getWishlist() {
        Long userId = getCurrentUserId();
        Wishlist wishlist = getOrCreateWishlist(userId);
        return buildWishlistResponse(wishlist);
    }

    @Transactional
    public WishlistResponse addToWishlist(Long productId) {
        Long userId = getCurrentUserId();

        productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", productId));

        Wishlist wishlist = getOrCreateWishlist(userId);

        if (wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId)) {
            throw new BadRequestException("Product is already in your wishlist");
        }

        Product product = productRepository.findById(productId).get();
        WishlistItem item = new WishlistItem();
        item.setWishlist(wishlist);
        item.setProduct(product);
        wishlistItemRepository.save(item);

        return buildWishlistResponse(wishlist);
    }

    @Transactional
    public void removeFromWishlist(Long productId) {
        Long userId = getCurrentUserId();
        Wishlist wishlist = getOrCreateWishlist(userId);

        WishlistItem item = wishlistItemRepository
                .findByWishlistIdAndProductId(wishlist.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in wishlist"));

        wishlistItemRepository.delete(item);
    }

    public boolean isInWishlist(Long productId) {
        Long userId = getCurrentUserId();
        Wishlist wishlist = getOrCreateWishlist(userId);
        return wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId);
    }
>>>>>>> 7d6305e333995a1d1d89ddd2138dde9a7a3d3f9c
}

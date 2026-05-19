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
import com.bookstore.modules.wishlist.mapper.WishlistMapper;
import com.bookstore.modules.wishlist.repository.WishlistItemRepository;
import com.bookstore.modules.wishlist.repository.WishlistRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final WishlistMapper wishlistMapper;

    public WishlistServiceImpl(WishlistRepository wishlistRepository,
                               WishlistItemRepository wishlistItemRepository,
                               ProductRepository productRepository,
                               UserRepository userRepository,
                               WishlistMapper wishlistMapper) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.wishlistMapper = wishlistMapper;
    }

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

    private WishlistResponse buildWishlistResponse(Wishlist wishlist) {
        List<WishlistItem> items = wishlistItemRepository.findByWishlistId(wishlist.getId());
        List<WishlistItemResponse> itemResponses = wishlistMapper.toWishlistItemResponseList(items);

        WishlistResponse response = wishlistMapper.toWishlistResponse(wishlist);
        response.setItems(itemResponses);
        response.setTotalItems(itemResponses.size());
        return response;
    }

    @Override
    public WishlistResponse getWishlist() {
        Long userId = getCurrentUserId();
        Wishlist wishlist = getOrCreateWishlist(userId);
        return buildWishlistResponse(wishlist);
    }

    @Override
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

    @Override
    @Transactional
    public void removeFromWishlist(Long productId) {
        Long userId = getCurrentUserId();
        Wishlist wishlist = getOrCreateWishlist(userId);

        WishlistItem item = wishlistItemRepository
                .findByWishlistIdAndProductId(wishlist.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in wishlist"));

        wishlistItemRepository.delete(item);
    }

    @Override
    public boolean isInWishlist(Long productId) {
        Long userId = getCurrentUserId();
        Wishlist wishlist = getOrCreateWishlist(userId);
        return wishlistItemRepository.existsByWishlistIdAndProductId(wishlist.getId(), productId);
    }
}

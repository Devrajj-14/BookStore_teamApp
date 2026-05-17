package com.bookstore.modules.cart.service;

import com.bookstore.common.AppConstants;
import com.bookstore.entity.Cart;
import com.bookstore.entity.CartItem;
import com.bookstore.entity.Product;
import com.bookstore.entity.User;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.modules.cart.dto.AddToCartRequest;
import com.bookstore.modules.cart.dto.CartItemResponse;
import com.bookstore.modules.cart.dto.CartResponse;
import com.bookstore.modules.cart.dto.UpdateCartItemRequest;
import com.bookstore.modules.cart.repository.CartItemRepository;
import com.bookstore.modules.cart.repository.CartRepository;
import com.bookstore.modules.product.repository.ProductRepository;
import com.bookstore.modules.user.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
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

    // --- Get or create cart for user ---
    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setTotalAmount(BigDecimal.ZERO);
            return cartRepository.save(newCart);
        });
    }

    // --- Build CartResponse from Cart entity ---
    private CartResponse buildCartResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

        List<CartItemResponse> itemResponses = items.stream().map(item -> {
            CartItemResponse r = new CartItemResponse();
            r.setId(item.getId());
            r.setProductId(item.getProduct().getId());
            r.setProductTitle(item.getProduct().getTitle());
            r.setProductImage(item.getProduct().getImageUrl());
            r.setUnitPrice(item.getUnitPrice());
            r.setQuantity(item.getQuantity());
            r.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            return r;
        }).collect(Collectors.toList());

        BigDecimal total = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUser().getId());
        response.setItems(itemResponses);
        response.setTotalAmount(total);
        return response;
    }

    // --- Get cart ---
    public CartResponse getCart() {
        Long userId = getCurrentUserId();
        Cart cart = getOrCreateCart(userId);
        return buildCartResponse(cart);
    }

    // --- Add item to cart ---
    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {
        Long userId = getCurrentUserId();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", request.getProductId()));

        if (product.getStockQuantity() <= AppConstants.OUT_OF_STOCK) {
            throw new BadRequestException(AppConstants.PRODUCT_OUT_OF_STOCK);
        }
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException(AppConstants.INSUFFICIENT_STOCK);
        }

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existing = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existing.isPresent()) {
            CartItem item = existing.get();
            int newQty = item.getQuantity() + request.getQuantity();
            if (product.getStockQuantity() < newQty) {
                throw new BadRequestException(AppConstants.INSUFFICIENT_STOCK);
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity());
            item.setUnitPrice(product.getPrice());
            cartItemRepository.save(item);
        }

        return buildCartResponse(cart);
    }

    // --- Update cart item quantity ---
    @Transactional
    public CartResponse updateCartItem(Long itemId, UpdateCartItemRequest request) {
        Long userId = getCurrentUserId();
        Cart cart = getOrCreateCart(userId);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to current user");
        }

        if (item.getProduct().getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException(AppConstants.INSUFFICIENT_STOCK);
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        return buildCartResponse(cart);
    }

    // --- Remove single item from cart ---
    @Transactional
    public void removeCartItem(Long itemId) {
        Long userId = getCurrentUserId();
        Cart cart = getOrCreateCart(userId);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Cart item does not belong to current user");
        }

        cartItemRepository.delete(item);
    }

    // --- Clear entire cart ---
    @Transactional
    public void clearCart() {
        Long userId = getCurrentUserId();
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartId(cart.getId());
    }
}

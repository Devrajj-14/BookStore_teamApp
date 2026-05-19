package com.bookstore.modules.cart.service;

import com.bookstore.modules.BaseService;
import com.bookstore.modules.cart.dto.AddToCartRequest;
import com.bookstore.modules.cart.dto.CartResponse;
import com.bookstore.modules.cart.dto.UpdateCartItemRequest;

public interface CartService extends BaseService {

    CartResponse getCart();

    CartResponse addToCart(AddToCartRequest request);

    CartResponse updateCartItem(Long itemId, UpdateCartItemRequest request);

    void removeCartItem(Long itemId);

<<<<<<< HEAD
    void clearCart();
=======
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

    // --- Build CartResponse using MapStruct ---
    private CartResponse buildCartResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        List<CartItemResponse> itemResponses = cartMapper.toCartItemResponseList(items);

        BigDecimal total = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartResponse response = cartMapper.toCartResponse(cart, items);
        response.setItems(itemResponses);
        response.setTotalAmount(total);
        return response;
    }

    public CartResponse getCart() {
        Long userId = getCurrentUserId();
        Cart cart = getOrCreateCart(userId);
        return buildCartResponse(cart);
    }

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

    @Transactional
    public void clearCart() {
        Long userId = getCurrentUserId();
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteByCartId(cart.getId());
    }
>>>>>>> 7d6305e333995a1d1d89ddd2138dde9a7a3d3f9c
}

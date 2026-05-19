package com.bookstore.modules.wishlist.mapper;

import com.bookstore.entity.Wishlist;
import com.bookstore.entity.WishlistItem;
import com.bookstore.modules.wishlist.dto.WishlistItemResponse;
import com.bookstore.modules.wishlist.dto.WishlistResponse;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class WishlistMapper {

<<<<<<< HEAD
    public WishlistItemResponse toWishlistItemResponse(WishlistItem item) {
        WishlistItemResponse r = new WishlistItemResponse();
        r.setId(item.getId());
        r.setProductId(item.getProduct().getId());
        r.setProductTitle(item.getProduct().getTitle());
        r.setProductAuthor(item.getProduct().getAuthor());
        r.setProductImage(item.getProduct().getImageUrl());
        r.setProductPrice(item.getProduct().getPrice());
        r.setInStock(item.getProduct().getStockQuantity() > 0);
        return r;
=======
    // WishlistItem → WishlistItemResponse
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.title", target = "productTitle")
    @Mapping(source = "product.author", target = "productAuthor")
    @Mapping(source = "product.imageUrl", target = "productImage")
    @Mapping(source = "product.price", target = "productPrice")
    @Mapping(target = "inStock", ignore = true) // computed in @AfterMapping
    WishlistItemResponse toWishlistItemResponse(WishlistItem wishlistItem);

    // Compute inStock after mapping
    @AfterMapping
    default void computeInStock(WishlistItem wishlistItem, @MappingTarget WishlistItemResponse response) {
        if (wishlistItem.getProduct() != null) {
            response.setInStock(wishlistItem.getProduct().getStockQuantity() > 0);
        }
>>>>>>> 7d6305e333995a1d1d89ddd2138dde9a7a3d3f9c
    }

    public List<WishlistItemResponse> toWishlistItemResponseList(List<WishlistItem> items) {
        return items.stream()
                .map(this::toWishlistItemResponse)
                .collect(Collectors.toList());
    }

<<<<<<< HEAD
    public WishlistResponse toWishlistResponse(Wishlist wishlist) {
        WishlistResponse r = new WishlistResponse();
        r.setId(wishlist.getId());
        r.setUserId(wishlist.getUser().getId());
        return r;
=======
    // Wishlist → WishlistResponse
    @Mapping(source = "user.id", target = "userId")
    @Mapping(target = "items", ignore = true)   // set manually after mapping
    @Mapping(target = "totalItems", ignore = true) // computed in @AfterMapping
    WishlistResponse toWishlistResponse(Wishlist wishlist);

    @AfterMapping
    default void computeTotalItems(Wishlist wishlist, @MappingTarget WishlistResponse response) {
        if (response.getItems() != null) {
            response.setTotalItems(response.getItems().size());
        }
>>>>>>> 7d6305e333995a1d1d89ddd2138dde9a7a3d3f9c
    }
}

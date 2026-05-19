package com.bookstore.modules.wishlist.mapper;

import com.bookstore.entity.Wishlist;
import com.bookstore.entity.WishlistItem;
import com.bookstore.modules.wishlist.dto.WishlistItemResponse;
import com.bookstore.modules.wishlist.dto.WishlistResponse;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WishlistMapper {

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
    }

    List<WishlistItemResponse> toWishlistItemResponseList(List<WishlistItem> wishlistItems);

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
    }
}

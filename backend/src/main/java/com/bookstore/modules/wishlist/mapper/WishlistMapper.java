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

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.title", target = "productTitle")
    @Mapping(source = "product.author", target = "productAuthor")
    @Mapping(source = "product.imageUrl", target = "productImage")
    @Mapping(source = "product.price", target = "productPrice")
    @Mapping(target = "inStock", ignore = true)
    WishlistItemResponse toWishlistItemResponse(WishlistItem wishlistItem);

    @AfterMapping
    default void computeInStock(WishlistItem wishlistItem, @MappingTarget WishlistItemResponse response) {
        if (wishlistItem.getProduct() != null) {
            response.setInStock(wishlistItem.getProduct().getStockQuantity() > 0);
        }
    }

    List<WishlistItemResponse> toWishlistItemResponseList(List<WishlistItem> wishlistItems);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "totalItems", ignore = true)
    WishlistResponse toWishlistResponse(Wishlist wishlist);
}

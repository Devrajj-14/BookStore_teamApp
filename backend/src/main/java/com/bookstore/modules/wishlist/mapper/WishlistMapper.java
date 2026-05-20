package com.bookstore.modules.wishlist.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bookstore.entity.Wishlist;
import com.bookstore.entity.WishlistItem;
import com.bookstore.modules.wishlist.dto.WishlistItemResponse;
import com.bookstore.modules.wishlist.dto.WishlistResponse;

@Mapper(componentModel = "spring")
public interface WishlistMapper {

    @Mapping(target = "productId",    source = "product.id")
    @Mapping(target = "productTitle", source = "product.title")
    @Mapping(target = "productAuthor",source = "product.author")
    @Mapping(target = "productImage", source = "product.imageUrl")
    @Mapping(target = "productPrice", source = "product.price")
    @Mapping(target = "inStock",
             expression = "java(item.getProduct().getStockQuantity() > 0)")
    WishlistItemResponse toWishlistItemResponse(WishlistItem item);

    List<WishlistItemResponse> toWishlistItemResponseList(List<WishlistItem> items);

    @Mapping(target = "userId",     source = "user.id")
    @Mapping(target = "items",      ignore = true)
    @Mapping(target = "totalItems", ignore = true)
    WishlistResponse toWishlistResponse(Wishlist wishlist);
}

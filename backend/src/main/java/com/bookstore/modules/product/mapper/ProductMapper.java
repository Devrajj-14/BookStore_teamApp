package com.bookstore.modules.product.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bookstore.entity.Product;
import com.bookstore.modules.product.dto.ProductResponse;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "categoryId",   source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    ProductResponse toProductResponse(Product product);
}

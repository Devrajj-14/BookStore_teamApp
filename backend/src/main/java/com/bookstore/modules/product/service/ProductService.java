package com.bookstore.modules.product.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.bookstore.modules.BaseService;
import com.bookstore.modules.product.dto.ProductRequest;
import com.bookstore.modules.product.dto.ProductResponse;

public interface ProductService extends BaseService {

    Page<ProductResponse> getAllProducts(Pageable pageable);

    ProductResponse getProductById(Long id);

    Page<ProductResponse> searchProducts(String keyword, Pageable pageable);

    Page<ProductResponse> getProductsByCategory(Long categoryId, Pageable pageable);

    Page<ProductResponse> getProductsByAuthor(String author, Pageable pageable);

    ProductResponse createProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    void deleteProduct(Long id);

    ProductResponse updateStock(Long id, Integer quantity);
}

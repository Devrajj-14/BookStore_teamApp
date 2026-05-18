package com.bookstore.modules.wishlist.dto;

import java.math.BigDecimal;

public class WishlistItemResponse {

    private Long id;
    private Long productId;
    private String productTitle;
    private String productAuthor;
    private String productImage;
    private BigDecimal productPrice;
    private Boolean inStock;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

    public String getProductAuthor() { return productAuthor; }
    public void setProductAuthor(String productAuthor) { this.productAuthor = productAuthor; }

    public String getProductImage() { return productImage; }
    public void setProductImage(String productImage) { this.productImage = productImage; }

    public BigDecimal getProductPrice() { return productPrice; }
    public void setProductPrice(BigDecimal productPrice) { this.productPrice = productPrice; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }
}

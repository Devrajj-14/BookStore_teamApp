package com.bookstore.modules.wishlist.repository;

import com.bookstore.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Long> {

    boolean existsByWishlistIdAndProductId(Long wishlistId, Long productId);

    Optional<WishlistItem> findByWishlistIdAndProductId(Long wishlistId, Long productId);

    List<WishlistItem> findByWishlistId(Long wishlistId);
}

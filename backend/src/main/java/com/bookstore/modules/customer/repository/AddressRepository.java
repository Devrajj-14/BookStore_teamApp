package com.bookstore.modules.customer.repository;

import com.bookstore.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByCustomerProfileId(Long profileId);
    Optional<Address> findByCustomerProfileIdAndIsDefaultTrue(Long profileId);
}

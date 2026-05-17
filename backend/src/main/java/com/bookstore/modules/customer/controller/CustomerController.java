package com.bookstore.modules.customer.controller;

import com.bookstore.common.ApiResponse;
import com.bookstore.modules.customer.dto.AddressRequest;
import com.bookstore.modules.customer.dto.AddressResponse;
import com.bookstore.modules.customer.dto.CustomerDetailsRequest;
import com.bookstore.modules.customer.dto.CustomerDetailsResponse;
import com.bookstore.modules.customer.service.CustomerService;
import com.bookstore.modules.user.repository.UserRepository;
import com.bookstore.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final UserRepository userRepository;

    public CustomerController(CustomerService customerService, UserRepository userRepository) {
        this.customerService = customerService;
        this.userRepository = userRepository;
    }

    @GetMapping("/details")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<CustomerDetailsResponse>> getDetails(Principal principal) {
        Long userId = resolveUserId(principal);
        return ResponseEntity.ok(ApiResponse.success(customerService.getCustomerDetails(userId)));
    }

    @PutMapping("/details")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<CustomerDetailsResponse>> updateDetails(
            Principal principal,
            @Valid @RequestBody CustomerDetailsRequest request) {
        Long userId = resolveUserId(principal);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", customerService.updateCustomerDetails(userId, request)));
    }

    @PostMapping("/addresses")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<AddressResponse>> addAddress(
            Principal principal,
            @Valid @RequestBody AddressRequest request) {
        Long userId = resolveUserId(principal);
        return ResponseEntity.ok(ApiResponse.success("Address added", customerService.addAddress(userId, request)));
    }

    @PutMapping("/addresses/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<AddressResponse>> updateAddress(
            Principal principal,
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {
        Long userId = resolveUserId(principal);
        return ResponseEntity.ok(ApiResponse.success("Address updated", customerService.updateAddress(userId, id, request)));
    }

    @DeleteMapping("/addresses/{id}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(Principal principal, @PathVariable Long id) {
        Long userId = resolveUserId(principal);
        customerService.deleteAddress(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Address deleted", null));
    }

    @PutMapping("/addresses/{id}/default")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<Void>> setDefaultAddress(Principal principal, @PathVariable Long id) {
        Long userId = resolveUserId(principal);
        customerService.setDefaultAddress(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Default address updated", null));
    }

    private Long resolveUserId(Principal principal) {
        return userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"))
                .getId();
    }
}

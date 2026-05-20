package com.bookstore.modules.customer.service;

import com.bookstore.modules.BaseService;
import com.bookstore.modules.customer.dto.AddressRequest;
import com.bookstore.modules.customer.dto.AddressResponse;
import com.bookstore.modules.customer.dto.CustomerDetailsRequest;
import com.bookstore.modules.customer.dto.CustomerDetailsResponse;

public interface CustomerService extends BaseService {

    CustomerDetailsResponse getCustomerDetails(Long userId);

    CustomerDetailsResponse updateCustomerDetails(Long userId, CustomerDetailsRequest request);

    AddressResponse addAddress(Long userId, AddressRequest request);

    AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request);

    void deleteAddress(Long userId, Long addressId);

    void setDefaultAddress(Long userId, Long addressId);
}

package com.bookstore.modules.customer.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.bookstore.entity.Address;
import com.bookstore.entity.CustomerProfile;
import com.bookstore.modules.customer.dto.AddressResponse;
import com.bookstore.modules.customer.dto.CustomerDetailsResponse;

@Mapper(componentModel = "spring")
public interface CustomerMapper {

    AddressResponse toAddressResponse(Address address);

    List<AddressResponse> toAddressResponseList(List<Address> addresses);

    @Mapping(target = "userId",         source = "user.id")
    @Mapping(target = "addresses",      ignore = true)
    @Mapping(target = "defaultAddress", ignore = true)
    CustomerDetailsResponse toCustomerDetailsResponse(CustomerProfile profile);
}

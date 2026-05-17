package com.bookstore.modules.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDetailsResponse {
    private Long id;
    private Long userId;
    private String phone;
    private String preferenceNotes;
    private List<AddressResponse> addresses;
    private AddressResponse defaultAddress;
}

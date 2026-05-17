package com.bookstore.modules.customer.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressResponse {
    private Long id;
    private String line1;
    private String line2;
    private String city;
    private String state;
    private String pincode;
    private Boolean isDefault;
}

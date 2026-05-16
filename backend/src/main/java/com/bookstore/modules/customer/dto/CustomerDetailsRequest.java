package com.bookstore.modules.customer.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CustomerDetailsRequest {

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number")
    private String phone;

    private String preferenceNotes;
}

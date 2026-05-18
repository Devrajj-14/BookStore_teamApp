package com.bookstore.modules.customer.dto;

import jakarta.validation.constraints.Pattern;

public class CustomerDetailsRequest {

    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Invalid phone number")
    private String phone;

    private String preferenceNotes;

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPreferenceNotes() { return preferenceNotes; }
    public void setPreferenceNotes(String preferenceNotes) { this.preferenceNotes = preferenceNotes; }
}

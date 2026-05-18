package com.bookstore.modules.customer.dto;

import java.util.List;

public class CustomerDetailsResponse {

    private Long id;
    private Long userId;
    private String phone;
    private String preferenceNotes;
    private List<AddressResponse> addresses;
    private AddressResponse defaultAddress;

    public CustomerDetailsResponse() {}

    public CustomerDetailsResponse(Long id, Long userId, String phone, String preferenceNotes, List<AddressResponse> addresses, AddressResponse defaultAddress) {
        this.id = id; this.userId = userId; this.phone = phone;
        this.preferenceNotes = preferenceNotes; this.addresses = addresses; this.defaultAddress = defaultAddress;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getPreferenceNotes() { return preferenceNotes; }
    public void setPreferenceNotes(String preferenceNotes) { this.preferenceNotes = preferenceNotes; }

    public List<AddressResponse> getAddresses() { return addresses; }
    public void setAddresses(List<AddressResponse> addresses) { this.addresses = addresses; }

    public AddressResponse getDefaultAddress() { return defaultAddress; }
    public void setDefaultAddress(AddressResponse defaultAddress) { this.defaultAddress = defaultAddress; }
}

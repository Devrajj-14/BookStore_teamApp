package com.bookstore.modules.customer.service;

import com.bookstore.entity.Address;
import com.bookstore.entity.CustomerProfile;
import com.bookstore.entity.User;
import com.bookstore.exception.BadRequestException;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.modules.customer.dto.AddressRequest;
import com.bookstore.modules.customer.dto.AddressResponse;
import com.bookstore.modules.customer.dto.CustomerDetailsRequest;
import com.bookstore.modules.customer.dto.CustomerDetailsResponse;
import com.bookstore.modules.customer.repository.AddressRepository;
import com.bookstore.modules.customer.repository.CustomerProfileRepository;
import com.bookstore.modules.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    private final CustomerProfileRepository profileRepository;
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public CustomerService(CustomerProfileRepository profileRepository,
                           AddressRepository addressRepository,
                           UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    public CustomerDetailsResponse getCustomerDetails(Long userId) {
        CustomerProfile profile = getOrCreateProfile(userId);
        return toResponse(profile);
    }

    @Transactional
    public CustomerDetailsResponse updateCustomerDetails(Long userId, CustomerDetailsRequest request) {
        CustomerProfile profile = getOrCreateProfile(userId);
        profile.setPhone(request.getPhone());
        profile.setPreferenceNotes(request.getPreferenceNotes());
        profileRepository.save(profile);
        return toResponse(profile);
    }

    @Transactional
    public AddressResponse addAddress(Long userId, AddressRequest request) {
        CustomerProfile profile = getOrCreateProfile(userId);

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            clearDefaultAddress(profile.getId());
        }

        Address address = new Address();
        address.setCustomerProfile(profile);
        mapAddressFields(request, address);
        addressRepository.save(address);
        return toAddressResponse(address);
    }

    @Transactional
    public AddressResponse updateAddress(Long userId, Long addressId, AddressRequest request) {
        Address address = getAddressBelongingToUser(userId, addressId);

        if (Boolean.TRUE.equals(request.getIsDefault())) {
            clearDefaultAddress(address.getCustomerProfile().getId());
        }

        mapAddressFields(request, address);
        addressRepository.save(address);
        return toAddressResponse(address);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        Address address = getAddressBelongingToUser(userId, addressId);
        addressRepository.delete(address);
    }

    @Transactional
    public void setDefaultAddress(Long userId, Long addressId) {
        Address address = getAddressBelongingToUser(userId, addressId);
        clearDefaultAddress(address.getCustomerProfile().getId());
        address.setIsDefault(true);
        addressRepository.save(address);
    }

    private CustomerProfile getOrCreateProfile(Long userId) {
        return profileRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            CustomerProfile profile = new CustomerProfile();
            profile.setUser(user);
            return profileRepository.save(profile);
        });
    }

    private Address getAddressBelongingToUser(Long userId, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));
        CustomerProfile profile = getOrCreateProfile(userId);
        if (!address.getCustomerProfile().getId().equals(profile.getId())) {
            throw new BadRequestException("Address does not belong to this user");
        }
        return address;
    }

    private void clearDefaultAddress(Long profileId) {
        addressRepository.findByCustomerProfileIdAndIsDefaultTrue(profileId)
                .ifPresent(addr -> {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                });
    }

    private void mapAddressFields(AddressRequest request, Address address) {
        address.setLine1(request.getLine1());
        address.setLine2(request.getLine2());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
        address.setIsDefault(Boolean.TRUE.equals(request.getIsDefault()));
    }

    private CustomerDetailsResponse toResponse(CustomerProfile profile) {
        List<AddressResponse> addresses = addressRepository
                .findByCustomerProfileId(profile.getId())
                .stream()
                .map(this::toAddressResponse)
                .collect(Collectors.toList());

        AddressResponse defaultAddress = addresses.stream()
                .filter(a -> Boolean.TRUE.equals(a.getIsDefault()))
                .findFirst()
                .orElse(null);

        return new CustomerDetailsResponse(
                profile.getId(),
                profile.getUser().getId(),
                profile.getPhone(),
                profile.getPreferenceNotes(),
                addresses,
                defaultAddress
        );
    }

    private AddressResponse toAddressResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getLine1(),
                address.getLine2(),
                address.getCity(),
                address.getState(),
                address.getPincode(),
                address.getIsDefault()
        );
    }
}

package com.bookstore.modules.user.controller;

import com.bookstore.common.ApiResponse;
import com.bookstore.modules.user.dto.UserResponse;
import com.bookstore.modules.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(Principal principal) {
        UserResponse response = userService.getMyProfile(principal.getName());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            Principal principal,
            @RequestParam String name) {
        UserResponse response = userService.updateProfile(principal.getName(), name);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", response));
    }
}

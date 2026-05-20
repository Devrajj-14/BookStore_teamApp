package com.bookstore.modules.user.service;

import org.springframework.stereotype.Service;

import com.bookstore.entity.User;
import com.bookstore.exception.BadRequestException;
import com.bookstore.modules.user.dto.UserResponse;
import com.bookstore.modules.user.mapper.UserMapper;
import com.bookstore.modules.user.repository.UserRepository;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserResponse getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        return userMapper.toUserResponse(user);
    }

    @Override
    public UserResponse updateProfile(String email, String newName) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        user.setName(newName);
        userRepository.save(user);
        return userMapper.toUserResponse(user);
    }
}

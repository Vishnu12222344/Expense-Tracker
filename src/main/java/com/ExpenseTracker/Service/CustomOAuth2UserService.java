package com.ExpenseTracker.Security;

import com.ExpenseTracker.Model.User;
import com.ExpenseTracker.Repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Extract attributes
        String email = oAuth2User.getAttribute("email");

        // If email is null (happens if user hasn't verified email on FB),
        // fallback to using their Facebook ID
        if (email == null) {
            String id = oAuth2User.getAttribute("id");
            email = id + "@facebook.com";
        }

        // Save or update user in your database to ensure data isolation works
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(""); // No password for OAuth users
            userRepository.save(newUser);
        }

        return oAuth2User;
    }
}
package ru.spbstu.gadgethub.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.spbstu.gadgethub.dto.ErrorResponse;
import ru.spbstu.gadgethub.dto.LoginRequest;
import ru.spbstu.gadgethub.dto.UserResponse;
import ru.spbstu.gadgethub.model.User;
import ru.spbstu.gadgethub.service.AuthService;

@RestController
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public CompletableFuture<ResponseEntity<Object>> login(
            @RequestBody LoginRequest request, HttpServletRequest httpRequest) {

        if (request.getUsername() == null || request.getUsername().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            return CompletableFuture.completedFuture(
                    ResponseEntity.badRequest().<Object>body(new ErrorResponse("Заполните логин и пароль")));
        }

        return authService.authenticate(request.getUsername(), request.getPassword())
                .thenApply(maybeUser -> {
                    if (maybeUser.isEmpty()) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .<Object>body(new ErrorResponse(
                                        "Такого пользователя нет, возможно неправильный логин или "
                                                + "пароль — проверьте данные"));
                    }
                    User user = maybeUser.get();
                    HttpSession session = httpRequest.getSession(true);
                    authService.storeUserInSession(session, user);
                    return ResponseEntity.ok().<Object>body(new UserResponse(user.getId(), user.getUsername()));
                });
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public CompletableFuture<ResponseEntity<Object>> me(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null) {
            return CompletableFuture.completedFuture(
                    ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .<Object>body(new ErrorResponse("Требуется авторизация")));
        }

        return authService.currentUser(session).thenApply((Optional<User> maybeUser) -> {
            if (maybeUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .<Object>body(new ErrorResponse("Требуется авторизация"));
            }
            User user = maybeUser.get();
            return ResponseEntity.ok().<Object>body(new UserResponse(user.getId(), user.getUsername()));
        });
    }
}

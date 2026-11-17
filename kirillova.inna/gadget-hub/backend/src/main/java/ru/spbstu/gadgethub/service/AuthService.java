package ru.spbstu.gadgethub.service;

import jakarta.servlet.http.HttpSession;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import org.springframework.stereotype.Service;
import ru.spbstu.gadgethub.model.User;
import ru.spbstu.gadgethub.storage.UsersStorage;

@Service
public class AuthService {

    public static final String SESSION_USER_ID_KEY = "userId";

    private final UsersStorage usersStorage;

    public AuthService(UsersStorage usersStorage) {
        this.usersStorage = usersStorage;
    }

    public CompletableFuture<Optional<User>> authenticate(String username, String password) {
        return usersStorage.findByUsername(username)
                .thenApply(maybeUser -> maybeUser.filter(u -> u.getPassword().equals(password)));
    }

    public void storeUserInSession(HttpSession session, User user) {
        session.setAttribute(SESSION_USER_ID_KEY, user.getId());
    }

    public Optional<Long> currentUserId(HttpSession session) {
        Object value = session.getAttribute(SESSION_USER_ID_KEY);
        return value instanceof Long id ? Optional.of(id) : Optional.empty();
    }

    public CompletableFuture<Optional<User>> currentUser(HttpSession session) {
        Optional<Long> userId = currentUserId(session);
        if (userId.isEmpty()) {
            return CompletableFuture.completedFuture(Optional.empty());
        }
        return usersStorage.findById(userId.get());
    }
}

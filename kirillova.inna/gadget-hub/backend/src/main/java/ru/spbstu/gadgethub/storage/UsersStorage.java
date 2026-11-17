package ru.spbstu.gadgethub.storage;

import java.nio.file.Path;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import ru.spbstu.gadgethub.model.User;

public class UsersStorage {

    private final JsonFileStorage storage;
    private final Path usersFile;

    public UsersStorage(JsonFileStorage storage, Path dataDirectory) {
        this.storage = storage;
        this.usersFile = dataDirectory.resolve("users.json");
    }

    public CompletableFuture<Optional<User>> findByUsername(String username) {
        return storage.readList(usersFile, User.class)
                .thenApply(users -> users.stream()
                        .filter(u -> u.getUsername().equals(username))
                        .findFirst());
    }

    public CompletableFuture<Optional<User>> findById(long id) {
        return storage.readList(usersFile, User.class)
                .thenApply(users -> users.stream()
                        .filter(u -> u.getId() == id)
                        .findFirst());
    }
}

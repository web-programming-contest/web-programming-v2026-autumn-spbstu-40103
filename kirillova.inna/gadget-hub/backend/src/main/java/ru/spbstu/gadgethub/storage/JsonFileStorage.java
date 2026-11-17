package ru.spbstu.gadgethub.storage;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.locks.ReentrantReadWriteLock;
import org.springframework.stereotype.Component;

@Component
public class JsonFileStorage {

    private final ObjectMapper objectMapper;
    private final java.util.Map<Path, ReentrantReadWriteLock> locks = new java.util.concurrent.ConcurrentHashMap<>();

    public JsonFileStorage(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    private ReentrantReadWriteLock lockFor(Path path) {
        return locks.computeIfAbsent(path, p -> new ReentrantReadWriteLock());
    }

    public <T> CompletableFuture<List<T>> readList(Path path, Class<T> elementType) {
        return CompletableFuture.supplyAsync(() -> {
            ReentrantReadWriteLock lock = lockFor(path);
            lock.readLock().lock();
            try {
                if (!Files.exists(path)) {
                    return List.<T>of();
                }
                byte[] bytes = Files.readAllBytes(path);
                CollectionType listType =
                        objectMapper.getTypeFactory().constructCollectionType(List.class, elementType);
                @SuppressWarnings("unchecked")
                List<T> result = (List<T>) objectMapper.readValue(bytes, listType);
                return result;
            } catch (IOException e) {
                throw new StorageException("Не удалось прочитать файл " + path, e);
            } finally {
                lock.readLock().unlock();
            }
        });
    }

    public <T> CompletableFuture<Void> writeList(Path path, List<T> items) {
        return CompletableFuture.runAsync(() -> {
            ReentrantReadWriteLock lock = lockFor(path);
            lock.writeLock().lock();
            try {
                Files.createDirectories(path.getParent());
                Path tmp = path.resolveSibling(path.getFileName() + ".tmp");
                objectMapper.writerWithDefaultPrettyPrinter().writeValue(tmp.toFile(), items);
                Files.move(tmp, path, java.nio.file.StandardCopyOption.REPLACE_EXISTING,
                        java.nio.file.StandardCopyOption.ATOMIC_MOVE);
            } catch (IOException e) {
                throw new StorageException("Не удалось записать файл " + path, e);
            } finally {
                lock.writeLock().unlock();
            }
        });
    }

    public static class StorageException extends RuntimeException {
        public StorageException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
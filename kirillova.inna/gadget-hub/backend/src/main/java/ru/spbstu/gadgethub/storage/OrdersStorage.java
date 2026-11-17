package ru.spbstu.gadgethub.storage;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import ru.spbstu.gadgethub.model.Order;

public class OrdersStorage {

    private final JsonFileStorage storage;
    private final Path ordersFile;

    public OrdersStorage(JsonFileStorage storage, Path dataDirectory) {
        this.storage = storage;
        this.ordersFile = dataDirectory.resolve("orders.json");
    }

    public CompletableFuture<List<Order>> findByUserId(long userId) {
        return storage.readList(ordersFile, Order.class)
                .thenApply(orders -> orders.stream()
                        .filter(o -> o.getUserId() == userId)
                        .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                        .toList());
    }

    public CompletableFuture<Order> create(Order order) {
        return storage.readList(ordersFile, Order.class)
                .thenCompose(existing -> {
                    long nextId = existing.stream()
                            .mapToLong(Order::getId)
                            .max()
                            .orElse(0L) + 1;
                    order.setId(nextId);

                    List<Order> updated = new ArrayList<>(existing);
                    updated.add(order);
                    return storage.writeList(ordersFile, updated).thenApply(ignored -> order);
                });
    }
}

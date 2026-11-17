package ru.spbstu.gadgethub.storage;

import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import ru.spbstu.gadgethub.model.Product;

public class GoodsStorage {

    private final JsonFileStorage storage;
    private final Path goodsFile;

    public GoodsStorage(JsonFileStorage storage, Path dataDirectory) {
        this.storage = storage;
        this.goodsFile = dataDirectory.resolve("goods.json");
    }

    public CompletableFuture<List<Product>> findAll() {
        return storage.readList(goodsFile, Product.class);
    }
}

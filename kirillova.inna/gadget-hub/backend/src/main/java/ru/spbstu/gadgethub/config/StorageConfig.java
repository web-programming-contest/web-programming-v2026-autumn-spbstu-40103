package ru.spbstu.gadgethub.config;

import java.nio.file.Path;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.spbstu.gadgethub.storage.GoodsStorage;
import ru.spbstu.gadgethub.storage.JsonFileStorage;
import ru.spbstu.gadgethub.storage.OrdersStorage;
import ru.spbstu.gadgethub.storage.UsersStorage;

@Configuration
public class StorageConfig {

    @Bean
    public GoodsStorage goodsStorage(JsonFileStorage storage, Path dataDirectoryPath) {
        return new GoodsStorage(storage, dataDirectoryPath);
    }

    @Bean
    public UsersStorage usersStorage(JsonFileStorage storage, Path dataDirectoryPath) {
        return new UsersStorage(storage, dataDirectoryPath);
    }

    @Bean
    public OrdersStorage ordersStorage(JsonFileStorage storage, Path dataDirectoryPath) {
        return new OrdersStorage(storage, dataDirectoryPath);
    }
}

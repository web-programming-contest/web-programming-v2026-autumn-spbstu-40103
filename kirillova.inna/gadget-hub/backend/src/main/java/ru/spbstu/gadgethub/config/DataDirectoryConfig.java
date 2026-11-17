package ru.spbstu.gadgethub.config;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

@Configuration
public class DataDirectoryConfig {

    @Value("${app.data.directory:data}")
    private String dataDirectory;

    @Bean
    public Path dataDirectoryPath() {
        return Paths.get(dataDirectory).toAbsolutePath().normalize();
    }

    @Bean
    public CommandLineRunner seedDataOnStartup(Path dataDirectoryPath) {
        return args -> {
            Files.createDirectories(dataDirectoryPath);
            copyIfMissing(dataDirectoryPath, "goods.json");
            copyIfMissing(dataDirectoryPath, "users.json");
            copyIfMissing(dataDirectoryPath, "orders.json");
        };
    }

    private void copyIfMissing(Path directory, String fileName) throws IOException {
        Path target = directory.resolve(fileName);
        if (Files.exists(target)) {
            return;
        }
        ClassPathResource resource = new ClassPathResource("data/" + fileName);
        try (InputStream in = resource.getInputStream()) {
            Files.copy(in, target);
        }
    }
}

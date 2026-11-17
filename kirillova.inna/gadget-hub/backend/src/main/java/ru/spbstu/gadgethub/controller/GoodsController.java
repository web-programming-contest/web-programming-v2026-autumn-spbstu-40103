package ru.spbstu.gadgethub.controller;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.spbstu.gadgethub.model.Product;
import ru.spbstu.gadgethub.storage.GoodsStorage;

@RestController
public class GoodsController {

    private static final int DEFAULT_PAGE_SIZE = 9;

    private final GoodsStorage goodsStorage;

    public GoodsController(GoodsStorage goodsStorage) {
        this.goodsStorage = goodsStorage;
    }

    @GetMapping("/goods")
    public CompletableFuture<ResponseEntity<Map<String, Object>>> getGoods(
            @RequestParam(required = false) Integer priceFrom,
            @RequestParam(required = false) Integer priceTo,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String color,
            @RequestParam(required = false, defaultValue = "newest") String sort,
            @RequestParam(required = false, defaultValue = "desc") String order,
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "" + DEFAULT_PAGE_SIZE) int pageSize) {

        Set<String> categories = splitCsv(category);
        Set<String> colors = splitCsv(color);

        return goodsStorage.findAll().thenApply(products -> {
            List<Product> filtered = products.stream()
                    .filter(p -> priceFrom == null || p.getPrice() >= priceFrom)
                    .filter(p -> priceTo == null || p.getPrice() <= priceTo)
                    .filter(p -> categories.isEmpty() || categories.contains(p.getCategory()))
                    .filter(p -> colors.isEmpty() || colors.contains(p.getColor()))
                    .sorted(comparatorFor(sort, order))
                    .toList();

            int safePage = Math.max(page, 1);
            int safePageSize = Math.max(pageSize, 1);
            int fromIndex = Math.min((safePage - 1) * safePageSize, filtered.size());
            int toIndex = Math.min(fromIndex + safePageSize, filtered.size());
            List<Product> pageItems = filtered.subList(fromIndex, toIndex);

            int totalPages = (int) Math.ceil(filtered.size() / (double) safePageSize);

            List<String> allCategories = products.stream()
                    .map(Product::getCategory)
                    .filter(value -> value != null && !value.isBlank())
                    .distinct()
                    .sorted(String.CASE_INSENSITIVE_ORDER)
                    .toList();

            Map<String, Object> body = Map.of(
                    "items", pageItems,
                    "total", filtered.size(),
                    "page", safePage,
                    "pageSize", safePageSize,
                    "totalPages", Math.max(totalPages, 1),
                    "categories", allCategories,
                    "minPrice", products.stream().mapToInt(Product::getPrice).min().orElse(0),
                    "maxPrice", products.stream().mapToInt(Product::getPrice).max().orElse(0));
            return ResponseEntity.ok(body);
        });
    }

    private Set<String> splitCsv(String value) {
        if (value == null || value.isBlank()) {
            return Set.of();
        }
        return java.util.Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

    private Comparator<Product> comparatorFor(String sort, String order) {
        Comparator<Product> base = switch (sort) {
            case "price", "priceAsc", "priceDesc" -> Comparator.comparingInt(Product::getPrice);
            case "popular" -> Comparator.comparingDouble(Product::getRating);
            default -> Comparator.comparing(Product::isNew);
        };
        boolean ascending = "asc".equalsIgnoreCase(order) || "priceAsc".equals(sort);
        return ascending ? base : base.reversed();
    }
}

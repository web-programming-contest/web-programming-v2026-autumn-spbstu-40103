package ru.spbstu.gadgethub.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import ru.spbstu.gadgethub.dto.CreateOrderRequest;
import ru.spbstu.gadgethub.dto.ErrorResponse;
import ru.spbstu.gadgethub.model.Order;
import ru.spbstu.gadgethub.model.OrderItem;
import ru.spbstu.gadgethub.model.Product;
import ru.spbstu.gadgethub.service.AuthService;
import ru.spbstu.gadgethub.storage.GoodsStorage;
import ru.spbstu.gadgethub.storage.OrdersStorage;

@RestController
public class OrdersController {

    private final OrdersStorage ordersStorage;
    private final GoodsStorage goodsStorage;
    private final AuthService authService;

    public OrdersController(OrdersStorage ordersStorage, GoodsStorage goodsStorage, AuthService authService) {
        this.ordersStorage = ordersStorage;
        this.goodsStorage = goodsStorage;
        this.authService = authService;
    }

    @GetMapping("/orders")
    public CompletableFuture<ResponseEntity<List<Order>>> getOrders(HttpServletRequest httpRequest) {
        long userId = currentUserIdOrThrow(httpRequest);
        return ordersStorage.findByUserId(userId).thenApply(ResponseEntity::ok);
    }

    @PostMapping("/orders")
    public CompletableFuture<ResponseEntity<Object>> createOrder(
            @RequestBody CreateOrderRequest request, HttpServletRequest httpRequest) {

        long userId = currentUserIdOrThrow(httpRequest);

        String validationError = validate(request);
        if (validationError != null) {
            return CompletableFuture.completedFuture(
                    ResponseEntity.badRequest().<Object>body(new ErrorResponse(validationError)));
        }

        if (request.getItems() == null || request.getItems().isEmpty()) {
            return CompletableFuture.completedFuture(
                    ResponseEntity.badRequest().<Object>body(new ErrorResponse("Корзина пуста")));
        }

        boolean badQuantity = request.getItems().stream()
                .anyMatch(item -> item.getQuantity() < 1 || item.getQuantity() > 999);
        if (badQuantity) {
            return CompletableFuture.completedFuture(
                    ResponseEntity.badRequest().<Object>body(new ErrorResponse("Некорректное количество товара")));
        }

        return goodsStorage.findAll().thenCompose(products -> {
            Map<Long, Product> productById = products.stream()
                    .collect(java.util.stream.Collectors.toMap(Product::getId, p -> p));

            List<OrderItem> orderItems = request.getItems().stream()
                    .map(cartItem -> {
                        Product product = productById.get(cartItem.getProductId());
                        if (product == null) {
                            throw new IllegalArgumentException(
                                    "Товар с id=" + cartItem.getProductId() + " не найден");
                        }
                        return new OrderItem(product.getId(), product.getName(), product.getPrice(),
                                cartItem.getQuantity());
                    })
                    .toList();

            int totalPrice = orderItems.stream()
                    .mapToInt(item -> item.getPrice() * item.getQuantity())
                    .sum();

            Order order = new Order();
            order.setUserId(userId);
            order.setCreatedAt(LocalDateTime.now());
            order.setItems(orderItems);
            order.setTotalPrice(totalPrice);
            order.setPhone(request.getPhone());
            order.setEmail(request.getEmail());
            order.setDeliveryType(request.getDeliveryType());
            order.setAddress(request.getAddress());
            order.setPaymentMethod(request.getPaymentMethod());
            order.setNeedsPackaging(request.isNeedsPackaging());

            return ordersStorage.create(order).thenApply(created -> ResponseEntity.ok().<Object>body(created));
        }).exceptionally(ex -> ResponseEntity.badRequest()
                .<Object>body(new ErrorResponse(rootMessage(ex))));
    }

    private String validate(CreateOrderRequest request) {
        if (request.getPhone() == null || request.getPhone().isBlank()) {
            return "Заполните обязательное поле: телефон";
        }
        if (!"pickup".equals(request.getDeliveryType()) && !"delivery".equals(request.getDeliveryType())) {
            return "Выберите способ получения: самовывоз или доставка";
        }
        if ("delivery".equals(request.getDeliveryType())
                && (request.getAddress() == null || request.getAddress().isBlank())) {
            return "Заполните обязательное поле: адрес доставки";
        }
        if (!"card".equals(request.getPaymentMethod()) && !"cash".equals(request.getPaymentMethod())) {
            return "Выберите способ оплаты";
        }
        return null;
    }

    private long currentUserIdOrThrow(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        Optional<Long> userId = session == null
                ? Optional.empty()
                : authService.currentUserId(session);
        return userId.orElseThrow(() ->
                new org.springframework.web.server.ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Требуется авторизация"));
    }

    private String rootMessage(Throwable ex) {
        Throwable cause = ex;
        while (cause.getCause() != null) {
            cause = cause.getCause();
        }
        return cause.getMessage() != null ? cause.getMessage() : "Не удалось оформить заказ";
    }
}

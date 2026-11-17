package ru.spbstu.gadgethub.dto;

import java.util.List;

public class CreateOrderRequest {

    private List<CartItemDto> items;
    private String phone;
    private String email;
    private String deliveryType;
    private String address;
    private String paymentMethod;
    private boolean needsPackaging;

    public CreateOrderRequest() {
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDeliveryType() {
        return deliveryType;
    }

    public void setDeliveryType(String deliveryType) {
        this.deliveryType = deliveryType;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public boolean isNeedsPackaging() {
        return needsPackaging;
    }

    public void setNeedsPackaging(boolean needsPackaging) {
        this.needsPackaging = needsPackaging;
    }

    public static class CartItemDto {
        private long productId;
        private int quantity;

        public CartItemDto() {
        }

        public long getProductId() {
            return productId;
        }

        public void setProductId(long productId) {
            this.productId = productId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}

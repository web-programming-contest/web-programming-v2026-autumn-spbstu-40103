package ru.spbstu.gadgethub.dto;

public class UserResponse {

    private long id;
    private String username;

    public UserResponse() {
    }

    public UserResponse(long id, String username) {
        this.id = id;
        this.username = username;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}

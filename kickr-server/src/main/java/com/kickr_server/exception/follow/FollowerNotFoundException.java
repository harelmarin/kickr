package com.kickr_server.exception.follow;

public class FollowerNotFoundException extends  RuntimeException{
    public FollowerNotFoundException(String message) {
        super(message);
    }
}

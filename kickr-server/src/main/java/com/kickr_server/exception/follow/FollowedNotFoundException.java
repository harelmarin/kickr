package com.kickr_server.exception.follow;

public class FollowedNotFoundException extends  RuntimeException{
    public FollowedNotFoundException(String message) {
        super(message);
    }
}

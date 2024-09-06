package com.lancers.jiratypething.model;

public class AuthenticationResponse {
    private String jwt;
    private String userType;

    public AuthenticationResponse(String jwt, String userType) {
        this.jwt = jwt;
        this.userType = userType;
    }

    public String getJwt() {
        return jwt;
    }

    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}
package picstory.backend.web.dto;

public record SignupRequest (
        String name,
        String email,
        String password,
        String passwordConfirm,
        String phone
        ){}

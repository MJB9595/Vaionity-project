package picstory.backend.controller;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import picstory.backend.service.LoginService;
import picstory.backend.web.dto.LoginRequest;
import picstory.backend.web.dto.MemberResponse;
import picstory.backend.web.dto.UpdateProfileRequest;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private  final LoginService loginService;
    @PostMapping("/login")
    public MemberResponse login(@RequestBody LoginRequest request, HttpSession session){
        return loginService.login(request,session);
    }

    @GetMapping("/me")
    public ResponseEntity<MemberResponse> memberResponse(HttpSession session) {
        return loginService.me(session)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
    @PatchMapping("/me")
    public MemberResponse updateMe(@RequestBody UpdateProfileRequest request, HttpSession session){
        return loginService.updateMe(session,request);
    }

    @PostMapping("/logout")
    public void logout(HttpSession session){
        loginService.logout(session);
    }
}
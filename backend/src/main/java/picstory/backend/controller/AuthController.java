package picstory.backend.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import picstory.backend.domain.Member;
import picstory.backend.service.KakaoAuthService;
import picstory.backend.service.LoginService;
import picstory.backend.web.dto.LoginRequest;
import picstory.backend.web.dto.MemberResponse;
import picstory.backend.web.dto.UpdateProfileRequest;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final LoginService loginService;

    // ✅ 카카오 로그인 추가
    private final KakaoAuthService kakaoAuthService;

    @Value("${kakao.client-id}")
    private String kakaoClientId;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${kakao.frontend-redirect}")
    private String frontendRedirect;

    // ──────────────────────────────
    // 기존 일반 로그인/로그아웃 (변경 없음)
    // ──────────────────────────────

    @PostMapping("/login")
    public MemberResponse login(@RequestBody LoginRequest request, HttpSession session) {
        return loginService.login(request, session);
    }

    @GetMapping("/me")
    public ResponseEntity<MemberResponse> memberResponse(HttpSession session) {
        try {
            MemberResponse response = loginService.me(session);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PatchMapping("/me")
    public MemberResponse updateMe(@RequestBody UpdateProfileRequest request, HttpSession session) {
        return loginService.updateMe(session, request);
    }

    @PostMapping("/logout")
    public void logout(HttpSession session) {
        loginService.logout(session);
    }

    // ──────────────────────────────
    // ✅ 카카오 OAuth2 로그인 (신규)
    // ──────────────────────────────

    /**
     * ① 카카오 인증 페이지로 리디렉션
     * GET /auth/kakao
     * → 프론트엔드 버튼 클릭 시 window.location.href 또는 직접 링크로 호출
     */
    @GetMapping("/kakao")
    public void kakaoLogin(HttpServletResponse response) throws IOException {
        String kakaoAuthUrl = "https://kauth.kakao.com/oauth/authorize"
                + "?client_id=" + kakaoClientId
                + "&redirect_uri=" + URLEncoder.encode(kakaoRedirectUri, StandardCharsets.UTF_8)
                + "&response_type=code";

        response.sendRedirect(kakaoAuthUrl);
    }

    /**
     * ② 카카오 인가 코드 콜백 처리
     * GET /auth/kakao/callback?code=xxx
     * → 카카오 서버가 직접 호출 (Redirect URI 등록 필요)
     */
    @GetMapping("/kakao/callback")
    public void kakaoCallback(
            @RequestParam String code,
            @RequestParam(required = false) String error,
            HttpSession session,
            HttpServletResponse response) throws IOException {

        // 사용자가 카카오 로그인 취소한 경우
        if (error != null) {
            response.sendRedirect(frontendRedirect.replace("/app", "/login") + "?error=kakao_cancelled");
            return;
        }

        try {
            // 1. 인가 코드 → 액세스 토큰
            String accessToken = kakaoAuthService.getAccessToken(code);

            // 2. 액세스 토큰 → 카카오 유저 정보
            Map<String, Object> userInfo = kakaoAuthService.getKakaoUserInfo(accessToken);

            // 3. 회원 find or create
            Member member = kakaoAuthService.findOrCreateMember(userInfo);

            // 4. 기존 세션 방식과 동일하게 세션에 memberId 저장
            session.setAttribute("LOGIN_MEMBER_ID", member.getId());

            // 5. 프론트엔드 /app 으로 리디렉션
            response.sendRedirect(frontendRedirect);

        } catch (Exception e) {
            // 실패 시 로그인 페이지로 리디렉션 + 에러 파라미터
            String loginUrl = frontendRedirect.replace("/app", "/login")
                    + "?error=" + URLEncoder.encode("카카오 로그인 처리 중 오류가 발생했습니다.", StandardCharsets.UTF_8);
            response.sendRedirect(loginUrl);
        }
    }
}
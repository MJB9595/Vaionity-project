package picstory.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import picstory.backend.domain.Member;
import picstory.backend.repository.MemberRepository;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class KakaoAuthService {

    @Value("${kakao.client-id}")
    private String clientId;

    @Value("${kakao.client-secret}")
    private String clientSecret;

    @Value("${kakao.redirect-uri}")
    private String redirectUri;

    private final MemberRepository memberRepository;
    private final RestTemplate restTemplate;

    /**
     * ① 인가 코드(code) → 카카오 액세스 토큰 교환
     */
    public String getAccessToken(String code) {
        String url = "https://kauth.kakao.com/oauth/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("client_secret", clientSecret);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new RuntimeException("카카오 토큰 발급 실패");
        }

        return (String) response.getBody().get("access_token");
    }

    /**
     * ② 액세스 토큰 → 카카오 사용자 정보 조회
     * 반환 구조:
     * {
     *   "id": 123456,
     *   "kakao_account": {
     *     "email": "user@kakao.com",
     *     "profile": { "nickname": "홍길동" }
     *   }
     * }
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getKakaoUserInfo(String accessToken) {
        String url = "https://kapi.kakao.com/v2/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, request, Map.class);

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new RuntimeException("카카오 사용자 정보 조회 실패");
        }

        return response.getBody();
    }

    /**
     * ③ 카카오 사용자 정보로 회원 find or create
     *  - kakaoId로 기존 회원 조회
     *  - 없으면 이메일로 기존 회원 조회 → kakaoId 연동
     *  - 이메일도 없으면 신규 회원 생성
     */
    @Transactional
    @SuppressWarnings("unchecked")
    public Member findOrCreateMember(Map<String, Object> userInfo) {
        String kakaoId = String.valueOf(userInfo.get("id"));

        Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");

        String email = null;
        String nickname = "카카오사용자";

        if (kakaoAccount != null) {
            email = (String) kakaoAccount.get("email");

            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            if (profile != null) {
                String profileNickname = (String) profile.get("nickname");
                if (profileNickname != null && !profileNickname.isBlank()) {
                    nickname = profileNickname;
                }
            }
        }

        // 1. kakaoId로 기존 회원 조회
        final String finalEmail = email;
        final String finalNickname = nickname;
        return memberRepository.findByKakaoId(kakaoId)
                .orElseGet(() -> {
                    // 2. 이메일이 있으면 이메일로 기존 회원 조회 → kakaoId 연동
                    if (finalEmail != null) {
                        return memberRepository.findByEmail(finalEmail)
                                .map(existingMember -> {
                                    existingMember.updateKakaoId(kakaoId);
                                    return existingMember;
                                })
                                .orElseGet(() ->
                                        // 3. 신규 회원 생성
                                        memberRepository.save(new Member(finalNickname, finalEmail, kakaoId, true))
                                );
                    }
                    // 이메일 없는 경우 (동의 안 한 경우) → 임시 이메일로 생성
                    String tempEmail = "kakao_" + kakaoId + "@kakao.local";
                    return memberRepository.save(new Member(finalNickname, tempEmail, kakaoId, true));
                });
    }
}
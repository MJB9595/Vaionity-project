package picstory.backend.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import picstory.backend.domain.Member;
import picstory.backend.repository.MemberRepository;
import picstory.backend.web.dto.LoginRequest;
import picstory.backend.web.dto.MemberResponse;
import picstory.backend.web.dto.UpdateProfileRequest;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoginService {
    private final MemberRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final MemberService memberService;

    private static final String LOGIN_MEMBER_ID = "LOGIN_MEMBER_ID";

    @Transactional
    public MemberResponse login(LoginRequest request, HttpSession session) {
        Member member = repository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비번이 올바르지 않습니다."));


        if (!passwordEncoder.matches(request.password(), member.getPasswordHash())) {
            throw new IllegalArgumentException("이메일 또는 비번이 올바르지 않습니다.");
        }

        session.setAttribute(LOGIN_MEMBER_ID, member.getId());

        return MemberResponse.from(member);
    }

    /**
     * 비로그인·세션 만료·DB에 회원 없음(유실된 세션)은 empty — 호출부에서 401 등으로 매핑.
     */
    public Optional<MemberResponse> me(HttpSession session) {
        Long memberId = readMemberId(session);
        if (memberId == null) {
            return Optional.empty();
        }
        return repository.findById(memberId).map(MemberResponse::from);
    }

    private static Long readMemberId(HttpSession session) {
        Object raw = session.getAttribute(LOGIN_MEMBER_ID);
        if (raw == null) {
            return null;
        }
        if (raw instanceof Number n) {
            return n.longValue();
        }
        return null;
    }

    @Transactional
    public MemberResponse updateMe(HttpSession session, UpdateProfileRequest request){
        Long memberId = readMemberId(session);
        if (memberId == null) {
            throw new IllegalArgumentException("로그인된 사용자가 없습니다.");
        }
        return memberService.updateProfile(memberId,request);
    }

    @Transactional
    public void logout(HttpSession session) {
        session.invalidate();
    }
}

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

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LoginService {
    private final MemberRepository repository;
    private final PasswordEncoder passwordEncoder;

    private static final String LOGIN_MEMBER_ID = "LOGIN_MEMBER_ID";

    @Transactional
    public MemberResponse login(LoginRequest request, HttpSession session){
        Member member = repository.findByEmail(request.email())
                .orElseThrow(()->new IllegalArgumentException("이메일 또는 비번이 올바르지 않습니다."));


        if(!passwordEncoder.matches(request.password(),member.getPasswordHash())){
            throw  new IllegalArgumentException("이메일 또는 비번이 올바르지 않습니다.");
        }

        session.setAttribute(LOGIN_MEMBER_ID,member.getId());

        return MemberResponse.from(member);
    }

    public MemberResponse me(HttpSession session){
        Long memberId=(Long) session.getAttribute(LOGIN_MEMBER_ID);

        if(memberId==null){
            throw  new IllegalArgumentException("로그인된 사용자가 없습니다.");
        }
        Member member = repository.findById(memberId)
                .orElseThrow(()->new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        return MemberResponse.from(member);
    }

    @Transactional
    public void logout(HttpSession session){
        session.invalidate();
    }
}

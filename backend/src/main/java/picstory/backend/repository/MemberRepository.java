package picstory.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import picstory.backend.domain.Member;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByEmail(String email);

    Optional<Member> findByEmail(String email);

    boolean existsByPhoneAndIdNot(String phone, Long id);

    // ✅ 카카오 로그인 추가 — kakaoId로 회원 조회
    Optional<Member> findByKakaoId(String kakaoId);
}
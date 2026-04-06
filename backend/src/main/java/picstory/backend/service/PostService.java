package picstory.backend.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import picstory.backend.domain.Member;
import picstory.backend.domain.Post;
import picstory.backend.repository.MemberRepository;
import picstory.backend.repository.PostRepository;
import picstory.backend.web.dto.CreatePostRequest;
import picstory.backend.web.dto.PostResponse;
import picstory.backend.web.dto.UpdatePostRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostService {
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    private static final String LOGIN_MEMBER_ID = "LOGIN_MEMBER_ID";


    public List<PostResponse> findMyPosts(HttpSession session) {
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);

        if (memberId == null) {
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }

        return postRepository.findByMember_IdOrderByCreatedAtDesc(memberId)
                .stream()
                .map(PostResponse::from)
                .toList();
    }

    @Transactional
    public PostResponse create(CreatePostRequest request, HttpSession session) {
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);

        if (memberId == null) {
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        Post post = new Post(
                request.category(),
                request.title(),
                request.content(),
                request.imageUrl(),
                member
        );

        Post savePost = postRepository.save(post);

        return PostResponse.from(savePost);
    }

    @Transactional
    public PostResponse findById(Long id, HttpSession session){
        if(id==null){
            throw  new IllegalArgumentException("게시글 id를 확인해 주세요");
        }

        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);

        if(memberId==null){
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }
        Post post = postRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("게시글을 찾을 수 없습니다."));


        if(!post.getMember().getId().equals(memberId)){
            throw new IllegalArgumentException("본인이 작성한 글만 조회할 수 있습니다.");
        }

        return  PostResponse.from(post);
    }

    @Transactional
    public PostResponse update(Long id, UpdatePostRequest request, HttpSession session) {
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);

        if (memberId == null) {
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }
        Post post = postRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("게시글이 존재하지 않습니다."));

        if(!post.getMember().getId().equals(memberId)){
            throw new IllegalArgumentException("본인이 작성한 글만 수정 가능");
        }

        post.update(request.category(), request.title(), request.content(), request.imageUrl());

        return PostResponse.from(post);


    }


    @Transactional
    public void delete(Long id,HttpSession session){
        Long memberId = (Long) session.getAttribute(LOGIN_MEMBER_ID);

        if (memberId == null) {
            throw new IllegalArgumentException("로그인 후 이용해 주세요");
        }
        Post post = postRepository.findById(id)
                .orElseThrow(()->new IllegalArgumentException("게시글이 존재하지 않습니다."));

        if(!post.getMember().getId().equals(memberId)){
            throw new IllegalArgumentException("본인이 작성한 글만 삭제 가능");
        }
        postRepository.delete(post);
    }
}

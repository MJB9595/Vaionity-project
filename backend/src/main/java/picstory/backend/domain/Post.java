package picstory.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostCategory category;


    @Column(nullable = false, length = 100)
    private String title;


    @Column(nullable = false, length = 2000)
    private String content;

    @Column(length = 500)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Member member;


    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public Post(PostCategory category, String title, String content, String imageUrl, Member member) {
        this.category = category;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.member = member;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void update(PostCategory category, String title, String content, String imageUrl) {
        this.category = category;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.updatedAt = LocalDateTime.now();
    }

}




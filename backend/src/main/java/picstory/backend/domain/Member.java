package picstory.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "members")
public class Member {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false,length = 50)
    private String name;


    @Column(nullable = false,unique = true,length = 100)
    private String email;

    @Column(nullable = false,length = 200)
    private String passwordHash;

    @Column(unique = true,length = 30)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,length = 20)
    private MemberStatus status;

    @Column(nullable = false)
    private  boolean emailVerified;


    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate(){
        this.createdAt = LocalDateTime.now();
        this.updatedAt=this.createdAt;
        if(this.status==null) this.status=MemberStatus.ACTIVE;
    }
    @PreUpdate
    public void  onUpdate(){
        this.updatedAt=LocalDateTime.now();
    }





    public Member(String name, String email,String passwordHash, String phone){
        this.name=name;
        this.email=email;
        this.passwordHash=passwordHash;
        this.phone=phone;
        this.status=MemberStatus.ACTIVE;
        this.emailVerified=false;
    }

    public void changeStatus(MemberStatus status){
        this.status=status;
    }
}

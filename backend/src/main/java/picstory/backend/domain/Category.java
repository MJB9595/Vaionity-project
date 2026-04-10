package picstory.backend.domain;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String value;   // ex) FLAGSHIP_Z

    @Column(nullable = false, length = 100)
    private String label;   // ex) 플래그십 시리즈 Z

    public Category(String value, String label) {
        this.value = value;
        this.label = label;
    }
}
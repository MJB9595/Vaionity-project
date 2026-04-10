package picstory.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import picstory.backend.domain.Category;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByValue(String value);
    boolean existsByValue(String value);
}
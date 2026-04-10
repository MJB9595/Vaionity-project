package picstory.backend.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import picstory.backend.domain.Category;
import picstory.backend.repository.CategoryRepository;
import picstory.backend.web.dto.CategoryResponse;
import picstory.backend.web.dto.CreateCategoryRequest;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // 앱 시작 시 기본 카테고리 자동 삽입
    @PostConstruct
    @Transactional
    public void initDefaultCategories() {
        List<Object[]> defaults = List.of(
                new Object[]{"FLAGSHIP_Z", "플래그십 시리즈 Z"},
                new Object[]{"SLIM_LIGHT", "얇음과 가벼움의 극한"},
                new Object[]{"UMPC",       "UMPC"},
                new Object[]{"ETC",        "ETC"}
        );
        for (Object[] entry : defaults) {
            String value = (String) entry[0];
            String label = (String) entry[1];
            if (!categoryRepository.existsByValue(value)) {
                categoryRepository.save(new Category(value, label));
            }
        }
    }

    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @Transactional
    public CategoryResponse create(CreateCategoryRequest request) {
        if (request.value() == null || request.value().isBlank())
            throw new IllegalArgumentException("카테고리 value는 필수입니다.");
        if (request.label() == null || request.label().isBlank())
            throw new IllegalArgumentException("카테고리 label은 필수입니다.");
        if (categoryRepository.existsByValue(request.value()))
            throw new IllegalArgumentException("이미 존재하는 카테고리입니다: " + request.value());

        String safeValue = request.value().trim().toUpperCase().replace(" ", "_");
        return CategoryResponse.from(categoryRepository.save(new Category(safeValue, request.label())));
    }

    @Transactional
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
        categoryRepository.delete(category);
    }
}
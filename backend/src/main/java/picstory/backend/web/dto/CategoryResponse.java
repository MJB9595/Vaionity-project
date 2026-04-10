package picstory.backend.web.dto;

import picstory.backend.domain.Category;

public record CategoryResponse(Long id, String value, String label) {
    public static CategoryResponse from(Category category) {
        return new CategoryResponse(category.getId(), category.getValue(), category.getLabel());
    }
}
package picstory.backend.web.dto;

import picstory.backend.domain.PostCategory;

import java.util.List;

public record UpdatePostRequest(
        PostCategory category,
        String title,
        String content,
        String imageUrl,
        List<String> tags
) {
}

package picstory.backend.web.dto;

import java.util.List;

public record CreatePostRequest(
        String category,
        String title,
        String content,
        String imageUrl,
        List<String> tags
) {}
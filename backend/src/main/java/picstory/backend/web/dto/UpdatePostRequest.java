package picstory.backend.web.dto;

import java.util.List;

public record UpdatePostRequest(
        String category,
        String title,
        String content,
        String imageUrl,
        List<String> tags
) {}
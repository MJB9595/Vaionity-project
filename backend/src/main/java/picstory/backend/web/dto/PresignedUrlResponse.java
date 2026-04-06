package picstory.backend.web.dto;

public record PresignedUrlResponse(
        String uploadUrl, // 프론트엔드가 파일 업로드할 때 쓸 URL (PUT)
        String fileUrl,   // 업로드 완료 후 실제 이미지에 접근할 수 있는 S3 퍼블릭 URL (https://...)
        String fileKey    // S3 내부 저장 경로 (uploads/...)
) {
}
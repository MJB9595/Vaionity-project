package picstory.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import picstory.backend.service.S3Service;
import picstory.backend.web.dto.PresignedUrlRequest;
import picstory.backend.web.dto.PresignedUrlResponse;

@RestController
@RequiredArgsConstructor
@RequestMapping("/files")
public class S3Controller {
    private final S3Service s3Service;

    private  final ObjectMapper objectMapper;


    @PostMapping(value = "/presigned-url", consumes = MediaType.APPLICATION_JSON_VALUE)
    public PresignedUrlResponse createPresignedUrl(@RequestBody PresignedUrlRequest request){
        return s3Service.createPresignUrl(
                request.fileName(),
                request.contentType()
        );
    }
}























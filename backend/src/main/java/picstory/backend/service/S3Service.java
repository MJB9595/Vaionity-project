package picstory.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import picstory.backend.web.dto.PresignedUrlResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Service
public class S3Service {

    private final S3Presigner s3Presigner;

    @Value("${cloud.aws.s3.bucket:}")
    private String bucket;

    @Value("${cloud.aws.region:ap-northeast-2}")
    private String region;

    public S3Service(S3Presigner s3Presigner){
        this.s3Presigner = s3Presigner;
    }

    public PresignedUrlResponse createPresignUrl(String fileName,String contentType){
        if(bucket==null||bucket.isBlank()){
            throw  new IllegalArgumentException("S3 bucket is not configured.");
        }

        String safeFileName = (fileName==null || fileName.isBlank())
                ? "file"
                :fileName.replaceAll("\\s+","_");

        String safeContentType =(contentType==null ||contentType.isBlank())
                ?"application/octet-stream"
                :contentType;


        String key = "uploads/"+ UUID.randomUUID()+"_"+safeFileName;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(safeContentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(putObjectRequest)
                .build();

        PresignedPutObjectRequest presignedRequest=
                s3Presigner.presignPutObject(presignRequest);

        String fileUrl = "https://"+bucket+".s3."+region+".amazonaws.com/"+key;

        return new PresignedUrlResponse(
                presignedRequest.url().toString(), // uploadUrl
                fileUrl,                           // fileUrl (https://...)
                key                                // fileKey (uploads/...)
        );
    }
}



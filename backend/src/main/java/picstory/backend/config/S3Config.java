package picstory.backend.config; // 설정 클래스들이 위치하는 패키지

import org.springframework.beans.factory.annotation.Value; // application.yml 또는 환경변수 값을 주입받기 위한 어노테이션
import org.springframework.context.annotation.Bean; // 메서드의 반환 객체를 Spring Bean으로 등록하기 위한 어노테이션
import org.springframework.context.annotation.Configuration; // 해당 클래스가 설정 클래스임을 나타냄
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials; // accessKey + secretKey 기반 인증 객체
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider; // 기본 AWS 인증 체인 (환경변수, IAM Role 등)
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider; // 고정된 accessKey/secretKey 사용 시
import software.amazon.awssdk.regions.Region; // AWS 리전 설정
import software.amazon.awssdk.services.s3.presigner.S3Presigner; // presigned URL 생성을 위한 객체

@Configuration // Spring 설정 클래스로 등록 (Bean 정의 가능)
public class S3Config {

    @Value("${cloud.aws.credentials.access-key:}") // 설정값에서 access key 주입 (없으면 빈 문자열)
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key:}") // 설정값에서 secret key 주입 (없으면 빈 문자열)
    private String secretKey;

    @Value("${cloud.aws.region:ap-northeast-2}") // AWS 리전 주입 (기본값: ap-northeast-2)
    private String region;


    @Bean // 이 메서드의 반환 객체를 Spring Bean으로 등록 (다른 곳에서 주입 가능)
    public S3Presigner s3Presigner(){
        S3Presigner.Builder builder = S3Presigner.builder() // S3Presigner 빌더 생성
                .region(Region.of(region)); // 사용할 AWS 리전 설정

        if (!accessKey.isBlank() && !secretKey.isBlank()) { // accessKey, secretKey 둘 다 값이 있으면
            AwsBasicCredentials credentials =
                    AwsBasicCredentials.create(accessKey, secretKey); // 키 기반 인증 객체 생성
            builder.credentialsProvider(StaticCredentialsProvider.create(credentials)); // 고정 키 방식 인증 설정
        } else {
            builder.credentialsProvider(DefaultCredentialsProvider.create()); // 기본 인증 체인 사용 (환경변수, IAM Role 등 자동 탐색)
        }

        return builder.build(); // 설정된 builder로 S3Presigner 객체 생성 후 반환
    }

}
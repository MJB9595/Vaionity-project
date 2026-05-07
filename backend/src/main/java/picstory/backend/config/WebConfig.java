package picstory.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class WebConfig {

    // ✅ KakaoAuthService에서 카카오 API 호출에 사용하는 RestTemplate Bean 등록
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
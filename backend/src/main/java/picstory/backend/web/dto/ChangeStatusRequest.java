package picstory.backend.web.dto;

import picstory.backend.domain.MemberStatus;

public record ChangeStatusRequest(
        MemberStatus status
) {
}

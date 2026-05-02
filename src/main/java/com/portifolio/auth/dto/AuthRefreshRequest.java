package com.portifolio.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record AuthRefreshRequest(
		@NotBlank(message = "Refresh token e obrigatorio")
		String refreshToken
) {
}

package com.portifolio.auth.dto;

public record AuthLoginResponse(
		String accessToken,
		String refreshToken,
		String tipo,
		String email,
		Boolean precisaAlterarCredenciais
) {
}

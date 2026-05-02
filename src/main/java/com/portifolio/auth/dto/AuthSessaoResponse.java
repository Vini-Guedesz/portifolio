package com.portifolio.auth.dto;

public record AuthSessaoResponse(
		String email,
		Boolean precisaAlterarCredenciais
) {
}

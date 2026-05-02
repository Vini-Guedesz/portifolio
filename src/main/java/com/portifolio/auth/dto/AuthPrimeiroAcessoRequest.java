package com.portifolio.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthPrimeiroAcessoRequest(
		@NotBlank(message = "Novo email e obrigatorio")
		@Email(message = "Novo email invalido")
		@Size(max = 160, message = "Novo email deve ter no maximo 160 caracteres")
		String novoEmail,

		@NotBlank(message = "Senha atual e obrigatoria")
		@Size(max = 120, message = "Senha atual deve ter no maximo 120 caracteres")
		String senhaAtual,

		@NotBlank(message = "Nova senha e obrigatoria")
		@Size(min = 8, max = 120, message = "Nova senha deve ter entre 8 e 120 caracteres")
		String novaSenha
) {
}

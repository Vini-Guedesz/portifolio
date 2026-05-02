package com.portifolio.perfil.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PerfilRequest(
		@NotBlank(message = "Nome e obrigatorio")
		@Size(max = 120, message = "Nome deve ter no maximo 120 caracteres")
		String nome,

		@NotBlank(message = "Username e obrigatorio")
		@Size(min = 3, max = 60, message = "Username deve ter entre 3 e 60 caracteres")
		@Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$", message = "Username deve conter apenas letras minusculas, numeros e hifen")
		String username,

		@NotBlank(message = "Cargo e obrigatorio")
		@Size(max = 120, message = "Cargo deve ter no maximo 120 caracteres")
		String cargo,

		@NotBlank(message = "Resumo e obrigatorio")
		@Size(max = 2000, message = "Resumo deve ter no maximo 2000 caracteres")
		String resumo,

		@Size(max = 500, message = "Foto deve ter no maximo 500 caracteres")
		String fotoUrl,

		@NotBlank(message = "Disponibilidade e obrigatoria")
		@Size(max = 160, message = "Disponibilidade deve ter no maximo 160 caracteres")
		String disponibilidade,

		@Size(max = 160, message = "Email de contato deve ter no maximo 160 caracteres")
		String emailContato,

		@Size(max = 500, message = "LinkedIn deve ter no maximo 500 caracteres")
		String linkedinUrl,

		@Size(max = 500, message = "GitHub deve ter no maximo 500 caracteres")
		String githubUrl,

		@Size(max = 500, message = "X deve ter no maximo 500 caracteres")
		String xUrl,

		@Size(max = 500, message = "TikTok deve ter no maximo 500 caracteres")
		String tiktokUrl,

		@Size(max = 600, message = "Palavras-chave devem ter no maximo 600 caracteres")
		String palavrasChave
) {
}

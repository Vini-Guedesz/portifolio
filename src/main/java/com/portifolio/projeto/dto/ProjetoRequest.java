package com.portifolio.projeto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProjetoRequest(
		@NotBlank(message = "Nome e obrigatorio")
		@Size(max = 160, message = "Nome deve ter no maximo 160 caracteres")
		String nome,

		@NotBlank(message = "Descricao e obrigatoria")
		@Size(max = 2000, message = "Descricao deve ter no maximo 2000 caracteres")
		String descricao,

		@NotBlank(message = "Tecnologias sao obrigatorias")
		@Size(max = 500, message = "Tecnologias devem ter no maximo 500 caracteres")
		String tecnologias,

		@NotBlank(message = "Link do GitHub e obrigatorio")
		@Size(max = 500, message = "Link do GitHub deve ter no maximo 500 caracteres")
		String githubUrl,

		@Size(max = 500, message = "Link de deploy deve ter no maximo 500 caracteres")
		String deployUrl,

		@NotNull(message = "Destaque e obrigatorio")
		Boolean destaque
) {
}

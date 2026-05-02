package com.portifolio.certificacao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CertificacaoRequest(
		@NotBlank(message = "Nome e obrigatorio")
		@Size(max = 180, message = "Nome deve ter no maximo 180 caracteres")
		String nome,

		@NotBlank(message = "Emissor e obrigatorio")
		@Size(max = 160, message = "Emissor deve ter no maximo 160 caracteres")
		String emissor,

		LocalDate dataEmissao,

		@Size(max = 500, message = "Link deve ter no maximo 500 caracteres")
		String link
) {
}

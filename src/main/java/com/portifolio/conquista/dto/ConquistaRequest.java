package com.portifolio.conquista.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ConquistaRequest(
		@NotBlank(message = "Titulo e obrigatorio")
		@Size(max = 160, message = "Titulo deve ter no maximo 160 caracteres")
		String titulo,

		@NotBlank(message = "Descricao e obrigatoria")
		@Size(max = 2000, message = "Descricao deve ter no maximo 2000 caracteres")
		String descricao,

		LocalDate data
) {
}

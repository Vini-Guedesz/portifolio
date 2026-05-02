package com.portifolio.experiencia.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ExperienciaRequest(
		@NotBlank(message = "Empresa e obrigatoria")
		@Size(max = 160, message = "Empresa deve ter no maximo 160 caracteres")
		String empresa,

		@NotBlank(message = "Cargo e obrigatorio")
		@Size(max = 160, message = "Cargo deve ter no maximo 160 caracteres")
		String cargo,

		@NotBlank(message = "Descricao e obrigatoria")
		@Size(max = 2000, message = "Descricao deve ter no maximo 2000 caracteres")
		String descricao,

		@NotNull(message = "Data inicio e obrigatoria")
		LocalDate dataInicio,

		LocalDate dataFim,

		@NotNull(message = "Atual e obrigatorio")
		Boolean atual
) {
}

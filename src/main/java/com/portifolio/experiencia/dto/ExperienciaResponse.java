package com.portifolio.experiencia.dto;

import com.portifolio.experiencia.Experiencia;

import java.time.LocalDate;

public record ExperienciaResponse(
		Long id,
		String empresa,
		String cargo,
		String descricao,
		LocalDate dataInicio,
		LocalDate dataFim,
		Boolean atual
) {
	public static ExperienciaResponse de(Experiencia experiencia) {
		return new ExperienciaResponse(
				experiencia.getId(),
				experiencia.getEmpresa(),
				experiencia.getCargo(),
				experiencia.getDescricao(),
				experiencia.getDataInicio(),
				experiencia.getDataFim(),
				experiencia.getAtual()
		);
	}
}

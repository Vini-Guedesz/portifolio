package com.portifolio.conquista.dto;

import com.portifolio.conquista.Conquista;

import java.time.LocalDate;

public record ConquistaResponse(
		Long id,
		String titulo,
		String descricao,
		LocalDate data
) {
	public static ConquistaResponse de(Conquista conquista) {
		return new ConquistaResponse(
				conquista.getId(),
				conquista.getTitulo(),
				conquista.getDescricao(),
				conquista.getData()
		);
	}
}

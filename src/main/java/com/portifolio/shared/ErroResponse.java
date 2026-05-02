package com.portifolio.shared;

import java.time.Instant;
import java.util.Map;

public record ErroResponse(
		Instant dataHora,
		int status,
		String erro,
		String mensagem,
		String caminho,
		Map<String, String> campos
) {
	public static ErroResponse simples(int status, String erro, String mensagem, String caminho) {
		return new ErroResponse(Instant.now(), status, erro, mensagem, caminho, Map.of());
	}

	public static ErroResponse comCampos(int status, String erro, String mensagem, String caminho, Map<String, String> campos) {
		return new ErroResponse(Instant.now(), status, erro, mensagem, caminho, campos);
	}
}

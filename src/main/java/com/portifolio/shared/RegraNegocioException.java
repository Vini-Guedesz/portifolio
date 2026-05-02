package com.portifolio.shared;

import java.util.Map;

public class RegraNegocioException extends RuntimeException {

	private final Map<String, String> campos;

	public RegraNegocioException(String mensagem) {
		super(mensagem);
		this.campos = Map.of();
	}

	public RegraNegocioException(String campo, String mensagem) {
		super(mensagem);
		this.campos = Map.of(campo, mensagem);
	}

	public Map<String, String> getCampos() {
		return campos;
	}
}

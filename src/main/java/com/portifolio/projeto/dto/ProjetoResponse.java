package com.portifolio.projeto.dto;

import com.portifolio.projeto.Projeto;

public record ProjetoResponse(
		Long id,
		String nome,
		String descricao,
		String tecnologias,
		String githubUrl,
		String deployUrl,
		Boolean destaque
) {
	public static ProjetoResponse de(Projeto projeto) {
		return new ProjetoResponse(
				projeto.getId(),
				projeto.getNome(),
				projeto.getDescricao(),
				projeto.getTecnologias(),
				projeto.getGithubUrl(),
				projeto.getDeployUrl(),
				projeto.getDestaque()
		);
	}
}

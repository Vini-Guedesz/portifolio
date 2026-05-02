package com.portifolio.perfil.dto;

import com.portifolio.perfil.Perfil;

public record PerfilResponse(
		Long id,
		String nome,
		String username,
		String cargo,
		String resumo,
		String fotoUrl,
		String disponibilidade,
		String emailContato,
		String linkedinUrl,
		String githubUrl,
		String xUrl,
		String tiktokUrl,
		String palavrasChave
) {
	public static PerfilResponse de(Perfil perfil) {
		return new PerfilResponse(
				perfil.getId(),
				perfil.getNome(),
				perfil.getUsername(),
				perfil.getCargo(),
				perfil.getResumo(),
				perfil.getFotoUrl(),
				perfil.getDisponibilidade(),
				perfil.getEmailContato(),
				perfil.getLinkedinUrl(),
				perfil.getGithubUrl(),
				perfil.getXUrl(),
				perfil.getTiktokUrl(),
				perfil.getPalavrasChave()
		);
	}
}

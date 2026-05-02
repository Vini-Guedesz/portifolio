package com.portifolio.certificacao.dto;

import com.portifolio.certificacao.Certificacao;

import java.time.LocalDate;

public record CertificacaoResponse(
		Long id,
		String nome,
		String emissor,
		LocalDate dataEmissao,
		String link
) {
	public static CertificacaoResponse de(Certificacao certificacao) {
		return new CertificacaoResponse(
				certificacao.getId(),
				certificacao.getNome(),
				certificacao.getEmissor(),
				certificacao.getDataEmissao(),
				certificacao.getLink()
		);
	}
}

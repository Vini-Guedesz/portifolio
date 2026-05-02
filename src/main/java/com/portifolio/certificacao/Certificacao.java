package com.portifolio.certificacao;

import com.portifolio.shared.EntidadeAuditavel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "certificacoes")
public class Certificacao extends EntidadeAuditavel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 180)
	private String nome;

	@Column(nullable = false, length = 160)
	private String emissor;

	@Column(name = "data_emissao")
	private LocalDate dataEmissao;

	@Column(length = 500)
	private String link;

	protected Certificacao() {
	}

	public Certificacao(String nome, String emissor, LocalDate dataEmissao, String link) {
		atualizar(nome, emissor, dataEmissao, link);
	}

	public Long getId() {
		return id;
	}

	public String getNome() {
		return nome;
	}

	public String getEmissor() {
		return emissor;
	}

	public LocalDate getDataEmissao() {
		return dataEmissao;
	}

	public String getLink() {
		return link;
	}

	public void atualizar(String nome, String emissor, LocalDate dataEmissao, String link) {
		this.nome = nome;
		this.emissor = emissor;
		this.dataEmissao = dataEmissao;
		this.link = link;
	}
}

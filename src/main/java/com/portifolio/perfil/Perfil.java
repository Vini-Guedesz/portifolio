package com.portifolio.perfil;

import com.portifolio.shared.EntidadeAuditavel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "perfis")
public class Perfil extends EntidadeAuditavel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 120)
	private String nome;

	@Column(nullable = false, length = 60, unique = true)
	private String username;

	@Column(nullable = false, length = 120)
	private String cargo;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String resumo;

	@Column(name = "foto_url", length = 500)
	private String fotoUrl;

	@Column(nullable = false, length = 160)
	private String disponibilidade;

	@Column(name = "email_contato", length = 160)
	private String emailContato;

	@Column(name = "linkedin_url", length = 500)
	private String linkedinUrl;

	@Column(name = "github_url", length = 500)
	private String githubUrl;

	@Column(name = "x_url", length = 500)
	private String xUrl;

	@Column(name = "tiktok_url", length = 500)
	private String tiktokUrl;

	@Column(name = "palavras_chave", length = 600)
	private String palavrasChave;

	protected Perfil() {
	}

	public Perfil(String nome, String username, String cargo, String resumo) {
		atualizar(nome, username, cargo, resumo, null, "Disponivel para oportunidades", null, null, null, null, null, null);
	}

	public Long getId() {
		return id;
	}

	public String getNome() {
		return nome;
	}

	public String getUsername() {
		return username;
	}

	public String getCargo() {
		return cargo;
	}

	public String getResumo() {
		return resumo;
	}

	public String getFotoUrl() {
		return fotoUrl;
	}

	public String getDisponibilidade() {
		return disponibilidade;
	}

	public String getEmailContato() {
		return emailContato;
	}

	public String getLinkedinUrl() {
		return linkedinUrl;
	}

	public String getGithubUrl() {
		return githubUrl;
	}

	public String getXUrl() {
		return xUrl;
	}

	public String getTiktokUrl() {
		return tiktokUrl;
	}

	public String getPalavrasChave() {
		return palavrasChave;
	}

	public void atualizar(
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
		this.nome = nome;
		this.username = username;
		this.cargo = cargo;
		this.resumo = resumo;
		this.fotoUrl = normalizarTexto(fotoUrl);
		this.disponibilidade = disponibilidade;
		this.emailContato = normalizarTexto(emailContato);
		this.linkedinUrl = normalizarTexto(linkedinUrl);
		this.githubUrl = normalizarTexto(githubUrl);
		this.xUrl = normalizarTexto(xUrl);
		this.tiktokUrl = normalizarTexto(tiktokUrl);
		this.palavrasChave = normalizarTexto(palavrasChave);
	}

	public void atualizarFotoUrl(String fotoUrl) {
		this.fotoUrl = normalizarTexto(fotoUrl);
	}

	private String normalizarTexto(String valor) {
		return valor == null || valor.isBlank() ? null : valor.trim();
	}
}

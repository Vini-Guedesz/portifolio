package com.portifolio.projeto;

import com.portifolio.shared.EntidadeAuditavel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "projetos")
public class Projeto extends EntidadeAuditavel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 160)
	private String nome;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String descricao;

	@Column(nullable = false, length = 500)
	private String tecnologias;

	@Column(name = "github_url", nullable = false, length = 500)
	private String githubUrl;

	@Column(name = "deploy_url", length = 500)
	private String deployUrl;

	@Column(nullable = false)
	private Boolean destaque;

	protected Projeto() {
	}

	public Projeto(String nome, String descricao, String tecnologias, String githubUrl, String deployUrl, Boolean destaque) {
		atualizar(nome, descricao, tecnologias, githubUrl, deployUrl, destaque);
	}

	public Long getId() {
		return id;
	}

	public String getNome() {
		return nome;
	}

	public String getDescricao() {
		return descricao;
	}

	public String getTecnologias() {
		return tecnologias;
	}

	public String getGithubUrl() {
		return githubUrl;
	}

	public String getDeployUrl() {
		return deployUrl;
	}

	public Boolean getDestaque() {
		return destaque;
	}

	public void atualizar(String nome, String descricao, String tecnologias, String githubUrl, String deployUrl, Boolean destaque) {
		this.nome = nome;
		this.descricao = descricao;
		this.tecnologias = tecnologias;
		this.githubUrl = githubUrl;
		this.deployUrl = deployUrl;
		this.destaque = destaque;
	}
}

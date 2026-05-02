package com.portifolio.experiencia;

import com.portifolio.shared.EntidadeAuditavel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "experiencias")
public class Experiencia extends EntidadeAuditavel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 160)
	private String empresa;

	@Column(nullable = false, length = 160)
	private String cargo;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String descricao;

	@Column(name = "data_inicio", nullable = false)
	private LocalDate dataInicio;

	@Column(name = "data_fim")
	private LocalDate dataFim;

	@Column(nullable = false)
	private Boolean atual;

	protected Experiencia() {
	}

	public Experiencia(String empresa, String cargo, String descricao, LocalDate dataInicio, LocalDate dataFim, Boolean atual) {
		atualizar(empresa, cargo, descricao, dataInicio, dataFim, atual);
	}

	public Long getId() {
		return id;
	}

	public String getEmpresa() {
		return empresa;
	}

	public String getCargo() {
		return cargo;
	}

	public String getDescricao() {
		return descricao;
	}

	public LocalDate getDataInicio() {
		return dataInicio;
	}

	public LocalDate getDataFim() {
		return dataFim;
	}

	public Boolean getAtual() {
		return atual;
	}

	public void atualizar(String empresa, String cargo, String descricao, LocalDate dataInicio, LocalDate dataFim, Boolean atual) {
		this.empresa = empresa;
		this.cargo = cargo;
		this.descricao = descricao;
		this.dataInicio = dataInicio;
		this.dataFim = Boolean.TRUE.equals(atual) ? null : dataFim;
		this.atual = atual;
	}
}

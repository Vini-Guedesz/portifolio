package com.portifolio.conquista;

import com.portifolio.shared.EntidadeAuditavel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "conquistas")
public class Conquista extends EntidadeAuditavel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 160)
	private String titulo;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String descricao;

	@Column(name = "data")
	private LocalDate data;

	protected Conquista() {
	}

	public Conquista(String titulo, String descricao, LocalDate data) {
		atualizar(titulo, descricao, data);
	}

	public Long getId() {
		return id;
	}

	public String getTitulo() {
		return titulo;
	}

	public String getDescricao() {
		return descricao;
	}

	public LocalDate getData() {
		return data;
	}

	public void atualizar(String titulo, String descricao, LocalDate data) {
		this.titulo = titulo;
		this.descricao = descricao;
		this.data = data;
	}
}

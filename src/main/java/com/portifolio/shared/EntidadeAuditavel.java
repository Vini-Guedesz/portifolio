package com.portifolio.shared;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class EntidadeAuditavel {

	@CreatedDate
	@Column(name = "criado_em", nullable = false, updatable = false)
	private LocalDateTime criadoEm;

	@LastModifiedDate
	@Column(name = "atualizado_em", nullable = false)
	private LocalDateTime atualizadoEm;

	@CreatedBy
	@Column(name = "criado_por", nullable = false, updatable = false, length = 160)
	private String criadoPor;

	@LastModifiedBy
	@Column(name = "atualizado_por", nullable = false, length = 160)
	private String atualizadoPor;

	public LocalDateTime getCriadoEm() {
		return criadoEm;
	}

	public LocalDateTime getAtualizadoEm() {
		return atualizadoEm;
	}

	public String getCriadoPor() {
		return criadoPor;
	}

	public String getAtualizadoPor() {
		return atualizadoPor;
	}
}

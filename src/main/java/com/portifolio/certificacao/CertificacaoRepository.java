package com.portifolio.certificacao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CertificacaoRepository extends JpaRepository<Certificacao, Long> {

	@Query("SELECT c FROM Certificacao c ORDER BY CASE WHEN c.dataEmissao IS NULL THEN 1 ELSE 0 END, c.dataEmissao DESC, c.id DESC")
	List<Certificacao> buscarOrdenadoPorData();
}

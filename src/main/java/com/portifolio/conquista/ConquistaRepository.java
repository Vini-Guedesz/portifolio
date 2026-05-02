package com.portifolio.conquista;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ConquistaRepository extends JpaRepository<Conquista, Long> {

	@Query("SELECT c FROM Conquista c ORDER BY CASE WHEN c.data IS NULL THEN 1 ELSE 0 END, c.data DESC, c.id DESC")
	List<Conquista> buscarOrdenadoPorData();
}

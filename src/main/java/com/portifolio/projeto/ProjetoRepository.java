package com.portifolio.projeto;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjetoRepository extends JpaRepository<Projeto, Long> {

	List<Projeto> findAllByOrderByCriadoEmDescIdDesc();
}

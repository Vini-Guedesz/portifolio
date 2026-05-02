package com.portifolio.experiencia;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperienciaRepository extends JpaRepository<Experiencia, Long> {

	List<Experiencia> findAllByOrderByDataInicioDescIdDesc();
}

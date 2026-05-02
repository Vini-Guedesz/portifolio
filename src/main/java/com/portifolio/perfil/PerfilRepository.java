package com.portifolio.perfil;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerfilRepository extends JpaRepository<Perfil, Long> {

	Optional<Perfil> findFirstByOrderByIdAsc();

	Optional<Perfil> findByUsernameIgnoreCase(String username);
}

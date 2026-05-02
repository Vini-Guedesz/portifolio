package com.portifolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@Configuration
@EnableJpaAuditing
public class AuditoriaConfig {

	@Bean
	public AuditorAware<String> auditorProvider() {
		return () -> {
			var autenticacao = SecurityContextHolder.getContext().getAuthentication();
			if (autenticacao == null || !autenticacao.isAuthenticated() || autenticacao.getName() == null || autenticacao.getName().isBlank()) {
				return Optional.of("sistema");
			}
			return Optional.of(autenticacao.getName());
		};
	}
}

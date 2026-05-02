package com.portifolio.usuario;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class UsuarioBootstrap implements CommandLineRunner {

	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;
	private final String nome;
	private final String email;
	private final String senha;
	private final boolean exigirTrocaPrimeiroAcesso;

	public UsuarioBootstrap(
			UsuarioRepository usuarioRepository,
			PasswordEncoder passwordEncoder,
			@Value("${app.admin.nome}") String nome,
			@Value("${app.admin.email}") String email,
			@Value("${app.admin.senha}") String senha,
			@Value("${app.admin.exigir-troca-primeiro-acesso:true}") boolean exigirTrocaPrimeiroAcesso
	) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
		this.nome = nome;
		this.email = email;
		this.senha = senha;
		this.exigirTrocaPrimeiroAcesso = exigirTrocaPrimeiroAcesso;
	}

	@Override
	@Transactional
	public void run(String... args) {
		if (!usuarioRepository.existsByEmail(email)) {
			usuarioRepository.save(new Usuario(email, passwordEncoder.encode(senha), nome, exigirTrocaPrimeiroAcesso));
		}
	}
}

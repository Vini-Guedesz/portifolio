package com.portifolio.seguranca;

import com.portifolio.usuario.UsuarioRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UsuarioDetalheService implements UserDetailsService {

	private final UsuarioRepository usuarioRepository;

	public UsuarioDetalheService(UsuarioRepository usuarioRepository) {
		this.usuarioRepository = usuarioRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return usuarioRepository.findByEmailIgnoreCase(username)
				.orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado"));
	}
}

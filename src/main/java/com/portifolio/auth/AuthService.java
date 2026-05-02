package com.portifolio.auth;

import com.portifolio.auth.dto.AuthLoginRequest;
import com.portifolio.auth.dto.AuthLoginResponse;
import com.portifolio.auth.dto.AuthPrimeiroAcessoRequest;
import com.portifolio.auth.dto.AuthRefreshRequest;
import com.portifolio.auth.dto.AuthSessaoResponse;
import com.portifolio.seguranca.JwtService;
import com.portifolio.shared.RegraNegocioException;
import com.portifolio.shared.RecursoNaoEncontradoException;
import com.portifolio.usuario.Usuario;
import com.portifolio.usuario.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;
	private final LoginTentativaService loginTentativaService;
	private final boolean exigirTrocaPrimeiroAcesso;

	public AuthService(
			AuthenticationManager authenticationManager,
			JwtService jwtService,
			UsuarioRepository usuarioRepository,
			PasswordEncoder passwordEncoder,
			LoginTentativaService loginTentativaService,
			@Value("${app.admin.exigir-troca-primeiro-acesso:true}") boolean exigirTrocaPrimeiroAcesso
	) {
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
		this.loginTentativaService = loginTentativaService;
		this.exigirTrocaPrimeiroAcesso = exigirTrocaPrimeiroAcesso;
	}

	@Transactional(readOnly = true)
	public AuthLoginResponse login(AuthLoginRequest request, String identificadorTentativa) {
		loginTentativaService.validarTentativa(identificadorTentativa);

		Authentication authentication;
		try {
			authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.email(), request.senha())
			);
			loginTentativaService.registrarSucesso(identificadorTentativa);
		} catch (BadCredentialsException exception) {
			loginTentativaService.registrarFalha(identificadorTentativa);
			throw exception;
		}

		var usuarioAutenticado = (UserDetails) authentication.getPrincipal();
		var usuario = buscarUsuarioPorEmail(usuarioAutenticado.getUsername());
		return montarRespostaAutenticacao(usuarioAutenticado, usuario);
	}

	@Transactional
	public AuthLoginResponse atualizarPrimeiroAcesso(Authentication autenticacao, AuthPrimeiroAcessoRequest request) {
		var usuario = buscarUsuarioPorEmail(autenticacao.getName());

		if (!passwordEncoder.matches(request.senhaAtual(), usuario.getPassword())) {
			throw new RegraNegocioException("senhaAtual", "Senha atual invalida");
		}
		if (passwordEncoder.matches(request.novaSenha(), usuario.getPassword())) {
			throw new RegraNegocioException("novaSenha", "Nova senha deve ser diferente da senha atual");
		}

		var novoEmail = request.novoEmail().trim().toLowerCase();
		if (usuarioRepository.existsByEmailIgnoreCase(novoEmail) && !usuario.getEmail().equalsIgnoreCase(novoEmail)) {
			throw new RegraNegocioException("novoEmail", "Email ja esta em uso");
		}

		usuario.atualizarCredenciaisPrimeiroAcesso(novoEmail, passwordEncoder.encode(request.novaSenha()));
		var usuarioAtualizado = usuarioRepository.save(usuario);
		return montarRespostaAutenticacao(usuarioAtualizado, usuarioAtualizado);
	}

	@Transactional(readOnly = true)
	public AuthLoginResponse renovarToken(AuthRefreshRequest request) {
		String email;
		try {
			email = jwtService.extrairEmail(request.refreshToken());
		} catch (RuntimeException exception) {
			throw new RegraNegocioException("refreshToken", "Refresh token invalido ou expirado");
		}
		var usuario = buscarUsuarioPorEmail(email);
		if (!jwtService.refreshTokenValido(request.refreshToken(), usuario)) {
			throw new RegraNegocioException("refreshToken", "Refresh token invalido ou expirado");
		}
		return montarRespostaAutenticacao(usuario, usuario);
	}

	@Transactional(readOnly = true)
	public AuthSessaoResponse buscarSessao(Authentication autenticacao) {
		var usuario = buscarUsuarioPorEmail(autenticacao.getName());
		return new AuthSessaoResponse(usuario.getEmail(), deveObrigarTrocaCredenciais(usuario));
	}

	private boolean deveObrigarTrocaCredenciais(Usuario usuario) {
		return exigirTrocaPrimeiroAcesso && Boolean.TRUE.equals(usuario.getObrigarTrocaCredenciais());
	}

	private AuthLoginResponse montarRespostaAutenticacao(UserDetails usuarioAutenticado, Usuario usuario) {
		var accessToken = jwtService.gerarAccessToken(usuarioAutenticado);
		var refreshToken = jwtService.gerarRefreshToken(usuarioAutenticado);
		return new AuthLoginResponse(
				accessToken,
				refreshToken,
				"Bearer",
				usuarioAutenticado.getUsername(),
				deveObrigarTrocaCredenciais(usuario)
		);
	}

	private Usuario buscarUsuarioPorEmail(String email) {
		return usuarioRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado"));
	}
}

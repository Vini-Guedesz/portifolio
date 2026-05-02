package com.portifolio.auth;

import com.portifolio.auth.dto.AuthLoginRequest;
import com.portifolio.auth.dto.AuthRefreshRequest;
import com.portifolio.seguranca.JwtService;
import com.portifolio.shared.RegraNegocioException;
import com.portifolio.usuario.Usuario;
import com.portifolio.usuario.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

	@Mock
	private AuthenticationManager authenticationManager;

	@Mock
	private JwtService jwtService;

	@Mock
	private UsuarioRepository usuarioRepository;

	@Mock
	private PasswordEncoder passwordEncoder;

	@Mock
	private LoginTentativaService loginTentativaService;

	private AuthService authService;

	@BeforeEach
	void setup() {
		authService = new AuthService(
				authenticationManager,
				jwtService,
				usuarioRepository,
				passwordEncoder,
				loginTentativaService,
				true
		);
	}

	@Test
	void deveRealizarLoginEEmitirAccessERefreshToken() {
		var request = new AuthLoginRequest("admin@portfolio.com", "admin123");
		var usuario = new Usuario("admin@portfolio.com", "hash", "Admin", true);
		Authentication autenticacao = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());

		when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(autenticacao);
		when(usuarioRepository.findByEmailIgnoreCase("admin@portfolio.com")).thenReturn(Optional.of(usuario));
		when(jwtService.gerarAccessToken(usuario)).thenReturn("access-token");
		when(jwtService.gerarRefreshToken(usuario)).thenReturn("refresh-token");

		var response = authService.login(request, "admin@portfolio.com|127.0.0.1");

		assertEquals("access-token", response.accessToken());
		assertEquals("refresh-token", response.refreshToken());
		verify(loginTentativaService).registrarSucesso("admin@portfolio.com|127.0.0.1");
	}

	@Test
	void deveRegistrarFalhaQuandoCredenciaisInvalidas() {
		var request = new AuthLoginRequest("admin@portfolio.com", "senha-invalida");
		when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
				.thenThrow(new BadCredentialsException("invalido"));

		assertThrows(BadCredentialsException.class, () -> authService.login(request, "admin@portfolio.com|127.0.0.1"));
		verify(loginTentativaService).registrarFalha("admin@portfolio.com|127.0.0.1");
	}

	@Test
	void naoDeveRenovarTokenComRefreshInvalido() {
		var usuario = new Usuario("admin@portfolio.com", "hash", "Admin", false);
		when(jwtService.extrairEmail("refresh-invalido")).thenReturn("admin@portfolio.com");
		when(usuarioRepository.findByEmailIgnoreCase("admin@portfolio.com")).thenReturn(Optional.of(usuario));
		when(jwtService.refreshTokenValido(eq("refresh-invalido"), eq(usuario))).thenReturn(false);

		assertThrows(RegraNegocioException.class, () -> authService.renovarToken(new AuthRefreshRequest("refresh-invalido")));
	}
}

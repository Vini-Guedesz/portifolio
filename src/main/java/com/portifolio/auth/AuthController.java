package com.portifolio.auth;

import com.portifolio.auth.dto.AuthLoginRequest;
import com.portifolio.auth.dto.AuthLoginResponse;
import com.portifolio.auth.dto.AuthPrimeiroAcessoRequest;
import com.portifolio.auth.dto.AuthRefreshRequest;
import com.portifolio.auth.dto.AuthSessaoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticacao")
public class AuthController {

	private final AuthService authService;

	public AuthController(AuthService authService) {
		this.authService = authService;
	}

	@PostMapping("/login")
	@Operation(summary = "Autentica o administrador")
	public AuthLoginResponse login(@Valid @RequestBody AuthLoginRequest request, HttpServletRequest httpRequest) {
		var chaveTentativa = request.email().trim().toLowerCase() + "|" + obterIp(httpRequest);
		return authService.login(request, chaveTentativa);
	}

	@PostMapping("/refresh")
	@Operation(summary = "Renova o access token a partir do refresh token")
	public AuthLoginResponse refresh(@Valid @RequestBody AuthRefreshRequest request) {
		return authService.renovarToken(request);
	}

	@GetMapping("/sessao")
	@Operation(summary = "Retorna estado da sessao atual")
	public AuthSessaoResponse sessao(Authentication authentication) {
		return authService.buscarSessao(authentication);
	}

	@PutMapping("/primeiro-acesso")
	@Operation(summary = "Atualiza credenciais obrigatorias do primeiro acesso")
	public AuthLoginResponse atualizarPrimeiroAcesso(Authentication authentication, @Valid @RequestBody AuthPrimeiroAcessoRequest request) {
		return authService.atualizarPrimeiroAcesso(authentication, request);
	}

	private String obterIp(HttpServletRequest request) {
		var forwardedFor = request.getHeader("X-Forwarded-For");
		if (forwardedFor != null && !forwardedFor.isBlank()) {
			return forwardedFor.split(",")[0].trim();
		}
		var realIp = request.getHeader("X-Real-IP");
		if (realIp != null && !realIp.isBlank()) {
			return realIp.trim();
		}
		return request.getRemoteAddr();
	}
}

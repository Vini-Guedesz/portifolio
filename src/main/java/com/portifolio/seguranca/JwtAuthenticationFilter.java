package com.portifolio.seguranca;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
	private final UserDetailsService userDetailsService;

	public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService) {
		this.jwtService = jwtService;
		this.userDetailsService = userDetailsService;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		var authorization = request.getHeader("Authorization");
		if (authorization == null || !authorization.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		var token = authorization.substring(7);
		String email;
		try {
			email = jwtService.extrairEmail(token);
		} catch (JwtException | IllegalArgumentException exception) {
			response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			return;
		}

		if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
			var usuario = userDetailsService.loadUserByUsername(email);
			if (jwtService.accessTokenValido(token, usuario)) {
				var autenticacao = new UsernamePasswordAuthenticationToken(usuario, null, usuario.getAuthorities());
				autenticacao.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				SecurityContextHolder.getContext().setAuthentication(autenticacao);
			}
		}

		filterChain.doFilter(request, response);
	}
}

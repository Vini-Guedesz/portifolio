package com.portifolio.seguranca;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

	private static final String CLAIM_TIPO_TOKEN = "token_tipo";
	private static final String TIPO_ACCESS = "access";
	private static final String TIPO_REFRESH = "refresh";

	private final SecretKey chave;
	private final long expiracaoAccessMs;
	private final long expiracaoRefreshMs;

	public JwtService(
			@Value("${app.jwt.secret}") String segredo,
			@Value("${app.jwt.expiracao-ms}") long expiracaoAccessMs,
			@Value("${app.jwt.refresh-expiracao-ms}") long expiracaoRefreshMs
	) {
		this.chave = Keys.hmacShaKeyFor(normalizarSegredo(segredo));
		this.expiracaoAccessMs = expiracaoAccessMs;
		this.expiracaoRefreshMs = expiracaoRefreshMs;
	}

	public String gerarAccessToken(UserDetails usuario) {
		return gerarToken(usuario, expiracaoAccessMs, TIPO_ACCESS);
	}

	public String gerarRefreshToken(UserDetails usuario) {
		return gerarToken(usuario, expiracaoRefreshMs, TIPO_REFRESH);
	}

	public String extrairEmail(String token) {
		return extrairClaim(token, Claims::getSubject);
	}

	public boolean accessTokenValido(String token, UserDetails usuario) {
		return tokenEhDoTipo(token, TIPO_ACCESS) && tokenValido(token, usuario);
	}

	public boolean refreshTokenValido(String token, UserDetails usuario) {
		return tokenEhDoTipo(token, TIPO_REFRESH) && tokenValido(token, usuario);
	}

	private String gerarToken(UserDetails usuario, long expiracaoMs, String tipoToken) {
		var agora = Instant.now();
		return Jwts.builder()
				.subject(usuario.getUsername())
				.issuedAt(Date.from(agora))
				.claim(CLAIM_TIPO_TOKEN, tipoToken)
				.expiration(Date.from(agora.plusMillis(expiracaoMs)))
				.signWith(chave)
				.compact();
	}
	
	private boolean tokenValido(String token, UserDetails usuario) {
		return extrairEmail(token).equals(usuario.getUsername()) && !tokenExpirado(token);
	}

	private boolean tokenEhDoTipo(String token, String tipoEsperado) {
		var tipoToken = extrairClaim(token, claims -> claims.get(CLAIM_TIPO_TOKEN, String.class));
		return tipoEsperado.equals(tipoToken);
	}

	private boolean tokenExpirado(String token) {
		return extrairClaim(token, Claims::getExpiration).before(new Date());
	}

	private <T> T extrairClaim(String token, Function<Claims, T> resolver) {
		return resolver.apply(Jwts.parser()
				.verifyWith(chave)
				.build()
				.parseSignedClaims(token)
				.getPayload());
	}

	private byte[] normalizarSegredo(String segredo) {
		try {
			var decodificado = Decoders.BASE64.decode(segredo);
			if (decodificado.length >= 32) {
				return decodificado;
			}
		} catch (RuntimeException ignored) {
		}
		return segredo.getBytes(StandardCharsets.UTF_8);
	}
}

package com.portifolio.auth;

import com.portifolio.shared.LimiteRequisicaoException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginTentativaService {

	private final int maxTentativas;
	private final Duration janelaAnalise;
	private final Duration tempoBloqueio;
	private final ConcurrentHashMap<String, TentativaLogin> tentativas = new ConcurrentHashMap<>();

	public LoginTentativaService(
			@Value("${app.auth.login.max-tentativas:5}") int maxTentativas,
			@Value("${app.auth.login.janela-minutos:10}") long janelaMinutos,
			@Value("${app.auth.login.bloqueio-minutos:15}") long bloqueioMinutos
	) {
		this.maxTentativas = maxTentativas;
		this.janelaAnalise = Duration.ofMinutes(janelaMinutos);
		this.tempoBloqueio = Duration.ofMinutes(bloqueioMinutos);
	}

	public void validarTentativa(String chave) {
		var tentativa = tentativas.get(chave);
		if (tentativa == null) {
			return;
		}

		var agora = Instant.now();
		if (tentativa.bloqueadoAte != null && agora.isBefore(tentativa.bloqueadoAte)) {
			var minutosRestantes = Math.max(1, Duration.between(agora, tentativa.bloqueadoAte).toMinutes());
			throw new LimiteRequisicaoException("Muitas tentativas de login. Tente novamente em " + minutosRestantes + " minuto(s).");
		}
	}

	public void registrarSucesso(String chave) {
		tentativas.remove(chave);
	}

	public void registrarFalha(String chave) {
		var agora = Instant.now();
		tentativas.compute(chave, (chaveAtual, tentativaAtual) -> {
			var tentativa = tentativaAtual;
			if (tentativa == null || Duration.between(tentativa.primeiraFalhaEm, agora).compareTo(janelaAnalise) > 0) {
				tentativa = new TentativaLogin(1, agora, null);
			} else {
				tentativa = new TentativaLogin(tentativa.totalFalhas + 1, tentativa.primeiraFalhaEm, tentativa.bloqueadoAte);
			}

			if (tentativa.totalFalhas >= maxTentativas) {
				return new TentativaLogin(tentativa.totalFalhas, tentativa.primeiraFalhaEm, agora.plus(tempoBloqueio));
			}
			return tentativa;
		});
	}

	private record TentativaLogin(int totalFalhas, Instant primeiraFalhaEm, Instant bloqueadoAte) {
	}
}

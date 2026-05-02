package com.portifolio.shared;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {

	@ExceptionHandler(RecursoNaoEncontradoException.class)
	public ResponseEntity<ErroResponse> tratarNaoEncontrado(RecursoNaoEncontradoException exception, HttpServletRequest request) {
		var status = HttpStatus.NOT_FOUND;
		return ResponseEntity.status(status)
				.body(ErroResponse.simples(status.value(), status.getReasonPhrase(), exception.getMessage(), request.getRequestURI()));
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ErroResponse> tratarCredenciaisInvalidas(BadCredentialsException exception, HttpServletRequest request) {
		var status = HttpStatus.UNAUTHORIZED;
		return ResponseEntity.status(status)
				.body(ErroResponse.simples(status.value(), status.getReasonPhrase(), "Email ou senha invalidos", request.getRequestURI()));
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErroResponse> tratarValidacao(MethodArgumentNotValidException exception, HttpServletRequest request) {
		var campos = new LinkedHashMap<String, String>();
		exception.getBindingResult().getFieldErrors()
				.forEach(erro -> campos.put(erro.getField(), erro.getDefaultMessage()));

		var status = HttpStatus.BAD_REQUEST;
		return ResponseEntity.status(status)
				.body(ErroResponse.comCampos(status.value(), status.getReasonPhrase(), "Dados invalidos", request.getRequestURI(), campos));
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErroResponse> tratarRegra(IllegalArgumentException exception, HttpServletRequest request) {
		var status = HttpStatus.BAD_REQUEST;
		return ResponseEntity.status(status)
				.body(ErroResponse.simples(status.value(), status.getReasonPhrase(), exception.getMessage(), request.getRequestURI()));
	}

	@ExceptionHandler(RegraNegocioException.class)
	public ResponseEntity<ErroResponse> tratarRegraNegocio(RegraNegocioException exception, HttpServletRequest request) {
		var status = HttpStatus.BAD_REQUEST;
		return ResponseEntity.status(status)
				.body(ErroResponse.comCampos(status.value(), status.getReasonPhrase(), exception.getMessage(), request.getRequestURI(), exception.getCampos()));
	}

	@ExceptionHandler(LimiteRequisicaoException.class)
	public ResponseEntity<ErroResponse> tratarLimiteRequisicao(LimiteRequisicaoException exception, HttpServletRequest request) {
		var status = HttpStatus.TOO_MANY_REQUESTS;
		return ResponseEntity.status(status)
				.body(ErroResponse.simples(status.value(), status.getReasonPhrase(), exception.getMessage(), request.getRequestURI()));
	}
}

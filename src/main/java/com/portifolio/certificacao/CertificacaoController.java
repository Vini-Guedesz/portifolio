package com.portifolio.certificacao;

import com.portifolio.certificacao.dto.CertificacaoRequest;
import com.portifolio.certificacao.dto.CertificacaoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/certificacoes")
@Tag(name = "Certificacoes")
public class CertificacaoController {

	private final CertificacaoService certificacaoService;

	public CertificacaoController(CertificacaoService certificacaoService) {
		this.certificacaoService = certificacaoService;
	}

	@GetMapping
	@Operation(summary = "Lista certificacoes")
	public List<CertificacaoResponse> listar() {
		return certificacaoService.listar();
	}

	@GetMapping("/{id}")
	@Operation(summary = "Busca certificacao por id")
	public CertificacaoResponse buscarPorId(@PathVariable Long id) {
		return certificacaoService.buscarPorId(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Cria certificacao")
	public CertificacaoResponse criar(@Valid @RequestBody CertificacaoRequest request) {
		return certificacaoService.criar(request);
	}

	@PutMapping("/{id}")
	@Operation(summary = "Atualiza certificacao")
	public CertificacaoResponse atualizar(@PathVariable Long id, @Valid @RequestBody CertificacaoRequest request) {
		return certificacaoService.atualizar(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Remove certificacao")
	public void remover(@PathVariable Long id) {
		certificacaoService.remover(id);
	}
}

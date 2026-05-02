package com.portifolio.projeto;

import com.portifolio.projeto.dto.ProjetoRequest;
import com.portifolio.projeto.dto.ProjetoResponse;
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
@RequestMapping("/projetos")
@Tag(name = "Projetos")
public class ProjetoController {

	private final ProjetoService projetoService;

	public ProjetoController(ProjetoService projetoService) {
		this.projetoService = projetoService;
	}

	@GetMapping
	@Operation(summary = "Lista projetos")
	public List<ProjetoResponse> listar() {
		return projetoService.listar();
	}

	@GetMapping("/{id}")
	@Operation(summary = "Busca projeto por id")
	public ProjetoResponse buscarPorId(@PathVariable Long id) {
		return projetoService.buscarPorId(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Cria projeto")
	public ProjetoResponse criar(@Valid @RequestBody ProjetoRequest request) {
		return projetoService.criar(request);
	}

	@PutMapping("/{id}")
	@Operation(summary = "Atualiza projeto")
	public ProjetoResponse atualizar(@PathVariable Long id, @Valid @RequestBody ProjetoRequest request) {
		return projetoService.atualizar(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Remove projeto")
	public void remover(@PathVariable Long id) {
		projetoService.remover(id);
	}
}

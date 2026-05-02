package com.portifolio.experiencia;

import com.portifolio.experiencia.dto.ExperienciaRequest;
import com.portifolio.experiencia.dto.ExperienciaResponse;
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
@RequestMapping("/experiencias")
@Tag(name = "Experiencias")
public class ExperienciaController {

	private final ExperienciaService experienciaService;

	public ExperienciaController(ExperienciaService experienciaService) {
		this.experienciaService = experienciaService;
	}

	@GetMapping
	@Operation(summary = "Lista experiencias")
	public List<ExperienciaResponse> listar() {
		return experienciaService.listar();
	}

	@GetMapping("/{id}")
	@Operation(summary = "Busca experiencia por id")
	public ExperienciaResponse buscarPorId(@PathVariable Long id) {
		return experienciaService.buscarPorId(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Cria experiencia")
	public ExperienciaResponse criar(@Valid @RequestBody ExperienciaRequest request) {
		return experienciaService.criar(request);
	}

	@PutMapping("/{id}")
	@Operation(summary = "Atualiza experiencia")
	public ExperienciaResponse atualizar(@PathVariable Long id, @Valid @RequestBody ExperienciaRequest request) {
		return experienciaService.atualizar(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Remove experiencia")
	public void remover(@PathVariable Long id) {
		experienciaService.remover(id);
	}
}

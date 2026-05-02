package com.portifolio.conquista;

import com.portifolio.conquista.dto.ConquistaRequest;
import com.portifolio.conquista.dto.ConquistaResponse;
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
@RequestMapping("/conquistas")
@Tag(name = "Conquistas")
public class ConquistaController {

	private final ConquistaService conquistaService;

	public ConquistaController(ConquistaService conquistaService) {
		this.conquistaService = conquistaService;
	}

	@GetMapping
	@Operation(summary = "Lista conquistas")
	public List<ConquistaResponse> listar() {
		return conquistaService.listar();
	}

	@GetMapping("/{id}")
	@Operation(summary = "Busca conquista por id")
	public ConquistaResponse buscarPorId(@PathVariable Long id) {
		return conquistaService.buscarPorId(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@Operation(summary = "Cria conquista")
	public ConquistaResponse criar(@Valid @RequestBody ConquistaRequest request) {
		return conquistaService.criar(request);
	}

	@PutMapping("/{id}")
	@Operation(summary = "Atualiza conquista")
	public ConquistaResponse atualizar(@PathVariable Long id, @Valid @RequestBody ConquistaRequest request) {
		return conquistaService.atualizar(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@Operation(summary = "Remove conquista")
	public void remover(@PathVariable Long id) {
		conquistaService.remover(id);
	}
}

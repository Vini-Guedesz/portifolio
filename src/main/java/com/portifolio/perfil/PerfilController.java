package com.portifolio.perfil;

import com.portifolio.perfil.dto.PerfilRequest;
import com.portifolio.perfil.dto.PerfilResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/perfil")
@Tag(name = "Perfil")
public class PerfilController {

	private final PerfilService perfilService;

	public PerfilController(PerfilService perfilService) {
		this.perfilService = perfilService;
	}

	@GetMapping
	@Operation(summary = "Busca o perfil publico")
	public PerfilResponse buscar() {
		return perfilService.buscar();
	}

	@PutMapping
	@Operation(summary = "Atualiza o perfil")
	public PerfilResponse atualizar(@Valid @RequestBody PerfilRequest request) {
		return perfilService.atualizar(request);
	}

	@PostMapping(value = "/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	@Operation(summary = "Envia foto de perfil")
	public PerfilResponse atualizarFoto(@RequestPart("arquivo") MultipartFile arquivo) {
		return perfilService.atualizarFoto(arquivo);
	}
}

package com.portifolio.conquista;

import com.portifolio.conquista.dto.ConquistaRequest;
import com.portifolio.conquista.dto.ConquistaResponse;
import com.portifolio.shared.RegraNegocioException;
import com.portifolio.shared.RecursoNaoEncontradoException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ConquistaService {

	private final ConquistaRepository conquistaRepository;

	public ConquistaService(ConquistaRepository conquistaRepository) {
		this.conquistaRepository = conquistaRepository;
	}

	@Transactional(readOnly = true)
	public List<ConquistaResponse> listar() {
		return conquistaRepository.buscarOrdenadoPorData().stream()
				.map(ConquistaResponse::de)
				.toList();
	}

	@Transactional(readOnly = true)
	public ConquistaResponse buscarPorId(Long id) {
		return ConquistaResponse.de(buscarEntidade(id));
	}

	@Transactional
	public ConquistaResponse criar(ConquistaRequest request) {
		validarRegras(request);
		var conquista = new Conquista(request.titulo(), request.descricao(), request.data());
		return ConquistaResponse.de(conquistaRepository.save(conquista));
	}

	@Transactional
	public ConquistaResponse atualizar(Long id, ConquistaRequest request) {
		validarRegras(request);
		var conquista = buscarEntidade(id);
		conquista.atualizar(request.titulo(), request.descricao(), request.data());
		return ConquistaResponse.de(conquista);
	}

	@Transactional
	public void remover(Long id) {
		var conquista = buscarEntidade(id);
		conquistaRepository.delete(conquista);
	}

	private Conquista buscarEntidade(Long id) {
		return conquistaRepository.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Conquista nao encontrada"));
	}

	private void validarRegras(ConquistaRequest request) {
		if (request.data() != null && request.data().isAfter(LocalDate.now())) {
			throw new RegraNegocioException("data", "Data da conquista nao pode ser futura");
		}
	}
}

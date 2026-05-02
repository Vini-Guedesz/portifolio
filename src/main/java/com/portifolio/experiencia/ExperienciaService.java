package com.portifolio.experiencia;

import com.portifolio.experiencia.dto.ExperienciaRequest;
import com.portifolio.experiencia.dto.ExperienciaResponse;
import com.portifolio.shared.RegraNegocioException;
import com.portifolio.shared.RecursoNaoEncontradoException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExperienciaService {

	private final ExperienciaRepository experienciaRepository;

	public ExperienciaService(ExperienciaRepository experienciaRepository) {
		this.experienciaRepository = experienciaRepository;
	}

	@Transactional(readOnly = true)
	public List<ExperienciaResponse> listar() {
		return experienciaRepository.findAllByOrderByDataInicioDescIdDesc().stream()
				.map(ExperienciaResponse::de)
				.toList();
	}

	@Transactional(readOnly = true)
	public ExperienciaResponse buscarPorId(Long id) {
		return ExperienciaResponse.de(buscarEntidade(id));
	}

	@Transactional
	public ExperienciaResponse criar(ExperienciaRequest request) {
		validarRegras(request);
		var experiencia = new Experiencia(
				request.empresa(),
				request.cargo(),
				request.descricao(),
				request.dataInicio(),
				request.dataFim(),
				request.atual()
		);
		return ExperienciaResponse.de(experienciaRepository.save(experiencia));
	}

	@Transactional
	public ExperienciaResponse atualizar(Long id, ExperienciaRequest request) {
		validarRegras(request);
		var experiencia = buscarEntidade(id);
		experiencia.atualizar(
				request.empresa(),
				request.cargo(),
				request.descricao(),
				request.dataInicio(),
				request.dataFim(),
				request.atual()
		);
		return ExperienciaResponse.de(experiencia);
	}

	@Transactional
	public void remover(Long id) {
		var experiencia = buscarEntidade(id);
		experienciaRepository.delete(experiencia);
	}

	private Experiencia buscarEntidade(Long id) {
		return experienciaRepository.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Experiencia nao encontrada"));
	}

	private void validarRegras(ExperienciaRequest request) {
		if (Boolean.TRUE.equals(request.atual()) && request.dataFim() != null) {
			throw new RegraNegocioException("dataFim", "Data fim nao deve ser informada quando a experiencia e atual");
		}
		if (Boolean.FALSE.equals(request.atual()) && request.dataFim() == null) {
			throw new RegraNegocioException("dataFim", "Data fim e obrigatoria quando a experiencia nao e atual");
		}
		if (request.dataFim() != null && request.dataFim().isBefore(request.dataInicio())) {
			throw new RegraNegocioException("dataFim", "Data fim nao pode ser anterior a data inicio");
		}
	}
}

package com.portifolio.projeto;

import com.portifolio.projeto.dto.ProjetoRequest;
import com.portifolio.projeto.dto.ProjetoResponse;
import com.portifolio.shared.RegraNegocioException;
import com.portifolio.shared.RecursoNaoEncontradoException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjetoService {

	private final ProjetoRepository projetoRepository;

	public ProjetoService(ProjetoRepository projetoRepository) {
		this.projetoRepository = projetoRepository;
	}

	@Transactional(readOnly = true)
	public List<ProjetoResponse> listar() {
		return projetoRepository.findAllByOrderByCriadoEmDescIdDesc().stream()
				.map(ProjetoResponse::de)
				.toList();
	}

	@Transactional(readOnly = true)
	public ProjetoResponse buscarPorId(Long id) {
		return ProjetoResponse.de(buscarEntidade(id));
	}

	@Transactional
	public ProjetoResponse criar(ProjetoRequest request) {
		validarLinks(request.githubUrl(), request.deployUrl());
		var projeto = new Projeto(
				request.nome(),
				request.descricao(),
				request.tecnologias(),
				request.githubUrl(),
				request.deployUrl(),
				request.destaque()
		);
		return ProjetoResponse.de(projetoRepository.save(projeto));
	}

	@Transactional
	public ProjetoResponse atualizar(Long id, ProjetoRequest request) {
		validarLinks(request.githubUrl(), request.deployUrl());
		var projeto = buscarEntidade(id);
		projeto.atualizar(
				request.nome(),
				request.descricao(),
				request.tecnologias(),
				request.githubUrl(),
				request.deployUrl(),
				request.destaque()
		);
		return ProjetoResponse.de(projeto);
	}

	@Transactional
	public void remover(Long id) {
		var projeto = buscarEntidade(id);
		projetoRepository.delete(projeto);
	}

	private Projeto buscarEntidade(Long id) {
		return projetoRepository.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Projeto nao encontrado"));
	}

	private void validarLinks(String githubUrl, String deployUrl) {
		if (!linkValido(githubUrl)) {
			throw new RegraNegocioException("githubUrl", "Link do GitHub deve comecar com http:// ou https://");
		}
		if (deployUrl != null && !deployUrl.isBlank() && !linkValido(deployUrl)) {
			throw new RegraNegocioException("deployUrl", "Link de deploy deve comecar com http:// ou https://");
		}
	}

	private boolean linkValido(String link) {
		return link != null && (link.startsWith("http://") || link.startsWith("https://"));
	}
}

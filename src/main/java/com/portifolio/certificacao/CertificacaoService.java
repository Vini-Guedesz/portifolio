package com.portifolio.certificacao;

import com.portifolio.certificacao.dto.CertificacaoRequest;
import com.portifolio.certificacao.dto.CertificacaoResponse;
import com.portifolio.shared.RegraNegocioException;
import com.portifolio.shared.RecursoNaoEncontradoException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class CertificacaoService {

	private final CertificacaoRepository certificacaoRepository;

	public CertificacaoService(CertificacaoRepository certificacaoRepository) {
		this.certificacaoRepository = certificacaoRepository;
	}

	@Transactional(readOnly = true)
	public List<CertificacaoResponse> listar() {
		return certificacaoRepository.buscarOrdenadoPorData().stream()
				.map(CertificacaoResponse::de)
				.toList();
	}

	@Transactional(readOnly = true)
	public CertificacaoResponse buscarPorId(Long id) {
		return CertificacaoResponse.de(buscarEntidade(id));
	}

	@Transactional
	public CertificacaoResponse criar(CertificacaoRequest request) {
		validarRegras(request);
		var certificacao = new Certificacao(request.nome(), request.emissor(), request.dataEmissao(), request.link());
		return CertificacaoResponse.de(certificacaoRepository.save(certificacao));
	}

	@Transactional
	public CertificacaoResponse atualizar(Long id, CertificacaoRequest request) {
		validarRegras(request);
		var certificacao = buscarEntidade(id);
		certificacao.atualizar(request.nome(), request.emissor(), request.dataEmissao(), request.link());
		return CertificacaoResponse.de(certificacao);
	}

	@Transactional
	public void remover(Long id) {
		var certificacao = buscarEntidade(id);
		certificacaoRepository.delete(certificacao);
	}

	private Certificacao buscarEntidade(Long id) {
		return certificacaoRepository.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Certificacao nao encontrada"));
	}

	private void validarRegras(CertificacaoRequest request) {
		if (request.dataEmissao() != null && request.dataEmissao().isAfter(LocalDate.now())) {
			throw new RegraNegocioException("dataEmissao", "Data de emissao nao pode ser futura");
		}
	}
}

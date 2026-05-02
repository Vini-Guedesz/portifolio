package com.portifolio.perfil;

import com.portifolio.perfil.dto.PerfilRequest;
import com.portifolio.perfil.dto.PerfilResponse;
import com.portifolio.shared.RegraNegocioException;
import com.portifolio.shared.RecursoNaoEncontradoException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class PerfilService {

	private static final long TAMANHO_MAXIMO_FOTO = 2 * 1024 * 1024;

	private final PerfilRepository perfilRepository;
	private final Path diretorioUploadPerfil;

	public PerfilService(PerfilRepository perfilRepository, @Value("${app.upload.dir:uploads}") String diretorioUpload) {
		this.perfilRepository = perfilRepository;
		this.diretorioUploadPerfil = Path.of(diretorioUpload).toAbsolutePath().normalize().resolve("perfil");
	}

	@Transactional(readOnly = true)
	public PerfilResponse buscar() {
		return perfilRepository.findFirstByOrderByIdAsc()
				.map(PerfilResponse::de)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Perfil ainda nao cadastrado"));
	}

	@Transactional
	public PerfilResponse atualizar(PerfilRequest request) {
		var usernameNormalizado = normalizarUsername(request.username());
		validarLinkOpcional(request.fotoUrl(), "fotoUrl", "Foto URL");
		validarLinkOpcional(request.linkedinUrl(), "linkedinUrl", "LinkedIn");
		validarLinkOpcional(request.githubUrl(), "githubUrl", "GitHub");
		validarLinkOpcional(request.xUrl(), "xUrl", "X");
		validarLinkOpcional(request.tiktokUrl(), "tiktokUrl", "TikTok");

		var perfil = perfilRepository.findFirstByOrderByIdAsc()
				.orElseGet(() -> new Perfil(request.nome(), usernameNormalizado, request.cargo(), request.resumo()));
		validarUsernameUnico(usernameNormalizado, perfil.getId());

		perfil.atualizar(
				request.nome(),
				usernameNormalizado,
				request.cargo(),
				request.resumo(),
				request.fotoUrl(),
				request.disponibilidade(),
				request.emailContato(),
				request.linkedinUrl(),
				request.githubUrl(),
				request.xUrl(),
				request.tiktokUrl(),
				request.palavrasChave()
		);
		return PerfilResponse.de(perfilRepository.save(perfil));
	}

	@Transactional
	public PerfilResponse atualizarFoto(MultipartFile arquivo) {
		if (arquivo == null || arquivo.isEmpty()) {
			throw new RegraNegocioException("arquivo", "Arquivo de foto e obrigatorio");
		}
		if (arquivo.getSize() > TAMANHO_MAXIMO_FOTO) {
			throw new RegraNegocioException("arquivo", "Foto deve ter no maximo 2MB");
		}
		var contentType = arquivo.getContentType();
		if (contentType == null || !contentType.startsWith("image/")) {
			throw new RegraNegocioException("arquivo", "Arquivo deve ser uma imagem valida");
		}

		var perfil = perfilRepository.findFirstByOrderByIdAsc()
				.orElseThrow(() -> new RecursoNaoEncontradoException("Perfil ainda nao cadastrado"));

		var extensao = extrairExtensao(arquivo.getOriginalFilename());
		var nomeArquivo = "perfil-" + UUID.randomUUID() + extensao;

		try {
			Files.createDirectories(diretorioUploadPerfil);
			var destino = diretorioUploadPerfil.resolve(nomeArquivo).normalize();
			Files.copy(arquivo.getInputStream(), destino, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException exception) {
			throw new IllegalArgumentException("Nao foi possivel salvar a imagem de perfil");
		}

		perfil.atualizarFotoUrl("/uploads/perfil/" + nomeArquivo);
		return PerfilResponse.de(perfilRepository.save(perfil));
	}

	private void validarLinkOpcional(String link, String campo, String rotulo) {
		if (link == null || link.isBlank()) {
			return;
		}
		if (!link.startsWith("http://") && !link.startsWith("https://")) {
			throw new RegraNegocioException(campo, rotulo + " deve comecar com http:// ou https://");
		}
	}

	private String normalizarUsername(String username) {
		return username == null ? null : username.trim().toLowerCase();
	}

	private void validarUsernameUnico(String username, Long perfilIdAtual) {
		perfilRepository.findByUsernameIgnoreCase(username)
				.filter(existente -> perfilIdAtual == null || !existente.getId().equals(perfilIdAtual))
				.ifPresent(existente -> {
					throw new RegraNegocioException("username", "Username ja esta em uso");
				});
	}

	private String extrairExtensao(String nomeArquivo) {
		if (nomeArquivo == null || nomeArquivo.isBlank()) {
			return ".jpg";
		}
		var indice = nomeArquivo.lastIndexOf('.');
		if (indice < 0 || indice == nomeArquivo.length() - 1) {
			return ".jpg";
		}
		var extensao = nomeArquivo.substring(indice).toLowerCase();
		if (extensao.length() > 8) {
			return ".jpg";
		}
		return extensao;
	}
}

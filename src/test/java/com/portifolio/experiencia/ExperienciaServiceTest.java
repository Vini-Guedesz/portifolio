package com.portifolio.experiencia;

import com.portifolio.experiencia.dto.ExperienciaRequest;
import com.portifolio.shared.RegraNegocioException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExperienciaServiceTest {

	@Mock
	private ExperienciaRepository experienciaRepository;

	@InjectMocks
	private ExperienciaService experienciaService;

	@Test
	void naoDevePermitirDataFimQuandoEmpregoAtual() {
		var request = new ExperienciaRequest(
				"Empresa X",
				"Dev Backend",
				"Descricao",
				LocalDate.of(2024, 1, 1),
				LocalDate.of(2024, 12, 1),
				true
		);

		var exception = assertThrows(RegraNegocioException.class, () -> experienciaService.criar(request));
		assertEquals("Data fim nao deve ser informada quando a experiencia e atual", exception.getMessage());
	}

	@Test
	void deveCriarExperienciaQuandoRegraValida() {
		var request = new ExperienciaRequest(
				"Empresa X",
				"Dev Backend",
				"Descricao",
				LocalDate.of(2024, 1, 1),
				LocalDate.of(2024, 12, 1),
				false
		);

		when(experienciaRepository.save(any(Experiencia.class)))
				.thenAnswer(invocation -> {
					var experiencia = invocation.getArgument(0, Experiencia.class);
					experiencia.atualizar(
							request.empresa(),
							request.cargo(),
							request.descricao(),
							request.dataInicio(),
							request.dataFim(),
							request.atual()
					);
					return experiencia;
				});

		var response = experienciaService.criar(request);
		assertEquals("Empresa X", response.empresa());
		assertEquals(false, response.atual());
		assertEquals(LocalDate.of(2024, 12, 1), response.dataFim());
	}
}

package com.portifolio.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

	@Bean
	public OpenAPI openAPI() {
		var esquema = new SecurityScheme()
				.name("Authorization")
				.type(SecurityScheme.Type.HTTP)
				.scheme("bearer")
				.bearerFormat("JWT");

		return new OpenAPI()
				.info(new Info()
						.title("API Portfolio Pessoal")
						.version("1.0.0")
						.description("API REST para area publica e administrativa de portfolio pessoal"))
				.components(new Components().addSecuritySchemes("bearerAuth", esquema))
				.addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
	}
}

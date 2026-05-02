package com.portifolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
public class ArquivoPublicoConfig implements WebMvcConfigurer {

	private final String caminhoUploads;

	public ArquivoPublicoConfig(@Value("${app.upload.dir:uploads}") String diretorioUpload) {
		var caminho = Path.of(diretorioUpload).toAbsolutePath().normalize().toUri().toString();
		this.caminhoUploads = caminho.endsWith("/") ? caminho : caminho + "/";
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/uploads/**")
				.addResourceLocations(caminhoUploads);
	}
}

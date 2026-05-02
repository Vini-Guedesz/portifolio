package com.portifolio;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class PortifolioApplicationTests {

	@Test
	void contextLoads() {
		assertDoesNotThrow(PortifolioApplication::new);
	}

}

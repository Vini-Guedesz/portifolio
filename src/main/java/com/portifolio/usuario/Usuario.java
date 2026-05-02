package com.portifolio.usuario;

import com.portifolio.shared.EntidadeAuditavel;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "usuarios")
public class Usuario extends EntidadeAuditavel implements UserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, length = 160)
	private String email;

	@Column(nullable = false, length = 120)
	private String senha;

	@Column(nullable = false, length = 120)
	private String nome;

	@Column(nullable = false, length = 30)
	private String perfil = "ROLE_ADMIN";

	@Column(name = "obrigar_troca_credenciais", nullable = false)
	private Boolean obrigarTrocaCredenciais = true;

	protected Usuario() {
	}

	public Usuario(String email, String senha, String nome) {
		this(email, senha, nome, true);
	}

	public Usuario(String email, String senha, String nome, boolean obrigarTrocaCredenciais) {
		this.email = email;
		this.senha = senha;
		this.nome = nome;
		this.obrigarTrocaCredenciais = obrigarTrocaCredenciais;
	}

	public Long getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public String getNome() {
		return nome;
	}

	public String getPerfil() {
		return perfil;
	}

	public Boolean getObrigarTrocaCredenciais() {
		return obrigarTrocaCredenciais;
	}

	public void atualizarCredenciaisPrimeiroAcesso(String novoEmail, String novaSenha) {
		this.email = novoEmail;
		this.senha = novaSenha;
		this.obrigarTrocaCredenciais = false;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return List.of(new SimpleGrantedAuthority(perfil));
	}

	@Override
	public String getPassword() {
		return senha;
	}

	@Override
	public String getUsername() {
		return email;
	}
}

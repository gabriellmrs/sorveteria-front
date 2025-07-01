import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import { FaLock, FaEnvelope, FaKey } from 'react-icons/fa';
import URL from '../service/url';

const RedefinirSenha = () => {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleRedefinirSenha = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    if (novaSenha !== confirmaSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    try {
      const resposta = await fetch(`${URL}/usuario/redefinir-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, codigo, novaSenha })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao redefinir senha.');
        return;
      }

      setMensagem('Senha atualizada com sucesso! Redirecionando para login...');
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      setErro('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Redefinir Senha</h2>
        <p className={styles.subtitle}>Digite seu e-mail, código recebido e a nova senha</p>

        <form className={styles.form} onSubmit={handleRedefinirSenha}>
          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.icon} />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="E-mail"
            />
          </div>

          <div className={styles.inputGroup}>
            <FaKey className={styles.icon} />
            <input
              type="text"
              placeholder="Código de recuperação"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              maxLength={6}
              required
              aria-label="Código"
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              placeholder="Nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              aria-label="Nova senha"
            />
          </div>

          <div className={styles.inputGroup}>
            <FaLock className={styles.icon} />
            <input
              type="password"
              placeholder="Confirme a nova senha"
              value={confirmaSenha}
              onChange={(e) => setConfirmaSenha(e.target.value)}
              required
              aria-label="Confirme a nova senha"
            />
          </div>

          {mensagem && <p className={styles.success}>{mensagem}</p>}
          {erro && <p className={styles.erro}>{erro}</p>}

          <button type="submit" className={styles.button}>Redefinir Senha</button>
        </form>
      </div>
    </div>
  );
};

export default RedefinirSenha;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import { FaEnvelope } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im'; 
import URL from '../service/url';

const SolicitarCodigo = () => {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnviarCodigo = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');
    setLoading(true);

    try {
      const resposta = await fetch(`${URL}/usuario/esqueci-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao enviar código.');
        setLoading(false);
        return;
      }

      setMensagem('Código enviado para o e-mail.');
      setTimeout(() => {
        setLoading(false);
        navigate('/redefinir-senha');
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar código:', error);
      setErro('Erro de conexão com o servidor.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Recuperar Senha</h2>
        <p className={styles.subtitle}>Digite seu e-mail para receber um código</p>

        <form className={styles.form} onSubmit={handleEnviarCodigo}>
          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.icon} />
            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              aria-label="E-mail"
            />
          </div>

          {mensagem && <p className={styles.success}>{mensagem}</p>}
          {erro && <p className={styles.erro}>{erro}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? <ImSpinner2 className={styles.spinnerIcon} /> : 'Enviar Código'}
          </button>
        </form>

        <p className={styles.signupText}>
          Lembrou da senha?{' '}
          <span onClick={() => navigate('/')} className={styles.signupLink}>Fazer login</span>
        </p>
      </div>
    </div>
  );
};

export default SolicitarCodigo;

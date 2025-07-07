import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import URL from '../service/url.js';


const logoPath = '/logo.jpeg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const resposta = await fetch(`${URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.erro || 'Erro ao fazer login. Verifique suas credenciais.');
        return;
      }

      localStorage.setItem('token', dados.token);
      navigate('/home');
    } catch (error) {
      console.error('Erro de conexão ou no servidor:', error);
      setErro('Erro de conexão com o servidor. Tente novamente mais tarde.');
    }
    finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (platform) => {
    setErro(`Login com ${platform} não implementado ainda!`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <img src={logoPath} alt="Logo FrostSys" className={styles.logoLogin} />

        <h2 className={styles.title}>Bem-vindo de Volta!</h2>
        <p className={styles.subtitle}>Faça login para continuar</p>

        <form className={styles.form} onSubmit={handleLogin}>
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
            <FaLock className={styles.icon} />
            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              aria-label="Senha"
            />
          </div>

          <div className={styles.options}>
            <label className={styles.rememberMe}>
            </label>
            <a onClick={() => navigate('/esqueci-senha')} className={styles.forgotPassword}>
              Esqueceu a senha?
            </a>
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? (
              <FaSpinner className={styles.spinnerIcon} />
            ) : (
              'Entrar'
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;

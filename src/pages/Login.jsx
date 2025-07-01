import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Login.module.css';
import { FaEnvelope, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';
import URL from '../service/url.js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

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
  };

  const handleSocialLogin = (platform) => {
    alert(`Login com ${platform} não implementado ainda!`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
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
              <input type="checkbox" /> Lembrar de mim
            </label>
            <a onClick={() => navigate('/esqueci-senha')} className={styles.forgotPassword}>
              Esqueceu a senha?
            </a>
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <button type="submit" className={styles.button}>Entrar</button>
        </form>

        <div className={styles.divider}>
          <span>OU</span>
        </div>

        <div className={styles.socialLogin}>
          <button
            className={`${styles.socialButton} ${styles.google}`}
            onClick={() => handleSocialLogin('Google')}
            aria-label="Login com Google"
          >
            <FaGoogle className={styles.socialIcon} /> Google
          </button>
          <button
            className={`${styles.socialButton} ${styles.github}`}
            onClick={() => handleSocialLogin('GitHub')}
            aria-label="Login com GitHub"
          >
            <FaGithub className={styles.socialIcon} /> GitHub
          </button>
        </div>

        <p className={styles.signupText}>
          Não tem uma conta? <a href="#" className={styles.signupLink}>Cadastre-se</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
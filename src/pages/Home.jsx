import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { motion } from 'framer-motion';
import URL from '../service/url';

const Home = () => {
  const [userName, setUserName] = useState('Cliente'); 
  const logoPath = '/logo.jpeg'; 

 
  useEffect(() => {
  const buscarNome = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${URL}/usuario`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Erro ao buscar usuário');
      const data = await res.json();
      setUserName(data.nome || 'Cliente');
    } catch (err) {
      console.error(err);
      setUserName('Cliente');
    }
  };

  buscarNome();
}, []);


  const handleQuickAccessClick = (path) => {
    console.log(`Navegar para: ${path}`);
  };

  return (
    <div className={styles.pageWrapper}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <section className={styles.welcomeSection}>
          <motion.img
            src={logoPath}
            alt="Logo FrostSys"
            className={styles.logo}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          />
          <h1 className={styles.welcomeTitle}>Bem-vindo(a) de volta, <span>{userName}</span>!</h1>
          <p className={styles.welcomeSubtitle}>Pronto para impulsionar sua sorveteria hoje?</p>
        </section>
        
        <section className={styles.quickAccessSection}>
          <h2 className={styles.sectionTitle}>Acesso Rápido</h2>
          <div className={styles.quickAccessGrid}>
            <motion.div
              className={styles.quickAccessCard}
              whileHover={{ translateY: -5, boxShadow: '0 10px 25px rgba(0, 123, 255, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAccessClick('/dashboard')}
            >
              <span className={styles.quickAccessIcon}>📊</span>
              <h3>Dashboard</h3>
              <p>Visão geral e métricas</p>
            </motion.div>

            <motion.div
              className={styles.quickAccessCard}
              whileHover={{ translateY: -5, boxShadow: '0 10px 25px rgba(0, 123, 255, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAccessClick('/vendas')}
            >
              <span className={styles.quickAccessIcon}>💰</span>
              <h3>Vendas</h3>
              <p>Registrar e consultar</p>
            </motion.div>

            <motion.div
              className={styles.quickAccessCard}
              whileHover={{ translateY: -5, boxShadow: '0 10px 25px rgba(0, 123, 255, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAccessClick('/estoque')}
            >
              <span className={styles.quickAccessIcon}>📦</span>
              <h3>Estoque</h3>
              <p>Controle de produtos</p>
            </motion.div>

            <motion.div
              className={styles.quickAccessCard}
              whileHover={{ translateY: -5, boxShadow: '0 10px 25px rgba(0, 123, 255, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAccessClick('/producao')}
            >
              <span className={styles.quickAccessIcon}>🍦</span>
              <h3>Produção</h3>
              <p>Gerenciar receitas</p>
            </motion.div>

            <motion.div
              className={styles.quickAccessCard}
              whileHover={{ translateY: -5, boxShadow: '0 10px 25px rgba(0, 123, 255, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAccessClick('/relatorios')}
            >
              <span className={styles.quickAccessIcon}>📈</span>
              <h3>Relatórios</h3>
              <p>Análises detalhadas</p>
            </motion.div>

            <motion.div
              className={styles.quickAccessCard}
              whileHover={{ translateY: -5, boxShadow: '0 10px 25px rgba(0, 123, 255, 0.2)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleQuickAccessClick('/configuracoes')}
            >
              <span className={styles.quickAccessIcon}>⚙️</span>
              <h3>Configurações</h3>
              <p>Ajustes do sistema</p>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default Home;

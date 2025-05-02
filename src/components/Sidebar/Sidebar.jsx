import { useState } from 'react';
import styles from './Sidebar.module.css';
import { Link } from 'react-router-dom';
import {
    FaBars, FaPlus, FaUserPlus, FaBoxOpen, FaTruck,
    FaStore, FaCashRegister, FaFileInvoice, FaSearch,
    FaUsers, FaUser, FaShippingFast, FaHandshake
  } from 'react-icons/fa';
  
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [hovered, setHovered] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const menuItems = [
    {
      label: 'Cadastrar',
      icon: <FaPlus />,
      key: 'cadastrar',
      children: [
        { label: 'Cliente', path: '/cadastrar-cliente', icon: <FaUserPlus /> },
        { label: 'Produto', path: '/cadastrar-produto', icon: <FaBoxOpen /> },
        { label: 'Carrinho', path: '/cadastrar-carrinho', icon: <FaShippingFast /> },
        { label: 'Fornecedores', path: '/cadastrar-fornecedor', icon: <FaHandshake /> },
      ],
    },
    {
      label: 'Balcão',
      icon: <FaStore />,
      key: 'balcao',
      children: [
        { label: 'Venda', path: '/balcao/venda', icon: <FaCashRegister /> },
        { label: 'Saída', path: '/balcao/saida', icon: <FaFileInvoice /> },
      ],
    },
    {
      label: 'Atacado',
      icon: <FaCashRegister />,
      path: '/venda-atacado',
    },
    {
      label: 'Imprimir',
      icon: <FaFileInvoice />,
      path: '/imprimir',
    },
    {
  label: 'Consultar',
  icon: <FaSearch />,
  key: 'consultar',
  children: [
    { label: 'Cliente', path: '/consultar/cliente', icon: <FaUser /> },
    { label: 'Produto', path: '/consultar/produto', icon: <FaBoxOpen /> },
    { label: 'Fornecedores', path: '/consultar/fornecedores', icon: <FaHandshake /> },
    { label: 'Visão Geral', path: '/consultar/visao-geral', icon: <FaSearch /> },
    {
      label: 'Balcão - Venda',
      path: '/consultar/balcao/venda',
      icon: <FaCashRegister />,
    },
    {
      label: 'Balcão - Saída',
      path: '/consultar/balcao/saida',
      icon: <FaFileInvoice />,
    },
  ],
},
    {
      label: 'Vendedores',
      icon: <FaUsers />,
      key: 'vendedores',
      children: [
        { label: 'Antônio', path: '/vendedores/antonio', icon: <FaUser /> },
        { label: 'Dinalva', path: '/vendedores/dinalva', icon: <FaUser /> },
        { label: 'Daniel', path: '/vendedores/daniel', icon: <FaUser /> },
        { label: 'Plabo', path: '/vendedores/plabo', icon: <FaUser /> },
      ],
    },
  ];
  

  return (
    <motion.div
      className={styles.sidebar}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setOpenMenu(null);
      }}
      animate={{ width: hovered ? 230 : 60 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ícone de Menu Hamburguer no topo, sempre visível */}
      <div className={styles.menuItem}>
        <FaBars className={styles.icon} />
      </div>

      {/* Menu Principal */}
      {menuItems.map((item) => (
        <div key={item.label}>
          <div
            className={styles.menuItem}
            onClick={() => item.children ? toggleMenu(item.key) : null}
          >
            <div className={styles.icon}>{item.icon}</div>
            {hovered && <span>{item.label}</span>}
          </div>

          <AnimatePresence>
            {item.children && openMenu === item.key && hovered && (
              <motion.div
                className={styles.submenu}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.children.map((sub, idx) => (
                  <Link key={idx} to={sub.path} className={styles.submenuItem}>
                    {sub.icon && <div className={styles.icon}>{sub.icon}</div>}
                    <span>{sub.label}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  );
};

export default Sidebar;

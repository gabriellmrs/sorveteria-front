import { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import { Link } from 'react-router-dom';
import URL from '../../service/url';
import {
  FaBars, FaPlus, FaUserPlus, FaBoxOpen, FaTruck,
  FaStore, FaCashRegister, FaFileInvoice, FaSearch,
  FaUsers, FaUser, FaShippingFast, FaHandshake
} from 'react-icons/fa';

import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
  const [hovered, setHovered] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubMenus, setOpenSubMenus] = useState({});
  const [vendedores, setVendedores] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const res = await fetch(`${URL}/vendedor`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!res.ok) throw new Error('Erro ao buscar vendedores');
        const data = await res.json();
        setVendedores(data);
      } catch (error) {
        console.error(error);
        setVendedores([]);
      }
    };

    fetchVendedores();
  }, []);

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  const toggleSubMenu = (key) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
        { label: 'Atacado', path: '/consultar/atacado', icon: <FaCashRegister /> },
        { label: 'Carrinho', path: '/consultar/carrinho', icon: <FaShippingFast /> },
        {
          label: 'Balcão',
          icon: <FaStore />,
          key: 'consultar-balcao',
          isSubMenu: true,
          children: [
            { label: 'Venda', path: '/consultar/balcao/venda', icon: <FaCashRegister /> },
            { label: 'Saída', path: '/consultar/balcao/saida', icon: <FaFileInvoice /> },
          ],
        },
      ],
    },
    {
      label: 'Vendedores',
      icon: <FaUsers />,
      key: 'vendedores',
      children: vendedores.map((vendedor) => ({
        label: vendedor.NOME,
        path: `/vendedores/${vendedor.NOME.toLowerCase()}`,
        icon: <FaUser />
      })),
    },
  ];

  return (
    <motion.div
      className={styles.sidebar}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setOpenMenu(null);
        setOpenSubMenus({});
      }}
      animate={{ width: hovered ? 230 : 60 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ícone de Menu Hamburguer */}
      <Link to="/home" className={styles.menuItem}>
  <FaBars className={styles.icon} />
</Link>


      {/* Renderização dos menus */}
      {menuItems.map((item) => (
        <div key={item.label}>
          {item.path ? (
            <Link to={item.path} className={styles.menuItem}>
              <div className={styles.icon}>{item.icon}</div>
              {hovered && <span>{item.label}</span>}
            </Link>
          ) : (
            <div
              className={styles.menuItem}
              onClick={() => item.children ? toggleMenu(item.key) : null}
            >
              <div className={styles.icon}>{item.icon}</div>
              {hovered && <span>{item.label}</span>}
            </div>
          )}

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
                  <div key={idx}>
                    {sub.isSubMenu ? (
                      <div
                        className={styles.submenuItem}
                        onClick={() => toggleSubMenu(sub.key)}
                      >
                        <div className={styles.icon}>{sub.icon}</div>
                        <span>{sub.label}</span>
                      </div>
                    ) : (
                      <Link to={sub.path} className={styles.submenuItem}>
                        <div className={styles.icon}>{sub.icon}</div>
                        <span>{sub.label}</span>
                      </Link>
                    )}

                    <AnimatePresence>
                      {sub.isSubMenu && openSubMenus[sub.key] && (
                        <motion.div
                          className={styles.submenu}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {sub.children.map((child, childIdx) => (
                            <Link
                              key={childIdx}
                              to={child.path}
                              className={styles.submenuItem}
                            >
                              <div className={styles.icon}>{child.icon}</div>
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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

import { FaInfoCircle, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './ItemList.module.css';

const ItemList = ({ itens, campos, onDetalhes, onEditar, onExcluir }) => {
  return (
    <div className={styles.listaClientes}>
      {itens.map((item) => (
        <div key={item.ID} className={styles.clienteItem}>
          <div className={styles.clienteInfo}>
            {campos.map((campo) => (
              <p key={campo.key}>
                <strong>{campo.label}:</strong>{' '}
                {campo.format ? campo.format(item[campo.key]) : item[campo.key]}
              </p>
            ))}
          </div>
          <div className={styles.botoes}>
            {onDetalhes && (
              <button className={styles.info} onClick={() => onDetalhes(item)}>
                <FaInfoCircle />
              </button>
            )}
            {onEditar && (
              <button className={styles.editar} onClick={() => onEditar(item)}>
                <FaEdit />
              </button>
            )}
            {onExcluir && (
              <button className={styles.excluir} onClick={() => onExcluir(item.ID)}>
                <FaTrash />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;

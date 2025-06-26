import { useEffect } from 'react';
import styles from './Notification.module.css';
import { X } from 'lucide-react';

const Notification = ({ type, title, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 100000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.notification} ${type === 'success' ? styles.success : styles.error}`}>
      <div className={styles.header}>
        <strong>{title}</strong>
        <button onClick={onClose} className={styles.closeBtn}><X size={18} /></button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default Notification;

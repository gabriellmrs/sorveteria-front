import styles from './InputField.module.css';

const InputField = ({ inputRef, label, name, value, onChange, placeholder }) => {
  return (
    <div className={styles.inputWrapper}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        ref={inputRef}
        className={styles.input}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;

import { useState } from 'react';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';
import Notification from '../components/Notification/Notification';
import URL from '../service/url.js';
import styles from '../styles/Cadastrar.module.css';

const CadastrarFornecedor = () => {
  const [form, setForm] = useState({
    NOME: '',
    TELEFONE: '',
  });

  const [notificacao, setNotificacao] = useState(null);

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (!form.NOME.trim()) {
      return { valido: false, titulo: 'Erro de Validação', mensagem: 'O campo nome não pode estar vazio.' };
    }

    if (/[A-Za-z]/.test(form.TELEFONE)) {
      return { valido: false, titulo: 'Erro de Validação', mensagem: 'O campo telefone não pode conter letras.' };
    }

    return { valido: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validacao = validarFormulario();
    if (!validacao.valido) {
      setNotificacao({
        type: 'error',
        title: validacao.titulo,
        message: validacao.mensagem,
      });
      return;
    }

    try {
      const response = await fetch(`${URL}/fornecedor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nome: form.NOME,
          telefone: form.TELEFONE,
        }),
      });

      if (response.ok) {
        setNotificacao({
          type: 'success',
          title: 'Sucesso!',
          message: 'Fornecedor cadastrado com sucesso!',
        });

        setForm({
          NOME: '',
          TELEFONE: '',
        });
      } else {
        setNotificacao({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao cadastrar fornecedor.',
        });
      }
    } catch (err) {
      setNotificacao({
        type: 'error',
        title: 'Erro na requisição',
        message: 'Não foi possível conectar ao servidor.',
      });
    }
  };

  return (
    <div className={styles.container}>
      {notificacao && (
        <Notification
          type={notificacao.type}
          title={notificacao.title}
          message={notificacao.message}
          onClose={() => setNotificacao(null)}
        />
      )}

      <h2 className={styles.titulo}>CADASTRAR FORNECEDOR</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <InputField
            label="Nome"
            name="NOME"
            value={form.NOME}
            onChange={handleChange}
            placeholder="Nome do fornecedor"
          />
          <InputField
            label="Telefone"
            name="TELEFONE"
            value={form.TELEFONE}
            onChange={handleChange}
            placeholder="(xx) xxxxx-xxxx"
          />
        </div>

        <Button type="submit">CADASTRAR</Button>
      </form>
    </div>
  );
};

export default CadastrarFornecedor;

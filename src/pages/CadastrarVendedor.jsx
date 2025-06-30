import { useState } from 'react';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';
import Notification from '../components/Notification/Notification';
import URL from '../service/url.js';
import styles from '../styles/Cadastrar.module.css';

const CadastrarVendedor = () => {
  const [form, setForm] = useState({
    NOME: '',
    BAIRRO: '',
    RUA: '',
    NUMERO_CASA: '',
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
      const response = await fetch(`${URL}/vendedor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: form.NOME,
          bairro: form.BAIRRO,
          rua: form.RUA,
          numero_casa: form.NUMERO_CASA,
          telefone: form.TELEFONE,
        }),
      });

      if (response.ok) {
        setNotificacao({
          type: 'success',
          title: 'Sucesso!',
          message: 'Vendedor cadastrado com sucesso!',
        });

        setForm({
          NOME: '',
          BAIRRO: '',
          RUA: '',
          NUMERO_CASA: '',
          TELEFONE: '',
        });
      } else {
        setNotificacao({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao cadastrar vendedor.',
        });
      }
    } catch (err) {
      setNotificacao({
        type: 'error',
        title: 'Erro de Conexão',
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

      <h2 className={styles.titulo}>CADASTRAR VENDEDOR</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <InputField
            label="Nome"
            name="NOME"
            value={form.NOME}
            onChange={handleChange}
            placeholder="Nome do vendedor"
          />
          <InputField
            label="Telefone"
            name="TELEFONE"
            value={form.TELEFONE}
            onChange={handleChange}
            placeholder="(xx) xxxxx-xxxx"
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="Rua"
            name="RUA"
            value={form.RUA}
            onChange={handleChange}
            placeholder="Nome da rua"
          />
          <InputField
            label="Número"
            name="NUMERO_CASA"
            value={form.NUMERO_CASA}
            onChange={handleChange}
            placeholder="Número da casa"
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="Bairro"
            name="BAIRRO"
            value={form.BAIRRO}
            onChange={handleChange}
            placeholder="Bairro"
          />
        </div>

        <Button type="submit">CADASTRAR</Button>
      </form>
    </div>
  );
};

export default CadastrarVendedor;

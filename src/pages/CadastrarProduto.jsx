import { useState } from 'react';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';
import Notification from '../components/Notification/Notification';
import URL from '../service/url.js';
import styles from '../styles/Cadastrar.module.css';

const CadastrarProduto = () => {
  const [form, setForm] = useState({
    NOME: '',
    VALOR: '',
  });

  const [notificacao, setNotificacao] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (!form.NOME.trim()) {
      return { valido: false, titulo: 'Erro de Validação', mensagem: 'O campo nome não pode estar vazio.' };
    }

    if (form.VALOR === '' || isNaN(parseFloat(form.VALOR))) {
      return { valido: false, titulo: 'Erro de Validação', mensagem: 'O campo valor deve ser um número válido.' };
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
      const response = await fetch(`${URL}/produto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.NOME,
          valor: parseFloat(form.VALOR),
        }),
      });

      if (response.ok) {
        setNotificacao({
          type: 'success',
          title: 'Sucesso!',
          message: 'Produto cadastrado com sucesso!',
        });

        setForm({
          NOME: '',
          VALOR: '',
        });
      } else {
        const errorText = await response.text();
        setNotificacao({
          type: 'error',
          title: 'Erro',
          message: errorText || 'Erro ao cadastrar produto.',
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

      <h2 className={styles.titulo}>CADASTRAR PRODUTO</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <InputField
            label="Nome"
            name="NOME"
            value={form.NOME}
            onChange={handleChange}
            placeholder="Nome do produto"
          />
          <InputField
            label="Valor (R$)"
            name="VALOR"
            value={form.VALOR}
            onChange={handleChange}
            placeholder="Ex: 3.50"
          />
        </div>

        <Button type="submit">CADASTRAR</Button>
      </form>
    </div>
  );
};

export default CadastrarProduto;

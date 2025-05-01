import { useState } from 'react';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';
import Notification from '../components/Notification/Notification';
import URL from '../service/url.js'
import styles from '../styles/CadastrarCliente.module.css';

const CadastrarCliente = () => {
  //const URL = 'http://localhost:5000';

  const [form, setForm] = useState({
    NOME: '',
    ESTADO: '',
    CIDADE: '',
    BAIRRO: '',
    ENDERECO: '',
    TELEFONE: '',
    CNPJ_CPF: '',
  });

  const [notificacao, setNotificacao] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (!form.NOME.trim()) {
      return { valido: false, titulo: 'Erro de Validação', mensagem: 'O campo nome não pode estar vazio.' };
    }
  
    if (/[A-Za-z]/.test(form.CNPJ_CPF)) {
      return { valido: false, titulo: 'Erro de Validação', mensagem: 'O campo CNPJ/CPF não pode conter letras.' };
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
      const response = await fetch(`${URL}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setNotificacao({
          type: 'success',
          title: 'Sucesso!',
          message: 'Cliente cadastrado com sucesso!',
        });

        setForm({
          NOME: '',
          ESTADO: '',
          CIDADE: '',
          BAIRRO: '',
          ENDERECO: '',
          TELEFONE: '',
          CNPJ_CPF: '',
        });
      } else {
        setNotificacao({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao cadastrar cliente.',
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

      <h2 className={styles.titulo}>CADASTRAR CLIENTE</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <InputField
            label="Nome"
            name="NOME"
            value={form.NOME}
            onChange={handleChange}
            placeholder="Nome do cliente"
          />
          <InputField
            label="CNPJ ou CPF"
            name="CNPJ_CPF"
            value={form.CNPJ_CPF}
            onChange={handleChange}
            placeholder="00.000.000/0000-00"
          />
        </div>

        <div className={styles.row}>
          <InputField
            label="Telefone"
            name="TELEFONE"
            value={form.TELEFONE}
            onChange={handleChange}
            placeholder="(xx) xxxxx-xxxx"
          />
          <InputField
            label="Endereço"
            name="ENDERECO"
            value={form.ENDERECO}
            onChange={handleChange}
            placeholder="Rua"
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
          <InputField
            label="Cidade"
            name="CIDADE"
            value={form.CIDADE}
            onChange={handleChange}
            placeholder="Cidade"
          />
          <InputField
            label="Estado"
            name="ESTADO"
            value={form.ESTADO}
            onChange={handleChange}
            placeholder="UF"
          />
        </div>

        <Button type="submit" >CADASTRAR</Button>
      </form>
    </div>
  );
};

export default CadastrarCliente;

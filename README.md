# ❄️ FrostSys – Sistema de Gestão para Sorveterias - Frontend

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)


Bem-vindo ao **FrostSys**, um sistema moderno e eficiente para gerenciamento de sorveterias. Este repositório contém o **frontend da aplicação**, desenvolvido em React com foco em performance, usabilidade e design responsivo.

<img width="1918" height="906" alt="Image" src="https://github.com/user-attachments/assets/7e4260df-62df-42b0-ae8f-55a8a172cb45" />

---

## 🔍 Funcionalidades principais

- Login seguro com JWT, com autenticação via e-mail e senha.
- Recuperação de senha.
- Visualização do nome do usuário na tela inicial.
- Visualização de totais de vendas e saidas com filtros personalizados e com dados dinâmicos.
- Gestão de clientes, produtos, fornecedores, vendedore, saidas e vendas.
- Responsivo para dispositivos móveis.
- Sistema de recuperação de senha por e-mail.
- Barra lateral (Sidebar) intuitiva para facilitar a navegação.

---

## ⚙️ Tecnologias utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [CSS Modules](https://github.com/css-modules/css-modules)

---

## 🔗 Backend e Integrações

- API em Node.js hospedada no [Render](https://render.com/)
- Banco de dados MySQL hospedado no [Railway](https://railway.app/)
- Envio de e-mails via Gmail SMTP

---

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas na sua máquina:

- **React** 
- **npm** ou **yarn**
- **Git**
- Um banco de dados configurado no **Railway**

## 📦 Instalação local


```bash
# Clone o repositório
git clone https://github.com/seu-usuario/frostsys-frontend.git

# Acesse a pasta
cd frostsys-frontend

# Instale as dependências
npm install

# Crie o arquivo .env com a URL da API
VITE_API_URL=https://sua-api-no-render.onrender.com

# Execute o projeto
npm run dev
```
---

## 📁 Estrutura de pastas
```bash
src/
├── components/       # Componentes reutilizáveis
├── pages/            # Telas do sistema (Home, Login, etc)
├── service/          # Serviços de API (url.js)
├── styles/           # Estilos CSS Modules
└── App.jsx           # Roteamento principal
```

---

## 🔧 Melhorias Futuras
A aplicação ainda pode evoluir bastante. Algumas funcionalidades previstas para versões futuras incluem:
- 🧾 **Impressão de notas:** Geração e impressão de comprovantes de venda e notas simplificadas.
- 📊 **Dashboards interativos:** Gráficos e indicadores visuais para facilitar o acompanhamento do desempenho da sorveteria.
- 📦 **Gestão de estoque:** Controle completo de entrada, saída e alertas de baixo estoque.
- 🍦 **Controle de produção:** Registro das receitas, insumos e previsões de produção diária ou semanal.
- 📈 **Relatórios detalhados:** Geração de relatórios personalizados com filtros por período, produto, cliente e vendedor.
- ⚙️ **Módulo de configurações:** Tela de configurações para personalizar o sistema (dados da empresa, preferências de visualização, permissões etc).

## 📩 Contato

Caso tenha dúvidas ou sugestões, entre em contato:

- **E-mail**: [gabrielmoraiss755@gmail.com](mailto:gabrielmoraiss755@gmail.com)
- **LinkedIn**: [Gabriel Morais](https://www.linkedin.com/in/gabriel-morais-649016295/)
- **GitHub**: [gabriellmrs](https://github.com/gabriellmrs)




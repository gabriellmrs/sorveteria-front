import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home';
import CadastrarCliente from './pages/CadastrarCliente';
import CadastrarProduto from './pages/CadastrarProduto';
import ConsultarCliente from './pages/ConsultarCliente';
import CadastrarFornecedor from './pages/CadastrarFornecedor';
import ConsultarProduto from './pages/ConsultarProduto';
import ConsultarFornecedor from './pages/ConsultarFornecedor';
import RegistrarVenda from './pages/RegistrarVenda';
import ConsultarVendas from './pages/ConsultarVendas';
import RegistrarSaida from './pages/RegistrarSaida';
import ConsultarSaida from './pages/ConsultarSaida';
import CadastrarVendaCliente from './pages/CadastrarVendaCliente';
import ConsultarVendaAtacado from './pages/ConsultarVendaAtacado';
import CadastrarVendedor from './pages/CadastrarVendedor';
import ConsultarVendedor from './pages/ConsultarVendedor';

function App() {
  return (
    <Router>
      <Sidebar />
      <div style={{ marginLeft: '60px', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastrar-cliente" element={<CadastrarCliente />} />
          <Route path="/cadastrar-produto" element={<CadastrarProduto />} />
          <Route path="/cadastrar-fornecedor" element={<CadastrarFornecedor />} />
          <Route path="/cadastrar-carrinho" element={<CadastrarVendedor />} />
          <Route path="/consultar/cliente" element={<ConsultarCliente />} />
          <Route path="/consultar/produto" element={<ConsultarProduto />} />
          <Route path="/consultar/fornecedores" element={<ConsultarFornecedor />} />
          <Route path="/consultar/carrinho" element={<ConsultarVendedor />} />
          <Route path="/consultar/balcao/venda" element={<ConsultarVendas />} />
          <Route path="/consultar/balcao/saida" element={<ConsultarSaida />} />
          <Route path="/balcao/venda" element={<RegistrarVenda/>} />
          <Route path="/balcao/saida" element={<RegistrarSaida/>} />
          <Route path="/venda-atacado" element={<CadastrarVendaCliente/>} />
          <Route path="/consultar/atacado" element={<ConsultarVendaAtacado />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

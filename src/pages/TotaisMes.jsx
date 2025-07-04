import { useState } from 'react';
import styles from '../styles/TotaisMes.module.css';
import URL from '../service/url';

export default function TotaisMes() {
    const [mes, setMes] = useState('');
    const [ano, setAno] = useState('');
    const [dados, setDados] = useState(null);
    const [erro, setErro] = useState('');

    const buscarDados = async () => {
        setErro('');
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${URL}/totais-mensais`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ mes, ano })
            });

            if (!response.ok) throw new Error('Erro ao buscar dados');
            const resultado = await response.json();
            setDados(resultado);
        } catch (err) {
            setErro('Erro ao buscar dados');
            setDados(null);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.titulo}>Resumo Financeiro</h1>
            <div className={styles.inputs}>
                <input type="number" placeholder="Mês" value={mes} onChange={e => setMes(e.target.value)} />
                <input type="number" placeholder="Ano" value={ano} onChange={e => setAno(e.target.value)} />
                <button onClick={buscarDados}>Buscar</button>
            </div>
            {erro && <p className={styles.erro}>{erro}</p>}
            {dados && (
                <div className={styles.cards}>
                    <div className={`${styles.card} ${styles.liquido}`}>
                        <h2>Total Líquido</h2>
                        <p>R$ {dados.total_liquido.toFixed(2)}</p>
                    </div>

                    <div className={`${styles.card} ${styles.bruto}`}>
                        <h3>Total Bruto</h3>
                        <p>R$ {dados.total_bruto.toFixed(2)}</p>
                    </div>

                    <div className={`${styles.card} ${styles.saida}`}>
                        <h3>Total Saída</h3>
                        <p>R$ {dados.total_saida.toFixed(2)}</p>
                    </div>

                    <div className={`${styles.card} ${styles.carrinho}`}>
                        <h3>Carrinho</h3>
                        <p>R$ {dados.total_carrinho.toFixed(2)}</p>
                    </div>

                    <div className={`${styles.card} ${styles.atacado}`}>
                        <h3>Atacado</h3>
                        <p>R$ {dados.total_atacado.toFixed(2)}</p>
                    </div>

                    <div className={`${styles.card} ${styles.balcao}`}>
                        <h3>Balcão</h3>
                        <p>R$ {dados.total_balcao.toFixed(2)}</p>
                    </div>
                </div>


            )}
        </div>
    );
}

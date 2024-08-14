import React, { useState, useEffect } from 'react';
import { Stock, TipoTransacao } from '../../models/models'
import { buildTransacao, saveTransacao } from '../../services/TransactionService';
import {checkPosicao} from '../../services/PositionService';
import { formatter } from '../../utils/utils';
import { useNavigate } from 'react-router-dom';
import './comprar.css'

const Comprar = () => {
  const [ticker, setTicker] = useState('');
  const [preco, setPreco] = useState(0);
  const [quantidade, setQuantidade] = useState(0);
  const [valorTotalEstimado, setValorTotalEstimado] = useState(0);
  const [limiteDisponivel, setLimiteDisponivel] = useState(0);
  const [saldoProjetado, setSaldoProjetado] = useState(0);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  const navigate = useNavigate();

  useEffect(() => {
    if (ticker) {
      const url = `https://yahoo-finance127.p.rapidapi.com/price/${ticker}`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '7bd6b6f80fmsha685cb1edf6ca91p156100jsn090b67a68c9e',
          'x-rapidapi-host': 'yahoo-finance127.p.rapidapi.com',
        },
      };

      fetch(url, options)
        .then((response) => response.json())
        .then((data) => {
          const preco = data.regularMarketPrice.raw;
          console.log(preco)
          setPreco(preco);
        })
        .catch((error) => {
          console.error('Erro ao buscar o preço:', error);
        });
    }
  }, [ticker]);

  useEffect(() => {
    const valorTotal = preco * quantidade;
    const limiteDisponivel = user.saldo * 2;
    const saldoProjetado = user.saldo - valorTotal;

    setValorTotalEstimado(valorTotal);
    setLimiteDisponivel(limiteDisponivel);
    setSaldoProjetado(saldoProjetado);
  }, [preco, quantidade, user.saldo]);

  const handleComprar = () => {
    try {
      validatePurchase(quantidade, preco);

      const stock = new Stock({
        ticker: String(ticker).toUpperCase(),
        preco: preco,
      });
      const transaction = buildTransacao(stock, quantidade, TipoTransacao.COMPRA);

      checkPosicao(transaction, user)
        .then(() => saveTransacao(transaction, user.id))
        .then(() => {
          navigate('/home')
        })
        .catch((error) => {
          console.error('Erro ao salvar transação ou atualizar informações do usuário:', error);
        });
    } catch (error) {
      console.error('Erro ao validar compra:', error);
    }
  };

  const validatePurchase = (quantidade, preco) => {
    if (quantidade <= 0) {
      throw new Error('Quantidade inválida. Insira um valor válido maior que zero.');
    }
    if (preco <= 0) {
      throw new Error('Preço inválido. Insira um valor válido maior que zero.');
    }
    if (quantidade * preco > user.saldo) {
      throw new Error('Saldo Insuficiente');
    }
  };

  return (
    <div className="comprar-container">
      <form className="comprar-form" onSubmit={handleComprar}>
        <ul>
          <li>
            <input className="comprar-input"
              type="text"
              id="ticker"
              placeholder="Digite um ativo"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
          </li>
          <li>
            <span id="preco">{formatter.format(preco)}</span>
          </li>
        </ul>

        <label htmlFor="quantidade">Quantidade</label>
        <input className="comprar-input"
          type="number"
          id="quantidade"
          step="1"
          value={quantidade}
          onChange={(e) => setQuantidade(parseFloat(e.target.value))}
        />
      </form>

      <section className="comprar-tabela-section">
        <ul>
          <li>
            <span className="comprar-tabela-label">Valor total estimado</span>
            <span id="valor-total-estimado">{formatter.format(valorTotalEstimado)}</span>
          </li>
          <li>
            <span className="comprar-tabela-label">Limite disponível</span>
            <span id="limite-disponivel">{formatter.format(limiteDisponivel)}</span>
          </li>
          <li>
            <span className="comprar-tabela-label">Saldo Projetado</span>
            <span id="saldo-projetado">{formatter.format(saldoProjetado)}</span>
          </li>
        </ul>
      </section>

      <button type="button" className="comprar-btn" onClick={handleComprar}>
        <div className="subitem-container">
          <span className="btn-label">COMPRAR</span>
        </div>
      </button>
    </div>
  );
};

export default Comprar;

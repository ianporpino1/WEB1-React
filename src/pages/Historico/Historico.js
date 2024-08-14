import React, { useEffect, useState } from 'react';
import { fetchTransactions } from '../../services/TransactionService';
import { formatter, dateFormatter } from '../../utils/utils';
import './historico.css'
import configSlidersIcon from './icons/config-sliders.svg';

function Historico() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [periodo, setPeriodo] = useState('ALL');
  const [operacao, setOperacao] = useState('TODAS');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);
    if (user && user.id) {
    fetchTransactions(user.id)
      .then(fetchedTransactions => {
        setUser(user);
        setTransactions(fetchedTransactions);
        setFilteredTransactions(fetchedTransactions);
      })
      .catch(error => {
        console.error('Houve um problema ao recuperar transações:', error);
      });
    }
  }, []);


  const handleFormSubmit = (event) => {
    event.preventDefault();
    const hoje = new Date();
    let filtered;
    let dataInicio
    if (periodo === 'ALL') {
      dataInicio = null
    }
    else {
      dataInicio = new Date(hoje);
      dataInicio.setDate(hoje.getDate() - periodo);
      dataInicio.setHours(0,0,0,0)
    }

    filtered = filterTransactions(transactions, dataInicio, operacao);
  
    setFilteredTransactions(filtered);
  };


  const filterTransactions = (transactions, dataInicio, operacao) => {
    return transactions.filter(transaction => {
      const dataTransacao = new Date(transaction.data);
      const tipoValido = operacao === 'TODAS' || transaction.tipoTransacao === operacao;

      return (!dataInicio || dataTransacao > dataInicio) && tipoValido;
    });
  };

  
  return (
    <>
      <div className="historico">
      <div className="info">
        <h1 className="titulo">HISTÓRICO</h1>
        <h2>SALDO EM CONTA</h2>
        <h3 className="green">{formatter.format(user?.saldo || 0)}</h3>
      </div>
      <div className="filtro-container">
        <div className="filtro-title">
        <img src={configSlidersIcon} alt="Ícone de Filtros" />
          <h3 className="filtro-text">FILTROS</h3>
        </div>
        <form className="filtro" id="filtro-form" onSubmit={handleFormSubmit}>
          <div className="filtro-item">
            <label htmlFor="periodo">PERÍODO</label>
            <select id="periodo" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
              <option value="0">Hoje</option>
              <option value="5">5 dias</option>
              <option value="15">15 dias</option>
              <option value="30">30 dias</option>
              <option value="ALL">Todos os períodos</option>
            </select>
          </div>
          <div className="filtro-item">
            <label htmlFor="operacao">OPERAÇÃO</label>
            <select id="operacao" value={operacao} onChange={(e) => setOperacao(e.target.value)}>
              <option value="TODAS">Todas</option>
              <option value="COMPRA">Compra</option>
              <option value="VENDA">Venda</option>
              <option value="DEPOSITO">Depósito</option>
              <option value="SAQUE">Saque</option>
            </select>
          </div>
          <input type="submit" value="FILTRAR" />
        </form>
      </div>

      {filteredTransactions.length > 0 ? (
            <HistoricoTable transactions={filteredTransactions} />
        ) : (
        <div className="no-transactions">Nenhuma transacao encontrada.</div>
      )}
    </div>
    </>
  );
}

export default Historico;

function HistoricoTable(props){
  return (
    <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>DATA</th>
              <th>DESCRIÇÃO</th>
              <th>OPERAÇÃO</th>
              <th>MOVIMENTAÇÃO ($)</th>
            </tr>
          </thead>
          <tbody>
          {props.transactions.map(transaction => renderTransaction(transaction))}
          </tbody>
        </table>
      </div>
  )
}

function getDescricao(transaction) {
  switch (transaction.tipoTransacao) {
    case 'COMPRA':
      return `${transaction.tipoTransacao} - ${transaction.quantidade}x ${formatter.format(transaction.stock.preco)} - ${transaction.stock.ticker}`;
    case 'VENDA':
      return `${transaction.tipoTransacao} - ${transaction.quantidade}x ${formatter.format(transaction.stock.preco)} - ${transaction.stock.ticker}`;
    case 'DEPOSITO':
      return 'Depósito';
    case 'SAQUE':
      return 'Saque';
    default:
      return '';
  }
}

function getOperacao(transaction) {
  switch (transaction.tipoTransacao) {
    case 'COMPRA':
      return 'Débito';
    case 'VENDA':
      return 'Crédito';
    case 'DEPOSITO':
      return 'Crédito';
    case 'SAQUE':
      return 'Débito';
    default:
      return '';
  }
}

function getMovimentacao(transaction) {
  switch (transaction.tipoTransacao) {
    case 'COMPRA':
      return formatter.format(transaction.totalTransacao);
    case 'VENDA':
      return formatter.format(-transaction.totalTransacao);
    case 'DEPOSITO':
      return formatter.format(transaction.totalTransacao);
    case 'SAQUE':
      return formatter.format(-transaction.totalTransacao);
    default:
      return '';
  }
}

function getMovimentacaoClass(transaction) {
  return transaction.tipoTransacao === 'COMPRA' || transaction.tipoTransacao === 'SAQUE'
    ? 'red'
    : 'green';
}


function renderTransaction(transaction){
  return (
    <tr key={transaction.id} className="nav-item">
      <td>{dateFormatter.format(transaction.data)}</td>
      <td>{getDescricao(transaction)}</td>
      <td>{getOperacao(transaction)}</td>
      <td className={getMovimentacaoClass(transaction)}>{getMovimentacao(transaction)}</td>
    </tr>
  );
};
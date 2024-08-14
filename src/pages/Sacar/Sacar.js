import React, { useState, useEffect } from 'react';
import { TipoTransacao } from '../../models/models';
import { buildTransacao, saveTransacao } from '../../services/TransactionService';
import { saveSaldo } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { formatter } from '../../utils/utils';
import './sacar.css'


function Sacar() {
  const [amount, setAmount] = useState('');
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  const navigate = useNavigate();

  useEffect(() => {
    const spanSaque = document.getElementById('saldo-disponivel');
    if (spanSaque) {
      spanSaque.textContent = formatter.format(user.saldo);
    }
  }, [user.saldo]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const sanitizedAmount = amount.replace(/[^\d,]/g, '');
    const valor = -(parseFloat(sanitizedAmount.replace(',', '.')));

    const transaction = buildTransacao(null, valor, TipoTransacao.SAQUE);

    try {
      validateSaque(-valor);

      await saveTransacao(transaction, user.id);
      await saveSaldo(valor,user);

      navigate('/home')
    } catch (error) {
      console.error('Erro ao salvar transação ou atualizar informações do usuário:', error);
    }
  };


  const handleAmountChange = (event) => {
    let value = event.target.value;

    value = value.replace(/\D/g, '');
    value = value.replace(/(\d)(\d{2})$/, '$1,$2');
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    setAmount(`$${value}`);
  };

  const validateSaque = (value) => {
    if(value < 0){
      throw Error('valor invalido')
    }

  if(value > user.saldo){
      throw Error('valor invalido')
    }
  };


  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Saque</h1>
      <div className="row justify-content-center">
        <div className="card-container col-md-6">
          <div className="card text-white mb-3">
            <div className="card-header" >
            Realizar Saque
            </div>
            <div className="card-body">
              <div className="mt-3">
                  <p>Saldo disponível para saque: <span id="saldo-disponivel"></span></p>
                </div>
              <form id="saque-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="amount">Valor do Saque</label>
                  <input
                    type="text"
                    className="form-control"
                    id="amount"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Digite o valor"
                    required
                  />
                </div>
                <button type="submit" id='btn-sacar' className="btn btn-primary btn-block">Sacar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sacar;
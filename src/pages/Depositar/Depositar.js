import React, { useState } from 'react';
import { TipoTransacao } from '../../models/models';
import { buildTransacao, saveTransacao } from '../../services/TransactionService';
import { saveSaldo } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import './depositar.css'

function Depositar() {
  const [amount, setAmount] = useState('');
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  const navigate = useNavigate();


  const handleSubmit = async (event) => {
    event.preventDefault();
    const sanitizedAmount = amount.replace(/[^\d,]/g, '');
    const valor = parseFloat(sanitizedAmount.replace(',', '.'));

    const transaction = buildTransacao(null, valor, TipoTransacao.DEPOSITO);

    try {
      validateDeposit(valor);

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

  const validateDeposit = (value) => {
    if (value < 0 || value > 1000000) {
      throw new Error('valor invalido');
    }
  };
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Depósito</h1>
      <div className="row justify-content-center">
        <div className="card-container col-md-6">
          <div className="card text-white mb-3">
            <div className="card-header" >
              Realizar Depósito
            </div>
            <div className="card-body">
              <form id="deposit-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label id='depositar-label' htmlFor="amount">Valor do Depósito</label>
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
                <button type="submit" id='btn-depositar' className="btn btn-primary btn-block">Depositar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Depositar;
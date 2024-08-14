import React, { useState, useEffect } from 'react';

import { getUserById } from '../../services/UserService';
import {  fetchPositions } from '../../services/PositionService';
import './home.css'
import { formatter } from '../../utils/utils';

function Home() {
  const [user, setUser] = useState(null);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const user = JSON.parse(userData);

    if (user && user.id) {
      getUserById(user.id)
        .then(async user => {
          localStorage.setItem('user', JSON.stringify(user));
          const positions = await fetchPositions(user);
          return { user, positions };
        })
        .then(({ user, positions }) => {
          setUser(user);
          setPositions(positions);
          setLoading(false);
        })
        .catch(error => {
          setError(error.message);
          setLoading(false);
        });
    } else {
      setError('No user data found');
      setLoading(false);
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="main-section">
        <h1 className="titulo">PORTFOLIO</h1>
      {user && (
        <>
          <h2>
            TOTAL INVESTIDO <b className="orange">{formatter.format(user.totalInvestido)}</b>
          </h2>
          <h2>SALDO EM CONTA {formatter.format(user.saldo)}</h2>
        </>
      )}

        {positions.length > 0 ? (
            <Portfolio positions={positions} />
        ) : (
        <div className="no-positions">Nenhuma posição encontrada.</div>
      )}
    </div>
  );
}

export default Home;


function Portfolio(props){
    return(
        <div className="container investments">
            <table id="portfolio-table" className="table table-dark table-hover table-dark-custom">
                <thead>
                <tr>
                    <th>NOME</th>
                    <th>QUANTIDADE</th>
                    <th>PREÇO MÉDIO</th>
                    <th>VALOR TOTAL</th>
                </tr> 
                </thead>
                <tbody>
                {props.positions.map(position => (
              <tr key={position.id} className="nav-item">
                <td>{position.stock.ticker}</td>
                <td>{position.quantidadeTotal}</td>
                <td>{formatter.format(position.precoMedio)}</td>
                <td>{formatter.format(position.totalPosicao)}</td>
              </tr>
            ))}
                </tbody>
            </table>
        </div>
    )
}
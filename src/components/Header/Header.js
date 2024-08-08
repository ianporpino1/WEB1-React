import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="cabecalho" id="home">
      <nav className="menu">
        <ul>
          <li> <Link to={`home`}>Home</Link> </li>
          <li> <Link to={`comprar`}>Comprar</Link> </li>
          <li> <Link to={`vender`}>Vender</Link></li>
          <li> <Link to={`historico`}>Historico</Link></li>
          <li> <Link to={`imposto`}>Imposto</Link></li>
          <li> <Link to={`depositar`}>Depositar</Link></li>
          <li> <Link to={`sacar`}>Sacar</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;

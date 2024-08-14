import React, { useState } from 'react';
import './cadastro.css';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../../models/models'
import { getUsers, addUser } from '../../services/UserService'

function Cadastro() {
  return (
    <>
      <div className="cadastro-container">
        <Form></Form>
      </div>
    </>
  );
}

export default Cadastro;

function Form() {
  const [formData, setFormData] = useState({
    email: '',
    cpf: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const validateAndRegister = async (email, password, cpf) => {
    setMessage(''); 

    try {
      const users = await getUsers();

      const cpfExists = users.some(user => user.cpf === cpf);
      if (cpfExists) {
        setMessage('Erro: CPF já cadastrado.');
        return;
      }

      const emailExists = users.some(user => user.email === email);
      if (emailExists) {
        setMessage('Erro: Email já cadastrado.');
        return;
      }

      const user = new User({
        email: email,
        password: password,
        cpf: cpf,
        saldo: 0,
        totalInvestido: 0
      });

      await addUser(user);
      navigate('/login');
    } catch (error) {
      setMessage('Erro: ' + error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validateAndRegister(formData.email, formData.password, formData.cpf);
  };

  return (
    <form className="cadastro-form" id="cadastro-form" onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="cpf">CPF</label>
      <input
        type="text"
        pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
        id="cpf"
        name="cpf"
        value={formData.cpf}
        onChange={handleInputChange}
        required
      />

      <label htmlFor="password">Senha</label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        required
      />

      <div className="button-container">
        <input className="btn-limpar" type="reset" value="LIMPAR" />
        <input className="btn-enviar" type="submit" value="ENVIAR" />
      </div>

      {message && <p className="error-message">{message}</p>}
      <Link to="/login" className="redirect-link">Já cadastrado?</Link>
    </form>
  );
}
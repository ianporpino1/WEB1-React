import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyUser } from '../../services/UserService';
import './login.css'

function Login() {

  return (
    <div className="login-container">
      <Form></Form>
    </div>
  );
}

export default Login;

function Form(){
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate(); 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userData = await verifyUser(formData.email, formData.password);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log(userData);
      navigate('/home')
    } catch (error) {
      alert(`Erro ao fazer login: ${error.message}`);
    }

  }

  return(
    <form className="login-form" id="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input 
        type="email" 
        id="email" 
        name="email"
        onChange={handleInputChange}
        required />
        
        <label htmlFor="senha">Senha</label>
        <input 
        type="password" 
        id="password" 
        name="password"
        onChange={handleInputChange}
        required />
        
        <div className="button-container">
          <input className="btn-limpar" type="reset" value="LIMPAR" />
          <input className="btn-enviar" type="submit" value="ENVIAR" />
        </div>
      </form>
  )
}
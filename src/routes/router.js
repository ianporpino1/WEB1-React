import { createBrowserRouter } from 'react-router-dom';
import Cadastro from '../pages/Cadastro/Cadastro';
import Home from '../pages/Home/Home';
import Comprar from '../pages/Comprar/Comprar';
import Vender from '../pages/Vender/Vender';
import Depositar from '../pages/Depositar/Depositar';
import Login from '../pages/Login/Login';
import Sacar from '../pages/Sacar/Sacar';
import Historico from '../pages/Historico/Historico';
import Imposto from '../pages/Imposto/Imposto';

import AuthLayout from '../layouts/AuthLayout';
import DefaultLayout from '../layouts/DefaultLayout';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout />, 
        children: [
          { path: 'home', element: <Home /> },
          { path: 'comprar', element: <Comprar /> },
          { path: 'vender', element: <Vender /> },
          { path: 'depositar', element: <Depositar /> },
          { path: 'sacar', element: <Sacar /> },
          { path: 'historico', element: <Historico /> },
          { path: 'imposto', element: <Imposto /> },
        ],
      },
      {
        path: '/',
        element: <AuthLayout />, 
        children: [
          { path: 'login', element: <Login /> },
          { path: 'cadastro', element: <Cadastro /> },
        ],
      },
    ]);
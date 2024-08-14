import { User } from "../models/models.js";


const firebaseURL = 'https://web-1-un2-2e85b-default-rtdb.firebaseio.com'

export async function getUsers() {
    const response = await fetch(`${firebaseURL}/users.json`);
    if (!response.ok) {
        throw new Error('Resposta de rede não foi ok');
    }
    const usersData = await response.json();
    return usersData ? Object.values(usersData) : [];
}

export async function addUser(user) {
    return fetch(`${firebaseURL}/users.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
    .then(response => {
      if (!response.ok) {
          throw new Error('Resposta de rede não foi ok');
      }
  });
}

export async function verifyUser(email, password) {
    const response = await fetch(`${firebaseURL}/users.json`);
    if (!response.ok) {
        throw new Error('Erro ao buscar usuários.');
    }
    const usersData = await response.json();
    
    for (let key in usersData) {
        const user = usersData[key];
        
        if (user.email === email && user.password === password) {
            return { id: key, ...user }; 
        }
    }
    throw new Error('Usuário ou senha inválidos.');
}




export async function getUserById(userId) {
    const firebaseUrl = `https://web-1-un2-2e85b-default-rtdb.firebaseio.com/users/${userId}.json`;

    try {
        const response = await fetch(firebaseUrl);

        if (!response.ok) {
            throw new Error('Erro ao buscar usuário.');
        }

        const userData = await response.json();

        if (!userData) {
            throw new Error('Usuário não encontrado.');
        }

        
        const user = new User({
            id: userId,
            email: userData.email,
            password: userData.password,
            cpf: userData.cpf,
            saldo: userData.saldo,
            totalInvestido: userData.totalInvestido //soma dos investimentos e saldo
            
        });
        
        return user;
    } catch (error) {
        console.error('Erro ao recuperar usuário:', error);
        throw error;
    }
}

export async function updateUserInfo(transaction, resultadoFinanceiro = 0, user){
    user.saldo -= transaction.totalTransacao
    user.totalInvestido += transaction.totalTransacao + resultadoFinanceiro
    const data = 
    {
        saldo: Math.round(user.saldo * 100) / 100,
        totalInvestido: user.totalInvestido
    }
    const response = await fetch(`${firebaseURL}/users/${user.id}.json`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Resposta de rede não foi ok');
    }
}


export async function saveSaldo(valor, user){
    user.saldo += valor
    const data = 
    {
        saldo: user.saldo,

    }
    const response = await fetch(`https://web-1-un2-2e85b-default-rtdb.firebaseio.com/users/${user.id}.json`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Resposta de rede não foi ok');
    }
}
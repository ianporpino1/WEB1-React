import { Transaction, TipoTransacao } from "../models/models.js";

export async function fetchTransactions(userId){                                                          
    const response = await fetch(`https://web-1-un2-2e85b-default-rtdb.firebaseio.com/users/${userId}/transactions.json`);
    if (!response.ok) {
        throw new Error('Resposta de rede não foi ok');
    }
    const transactions = await response.json();
    const transactionsList = [];
    for (let key in transactions) {
        const transaction = new Transaction({
            id: key,
            stock: transactions[key].stock,
            quantidade: transactions[key].quantidade,
            totalTransacao: transactions[key].totalTransacao,
            tipoTransacao: transactions[key].tipoTransacao,
            data: transactions[key].data
        });
        console.log(transaction);
        transactionsList.push(transaction);
    }
    return transactionsList;
}


export function buildTransacao(stock, quantidade, tipoTransacao){
    if(tipoTransacao === TipoTransacao.COMPRA){
        return buildTransacaoCompra(stock,quantidade)
    } else if(tipoTransacao === TipoTransacao.VENDA){
        return buildTransacaoVenda(stock,quantidade)
    } else if(tipoTransacao === TipoTransacao.DEPOSITO){
        return buildTransacaoDeposito(quantidade)
    } else if(tipoTransacao === TipoTransacao.SAQUE){
        return buildTransacaoSaque(quantidade)
    }
}

function buildTransacaoSaque(valor){
    return new Transaction({
        quantidade: 1,
        totalTransacao: valor,
        tipoTransacao: TipoTransacao.SAQUE
    })
}

function buildTransacaoDeposito(valor){
    return new Transaction({
        quantidade: 1,
        totalTransacao: valor,
        tipoTransacao: TipoTransacao.DEPOSITO
    })
}

function buildTransacaoCompra(stock, quantidade){
    return new Transaction({
        stock: stock,
        quantidade: quantidade,
        totalTransacao: stock.preco * quantidade,
        tipoTransacao: TipoTransacao.COMPRA
    })
}

function buildTransacaoVenda(stock, quantidade){
    return new Transaction({
        stock: stock,
        quantidade: quantidade,
        totalTransacao: -(stock.preco * quantidade),
        tipoTransacao: TipoTransacao.VENDA
    })
}

export async function saveTransacao(transaction, userId){
    const response = await fetch(`https://web-1-un2-2e85b-default-rtdb.firebaseio.com/users/${userId}/transactions.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
    });
    if (!response.ok) {
        throw new Error('Resposta de rede não foi ok');
    }
}
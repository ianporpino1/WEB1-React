import { Result } from '../models/models'

export async function saveResult(result, userId){
    return fetch(`https://web-1-un2-2e85b-default-rtdb.firebaseio.com/users/${userId}/results.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Resposta de rede não foi ok');
        }
    });
}

export async function fetchResultsByData(mes, ano, userId){
    const response = await fetch(`https://web-1-un2-2e85b-default-rtdb.firebaseio.com/users/${userId}/results.json?orderBy="ano"&equalTo=${ano}`);
    if (!response.ok) {
        throw new Error('Resposta de rede não foi ok');
    }
    const results = await response.json();
    console.log(results)
    const resultsList = [];
    Object.entries(results).filter(([id, result]) => result.mes === mes)
        .forEach(([id, filteredResult]) => {
            const result = new Result({
                id: id, 
                resultado: filteredResult.resultado,
                rentabilidade: filteredResult.rentabilidade,
                ticker: filteredResult.ticker,
                volume: filteredResult.volume,
                mes: filteredResult.mes,
                ano: filteredResult.ano
            });
            resultsList.push(result);
        });
        console.log(resultsList)
        return resultsList
}
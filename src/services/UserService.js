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
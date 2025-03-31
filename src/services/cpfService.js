const connect = require("../db/connect");

module.exports = async function cpfService(cpf, userId = null) {
  return new Promise((resolve, reject) => {
    const query = "SELECT cpf FROM user WHERE cpf = ?";
    const values = [cpf];

    connect.query(query, values, (err, results) => {
      if (err) {
        console.log(err);
        reject("Erro ao verificar CPF");
      } else if (results.length > 0) {
        const cpfCadastrado = results[0].cpf;

        if (userId && cpfCadastrado != userId) {
          resolve({ error: "CPF já cadastrado para outro usuário" });
        } else if (!userId) {
          resolve({ error: "CPF já cadastrado" });
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

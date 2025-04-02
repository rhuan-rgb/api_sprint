const connect = require("../db/connect");
const userService = require("../services/userService");
const cpfService = require("../services/cpfService");

module.exports = class userController {
  static async createUser(req, res) {
    const { cpf, email, password, name } = req.body;

    const validationError = userService(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    try {
      const cpfError = await cpfService(cpf);
      if (cpfError) {
        return res.status(400).json(cpfError);
      }

      const query = `INSERT INTO user (cpf, password, email, name) VALUES ( 
          '${cpf}', 
          '${password}', 
          '${email}', 
          '${name}'
        )`;

      connect.query(query, [cpf, password, email, name], (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            console.log(err);
            console.log(err.code);
            return res
              .status(400)
              .json({ error: "CPF ou email já cadastrado" });
          } else {
            console.error(err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
        }
        return res.status(201).json({ message: "Usuário criado com sucesso" });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async postLogin(req, res) {
    const { cpf, password } = req.body;

    if (!cpf || !password) {
      return res.status(400).json({ error: "CPF e senha são obrigatórios" });
    }

    const query = `SELECT * FROM user WHERE cpf = '${cpf}' AND password = '${password}'`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Credenciais inválidas" });
        }

        return res
          .status(200)
          .json({ message: "Login realizado com sucesso", user: results[0] });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllUsers(req, res) {
    const query = `SELECT * FROM user`;
    const { teste } = req.body;
    console.log(teste);

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res
          .status(200)
          .json({ message: "Obtendo todos os usuários", users: results });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getUserById(req, res) {
    const userId = req.params.id;
    const query = `SELECT * FROM user WHERE cpf = ?`;
    const values = [userId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.status(200).json({
          message: "Obtendo usuário com ID: " + userId,
          user: results[0],
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async updateUser(req, res) {
    const userId = req.params.id;
    const { cpf, email, password, name } = req.body;

    const validationError = userService(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    try {
      const query =
        "UPDATE user SET cpf = ?, email = ?, password = ?, name = ? WHERE cpf = ?";
      connect.query(
        query,
        [cpf, email, password, name, userId],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: "Erro interno do servidor" });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
          }
          return res
            .status(200)
            .json({ message: "Usuário atualizado com sucesso" });
        }
      );
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor" });
      return res.status(500).json({ error });
    }
  }

  static async deleteUser(req, res) {
    const userId = req.params.id;
    const query = `DELETE FROM user WHERE cpf = ?`;
    const values = [userId];

    try {
      connect.query(query, values, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res
          .status(200)
          .json({ message: "Usuário excluído com ID: " + userId });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};

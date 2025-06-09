const connect = require("../db/connect");
const userService = require("../services/userService");
const cpfService = require("../services/cpfService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // <-- importe aqui
const SALT_ROUNDS = 10; // Número de rounds para gerar o hash

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

      // Criptografar a senha antes de salvar
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const query = `INSERT INTO user (cpf, password, email, name) VALUES (?, ?, ?, ?)`;

      connect.query(query, [cpf, hashedPassword, email, name], (err) => {
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

    const query = `SELECT * FROM user WHERE cpf = '${cpf}'`;

    try {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (results.length === 0) {
          return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const user = results[0];

        // Comparar a senha digitada com o hash do banco
        const senhaCorreta = bcrypt.compareSync(password, user.password);

        if (!senhaCorreta) {
          return res.status(401).json({ error: "Senha incorreta" });
        }

        const token = jwt.sign({ id: user.id_usuario }, process.env.SECRET, {
          expiresIn: "1d",
        });

        delete user.password;

        return res
          .status(200)
          .json({ message: "Login realizado com sucesso", user, token });
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
    const { cpf, email, name } = req.body;

    console.log("Estou no updateUser!!!");

    const validationError = userService(req.body);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    try {
      const query =
        "UPDATE user SET cpf = ?, email = ?, name = ? WHERE cpf = ?";
      connect.query(query, [cpf, email, name, userId], (err, results) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            console.log(err);
            console.log(err.code);
            return res
              .status(400)
              .json({ error: "CPF ou email já cadastrado" });
          }
          console.log("error do front: ", err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (results.affectedRows === 0) {
          return res.status(404).json({ error: "Usuário não encontrado" });
        }
        return res
          .status(200)
          .json({ message: "Usuário atualizado com sucesso" });
      });
    } catch (error) {
      console.log("error do front: ", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
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

  // static async updatePassword(req, res) {
  //   const { cpf, senha_atual, nova_senha } = req.body;

  //   connect.query(
  //     "call alterar_senha_usuario(?,?,?);",
  //     [cpf, senha_atual, nova_senha],
  //     (err, result) => {
  //       if (err) {
  //         return res.status(500).json({ error: err.message });
  //       }

  //       return res.status(201).json({
  //         message: "Senha atualizada com sucesso",
  //       });
  //     }
  //   );
  // }
};

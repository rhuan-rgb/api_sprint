const connect = require("../db/connect");
const classroomServices = require("../services/classroomServices");
module.exports = class classroomController {
  static async createClassroom(req, res) {
    const { number, description, capacity } = req.body;

    // Verifica se todos os campos estão preenchidos
    const typeError = classroomServices.isClassroomFieldsFilled(number, description, capacity);
    if (typeError) {
      return res.status(400).json(typeError);
    }
    // Caso todos os campos estejam preenchidos, realiza a inserção na tabela
    const query = `INSERT INTO classroom (number, description, capacity) VALUES ( 
        '${number}', 
        '${description}', 
        '${capacity}'
      )`;

    try {
      connect.query(query, function (err) {
        if (err && err.code == 'ER_DUP_ENTRY') {
          console.log(err);
          return res.status(500).json({ error: "Erro: já existe uma sala com este número" });
        } else if(err) {
          console.log(err);
          return res.status(500).json({ error: "Erro ao cadastrar sala" });
        }
        console.log("Sala cadastrada com sucesso");
        res.status(201).json({ message: "Sala cadastrada com sucesso" });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getAllClassrooms(req, res) {
    try {
      const query = "SELECT * FROM classroom";
      connect.query(query, function (err, result) {
        if (err) {
          console.error("Erro ao obter salas:", err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        console.log("Salas obtidas com sucesso");
        res.status(200).json({ classrooms: result });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getClassroomById(req, res) {
    const classroomId = req.params.number;

    try {

      const queryResult = await classroomServices.findClass(classroomId);
      console.log("Sala obtida com sucesso");
      res.status(200).json({
        message: "Obtendo a sala com ID: " + classroomId,
        classroom: queryResult[0],
      });
    }
    catch (error) {
      if (error.error) {
        res.status(404).json({ error: error.error })
        console.error("Erro ao executar a consulta:", error);
      } else {
        res.status(500).json({ error: error.internal_error });
        console.error("Erro ao executar a consulta:", error);
      }

    }
  }


  static async updateClassroom(req, res) {
    const { number, description, capacity } = req.body;

    // Validar campos obrigatórios
    const typeError = await classroomServices.isClassroomFieldsFilled(number, description, capacity);
    if (typeError) {
      console.error(typeError);
      return res.status(400).json(typeError);
    }

    try {
      // Verificar se a sala existe
      try {
        const queryResult = await classroomServices.findClass(number);
        console.log("Sala existente");
      } catch (error) {
        if (error.error) {
          console.error("Erro ao executar a consulta:", error);
          return res.status(404).json({ error: error.error })
        } else {
          console.error("Erro ao executar a consulta:", error);
          return res.status(500).json({ error: error.internal_error });
        }
      }

      // Atualizar a sala
      const updateQuery = `
              UPDATE classroom 
              SET description = ?, capacity = ?
              WHERE number = ?
          `;
      connect.query(
        updateQuery,
        [description, capacity, number],
        function (err) {
          if (err) {
            console.error("Erro ao atualizar a sala:", err);
            return res
              .status(500)
              .json({ error: "Erro interno do servidor" });
          }

          console.log("Sala atualizada com sucesso");
          return res.status(200).json({ message: "Sala atualizada com sucesso" });
        }
      );
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteClassroom(req, res) {
    const classroomId = req.params.number;
    try {
      // Verificar se há reservas associadas à sala
      const checkReservationsQuery = `SELECT * FROM schedule WHERE classroom = ?`;
      connect.query(
        checkReservationsQuery,
        [classroomId],
        function (err, reservations) {
          if (err) {
            console.error("Erro ao verificar reservas:", err);
            return res.status(500).json({ error: "Erro interno do servidor" });
          }

          // Verificar se existem reservas associadas
          if (reservations.length > 0) {
            // Impedir exclusão e retornar erro
            return res
              .status(400)
              .json({
                error:
                  "Não é possível excluir a sala, pois há reservas associadas.",
              });
          } else {
            // Deletar a sala de aula
            const deleteQuery = `DELETE FROM classroom WHERE number = ?`;
            connect.query(deleteQuery, [classroomId], function (err, result) {
              if (err) {
                console.error("Erro ao deletar a sala:", err);
                return res
                  .status(500)
                  .json({ error: "Erro ao deletar a sala" });
              }

              if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Sala não encontrada" });
              }

              console.log("Sala deletada com sucesso");
              res.status(200).json({ message: "Sala excluída com sucesso" });
            });
          }
        }
      );
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};

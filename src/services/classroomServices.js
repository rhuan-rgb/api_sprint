const connect = require("../db/connect");

module.exports = {

    //não precisa ser uma async function pois não há nada que precise esperar para continuar rodando o código (await)
    isClassroomFieldsFilled: function (number, description, capacity) {
        if (!number || !description || !capacity) {
            return { error: "Todos os campos devem ser preenchidos" };
        }
        return false;
    },

    findClass: async function (number) {
        return new Promise((resolve, reject) => {

            const findQuery = `SELECT * FROM classroom WHERE number = ?`;
            connect.query(findQuery, [number], function (err, result) {
                if (err) {
                    console.error("Erro ao obter a sala:", err);
                    reject({ internal_error: "Erro interno do servidor" });
                    return
                }

                if (result.length === 0) {
                    reject({ error: "Sala não encontrada" });
                    return
                }
                resolve(result);
            })
        })
    }
}


/////////////////////////////////////////





// try {
//     // Verificar se a sala existe
//     const findQuery = `SELECT * FROM classroom WHERE number = ?`;
//     connect.query(findQuery, [number], function (err, result) {
//         if (err) {
//             console.error("Erro ao obter a sala:", err);
//             return res.status(500).json({ error: "Erro interno do servidor" });
//         }

//         if (result.length === 0) {
//             return res.status(404).json({ error: "Sala não encontrada" });
//         }

//         // Atualizar a sala
//         const updateQuery = `
//             UPDATE classroom
//             SET description = ?, capacity = ?
//             WHERE number = ?
//         `;
//         connect.query(
//             updateQuery,
//             [description, capacity, number],
//             function (err) {
//                 if (err) {
//                     console.error("Erro ao atualizar a sala:", err);
//                     return res
//                         .status(500)
//                         .json({ error: "Erro interno do servidor" });
//                 }

//                 console.log("Sala atualizada com sucesso");
//                 res.status(200).json({ message: "Sala atualizada com sucesso" });
//             }
//         );
//     });
// } catch (error) {
//     console.error("Erro ao executar a consulta:", error);
//     res.status(500).json({ error: "Erro interno do servidor" });
// }










const connect = require("../db/connect");




module.exports = async function scheduleObjectTreatment(query) {
  try {
    return new Promise((resolve, reject) => {
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          reject({ error: "Erro interno do servidor" });
          return;
        }

        // Objeto para armazenar os agendamentos organizados por dia da semana
        const schedulesByDay = {
          Seg: [],
          Ter: [],
          Qua: [],
          Qui: [],
          Sex: [],
          Sab: [],
        };

        // Organiza os agendamentos pelos dias da semana
        results.forEach((schedule) => {
          const days = schedule.days.split(", ");
          days.forEach((day) => {
            schedulesByDay[day].push(schedule);
          });
        });

        // Ordena os agendamentos dentro de cada lista com base no timeStart
        Object.keys(schedulesByDay).forEach((day) => {
          schedulesByDay[day].sort((a, b) => {
            const timeStartA = new Date(`1970-01-01T${a.timeStart}`);
            const timeStartB = new Date(`1970-01-01T${b.timeStart}`);
            return timeStartA - timeStartB;
          });
        });

        // Retorna os agendamentos organizados por dia da semana e ordenados por timeStart
        resolve(schedulesByDay);
      });
    });
  } catch (error) {
    console.error("Erro ao executar a consulta:", error);
    return { error: "Erro interno do servidor" };
  }
}
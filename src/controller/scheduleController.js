const connect = require("../db/connect");
// const scheduleServices = require("../services/cleanUpSchedulesService")
const scheduleObjectTreatment = require("../services/cleanUpSchedulesService");

// Verificar se o horário de início de um agendamento está dentro de um intervalo de tempo
function isInTimeRange(timeStart, timeRange) {
  const [start, end] = timeRange.split(" - ");
  const startTime = new Date(`1970-01-01T${start}`).getTime();
  const endTime = new Date(`1970-01-01T${end}`).getTime();
  const scheduleTime = new Date(`1970-01-01T${timeStart}`).getTime();
  return scheduleTime >= startTime && scheduleTime < endTime;
}

module.exports = class scheduleController {
  static async createSchedule(req, res) {
    const { dateStart, dateEnd, days, user, classroom, timeStart, timeEnd } =
      req.body;

    // Verificar se todos os campos estão preenchidos
    if (
      !dateStart ||
      !dateEnd ||
      !days ||
      !user ||
      !classroom ||
      !timeStart ||
      !timeEnd
    ) {
      return res
        .status(400)
        .json({ error: "Todos os campos devem ser preenchidos" });
    }
    console.log(req.body);

    const diasValidos = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

    const diasInvalidos = days.filter((day) => !diasValidos.includes(day));

    if (diasInvalidos.length > 0) {
      return res.status(400).json({ error: "Dias inválidos no agendamento" });
    }

    // Verificar se o tempo está dentro do intervalo permitido
    const isWithinTimeRange = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes;
      return totalMinutes >= 7.5 * 60 && totalMinutes <= 23 * 60;
    };

    // Verificar se o tempo de início e término está dentro do intervalo permitido
    if (!isWithinTimeRange(timeStart) || !isWithinTimeRange(timeEnd)) {
      return res.status(400).json({
        error:
          "A sala de aula só pode ser reservada dentro do intervalo de 7:30 às 23:00",
      });
    }

    // Verificar se o tempo de duração da reserva não ultrapassa 2 horas
    const isDurationAllowed = (start, end) => {
      const [startHour, startMinute] = start.split(":").map(Number);
      const [endHour, endMinute] = end.split(":").map(Number);
      const startTotal = startHour * 60 + startMinute;
      const endTotal = endHour * 60 + endMinute;
      return endTotal - startTotal <= 120;
    };

    if (!isDurationAllowed(timeStart, timeEnd)) {
      return res.status(400).json({
        error: "A reserva não pode ultrapassar 2 horas de duração",
      });
    }

    // Converter o array days em uma string separada por vírgulas
    const daysString = days.map((day) => `${day}`).join(", ");
    console.log(daysString);

    try {
      const overlapQuery = `
    SELECT * FROM schedule
    WHERE 
        classroom = '${classroom}'
        AND (
            (dateStart <= '${dateEnd}' AND dateEnd >= '${dateStart}')
        )
        AND (
            (timeStart <= '${timeEnd}' AND timeEnd >= '${timeStart}')
        )
        AND (
            (days LIKE '%Seg%' AND '${daysString}' LIKE '%Seg%') OR
            (days LIKE '%Ter%' AND '${daysString}' LIKE '%Ter%') OR
            (days LIKE '%Qua%' AND '${daysString}' LIKE '%Qua%') OR 
            (days LIKE '%Qui%' AND '${daysString}' LIKE '%Qui%') OR
            (days LIKE '%Sex%' AND '${daysString}' LIKE '%Sex%') OR
            (days LIKE '%Sab%' AND '${daysString}' LIKE '%Sab%')
        )`;

      connect.query(overlapQuery, function (err, results) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .json({ error: "Erro ao verificar agendamento existente" });
        }

        // Se a consulta retornar algum resultado, significa que já existe um agendamento
        if (results.length > 0) {
          return res.status(400).json({
            error:
              "Já existe um agendamento para os mesmos dias, sala e horários",
          });
        }

        // Caso contrário, prossegue com a inserção na tabela
        const insertQuery = `
                INSERT INTO schedule (dateStart, dateEnd, days, user, classroom, timeStart, timeEnd)
                VALUES (
                    '${dateStart}',
                    '${dateEnd}',
                    '${daysString}',
                    '${user}',
                    '${classroom}',
                    '${timeStart}',
                    '${timeEnd}'
                )
            `;

        // Executa a consulta de inserção
        connect.query(insertQuery, function (err) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Erro ao cadastrar agendamento" });
          }
          console.log("Agendamento cadastrado com sucesso");
          return res
            .status(201)
            .json({ message: "Agendamento cadastrado com sucesso" });
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getSchedulesByIdClassroomRanges(req, res) {
    const classroomID = req.params.id;
    const { weekStart, weekEnd } = req.query; // Variavel para armazenar a semana selecionada
    console.log(weekStart + " " + weekEnd);
    // Consulta SQL para obter todos os agendamentos para uma determinada sala de aula
    const query = `
    SELECT schedule.*, user.name AS userName
    FROM schedule
    JOIN user ON schedule.user = user.cpf
    WHERE classroom = '${classroomID}'
    AND (dateStart <= '${weekEnd}' AND dateEnd >= '${weekStart}')
`;

    try {
      // Executa a consulta
      connect.query(query, function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Objeto para armazenar os agendamentos organizados por dia da semana e intervalo de horário
        const schedulesByDayAndTimeRange = {
          Seg: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Ter: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Qua: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Qui: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Sex: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
          Sab: {
            "07:30 - 09:30": [],
            "09:30 - 11:30": [],
            "12:30 - 15:30": [],
            "15:30 - 17:30": [],
            "19:00 - 22:00": [],
          },
        };

        // Organiza os agendamentos pelos dias da semana e intervalo de horário
        results.forEach((schedule) => {
          const days = schedule.days.split(", ");
          const timeRanges = [
            "07:30 - 09:30",
            "09:30 - 11:30",
            "12:30 - 15:30",
            "15:30 - 17:30",
            "19:00 - 22:00",
          ];
          days.forEach((day) => {
            timeRanges.forEach((timeRange) => {
              if (isInTimeRange(schedule.timeStart, timeRange)) {
                schedulesByDayAndTimeRange[day][timeRange].push(schedule);
              }
            });
          });
        });

        // Ordena os agendamentos dentro de cada lista com base no timeStart
        Object.keys(schedulesByDayAndTimeRange).forEach((day) => {
          Object.keys(schedulesByDayAndTimeRange[day]).forEach((timeRange) => {
            schedulesByDayAndTimeRange[day][timeRange].sort((a, b) => {
              const timeStartA = new Date(`1970-01-01T${a.timeStart}`);
              const timeStartB = new Date(`1970-01-01T${b.timeStart}`);
              return timeStartA - timeStartB;
            });
          });
        });

        // Retorna os agendamentos organizados por dia da semana e intervalo de horário
        return res.status(200).json({ schedulesByDayAndTimeRange });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async getSchedulesByIdClassroom(req, res) {
    const classroomID = req.params.id;

    // Consulta SQL para obter todos os agendamentos para uma determinada sala de aula
    const query = `
      SELECT schedule.*, user.name AS userName
      FROM schedule
      JOIN user ON schedule.user = user.cpf
      WHERE classroom = '${classroomID}'
    `;
    const queryResult = await scheduleObjectTreatment(query);
    if (typeof queryResult == "object") {
      res.status(200).json({ queryResult });
    } else {
      res.status(500).json(queryResult);
    }
  }

  static async getAllSchedules(req, res) {
    // Consulta SQL para obter todos os agendamentos
    const query = `
      SELECT schedule.*, user.name AS userName
      FROM schedule
      JOIN user ON schedule.user = user.cpf
    `;
    const queryResult = await scheduleObjectTreatment(query);
    if (typeof queryResult == "object") {
      res.status(200).json({ queryResult });
    } else {
      res.status(500).json(queryResult);
    }
  }

  static async getScheduleByCpf(req, res) {
    const cpf = req.params.cpf;
    const query = `
        SELECT 
            s.*, 
            contar_reservas(?) AS total_reservas
        FROM schedule s
        WHERE s.user = ?;
    `;

    try {
      connect.query(query, [cpf, cpf], function (err, results) {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Erro interno do servidor" });
        }
        return res.status(200).json({
          message: "Agendamentos obtidos com sucesso para o usuário: " + cpf,
          results,
        });
      });
    } catch (error) {
      console.error("Erro ao executar a consulta:", error);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  static async deleteSchedule(req, res) {
    const scheduleId = req.params.id;
    connect.query(
      "call deletar_agendamento(?);",
      [scheduleId],
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        return res.status(201).json({
          message: "Reserva deletada com sucesso!",
        });
      }
    );
  }
};

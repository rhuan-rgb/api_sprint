//const connect = require("../db/connect");

async function cleanUpSchedules({dateStart,
    dateEnd ,
    days ,
    user ,
    classroom ,
    timeStart ,
    timeEnd}) {
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
        return { error: "Todos os campos devem ser preenchidos" };
      }
  
      
  
      // Verificar se o tempo está dentro do intervalo permitido
      const isWithinTimeRange = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes;
        return totalMinutes >= 7.5 * 60 && totalMinutes <= 23 * 60;
      };
  
      // Verificar se o tempo de início e término está dentro do intervalo permitido
      if (!isWithinTimeRange(timeStart) || !isWithinTimeRange(timeEnd)) {
        return {
          error:
            "A sala de aula só pode ser reservada dentro do intervalo de 7:30 às 23:00",
        };
      }
}

module.exports = cleanUpSchedules;

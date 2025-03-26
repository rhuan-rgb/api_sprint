module.exports = async function classroomServices(number, description, capacity){
    if (!number || !description || !capacity) {
        return res
          .status(400)
          .json({ error: "Todos os campos devem ser preenchidos" });
      }
}
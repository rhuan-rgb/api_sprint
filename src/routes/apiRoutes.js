const router = require("express").Router();
const verifyJWT = require("../services/verifyJWT");
const userController = require("../controller/userController");
const classroomController = require("../controller/classroomController");
const scheduleController = require("../controller/scheduleController");

//User
router.post("/user/", userController.createUser);
router.post("/user/login", userController.postLogin);
router.get("/user/", verifyJWT, userController.getAllUsers);
router.get("/user/:id",  verifyJWT, userController.getUserById);
// router.put("/user/novasenha",  verifyJWT,userController.updatePassword);
router.put("/user/:id",  verifyJWT, userController.updateUser);
router.delete("/user/:id",  verifyJWT,userController.deleteUser);

// router.put("/senha", atualizaSenha.updatePassword);

//Classroom
router.post("/classroom/",  verifyJWT,classroomController.createClassroom);
router.get("/classroom/",  verifyJWT,classroomController.getAllClassrooms);
router.get("/classroom/:number",  verifyJWT,classroomController.getClassroomById);
router.put("/classroom/",  verifyJWT,classroomController.updateClassroom);
router.delete("/classroom/:number",  verifyJWT,classroomController.deleteClassroom);

//Schedule
router.post("/schedule/",  verifyJWT,scheduleController.createSchedule);
router.get("/schedule/",  verifyJWT,scheduleController.getAllSchedules);
router.get("/schedule/:id",  verifyJWT,scheduleController.getSchedulesByIdClassroom);
router.get(
  "/schedule/ranges/:id",
  scheduleController.getSchedulesByIdClassroomRanges
);
router.get("/schedule/cpf/:cpf",  verifyJWT,scheduleController.getScheduleByCpf);
router.delete("/schedule/:id",  verifyJWT,scheduleController.deleteSchedule);



module.exports = router;

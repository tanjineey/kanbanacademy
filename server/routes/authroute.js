const express = require("express");
const router = express.Router();

const {
  getUser,
  createUser,
  loginUser,
  editUser,
  createGroup,
  getGroups,
  addGroup,
  CheckgroupRoute,
  checkAdmin,
  findUser,
  findUserByParams,
  findApp,
  createApp,
  getApps,
  editApp,
  getPlans,
  createPlan,
  getSingleplan,
  editPlan,
  createTask,
  getTasks,
  getTasksByState,
  editTask,
  getSingleTask,
  promoteTask,
  demoteTask,
  // a3Createtask,
} = require("../controllers/userscontroller");

router.route("/getuser").get(getUser);
router.route("/finduser").post(findUser);
router.route("/finduser/:id").post(findUserByParams);
router.route("/createuser").post(createUser);
router.route("/loginuser").post(loginUser);
router.route("/edituser").post(editUser);
router.route("/creategroup").post(createGroup);
router.route("/getgroups").get(getGroups);
router.route("/addgroup").post(addGroup);
router.route("/checkadmin").post(checkAdmin);
router.route("/checkgroup").post(CheckgroupRoute);

//application routes
router.route("/createapp").post(createApp);
router.route("/findapp").post(findApp);
router.route("/getapps").post(getApps);
router.route("/editapp").post(editApp);

//Plan routes
router.route("/application/createplan").post(createPlan);
router.route("/application/:app").post(getPlans);
router.route("/getsingleplan").post(getSingleplan);
router.route("/editplan").post(editPlan);

//Task routes
router.route("/createtask").post(createTask);
router.route("/getsingletask").post(getSingleTask);
router.route("/gettasks").post(getTasks);
router.route("/gettasksbystate").post(getTasksByState);
router.route("/editTask").post(editTask);
router.route("/promotetask").post(promoteTask);
router.route("/demoteTask").post(demoteTask);

module.exports = router;

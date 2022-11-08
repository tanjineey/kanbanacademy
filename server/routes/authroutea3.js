const express = require("express");
const router = express.Router();

const {
  findUser,
  findApp,
  checkPermitCreate,
  checkPlan,
  createTask,
  checkKeys,
  checkKeysState,
  checkKeysPromote,
  checkMFields,
  checkMFieldsState,
  checkMFieldsPromote,
  getTasksbyState,
  checkStateName,
  checkPermitDoing,
  checkTaskState,
  promoteToDone,
} = require("../controllers/a3controller");

router
  .route("/CreateTask2")
  .post(
    checkKeys,
    checkMFields,
    findUser,
    findApp,
    checkPermitCreate,
    checkPlan,
    createTask
  );

router
  .route("/GetTaskbyState")
  .post(
    checkKeysState,
    checkMFieldsState,
    findUser,
    findApp,
    checkStateName,
    getTasksbyState
  );

router
  .route("/PromoteTask2Done")
  .post(
    checkKeysPromote,
    checkMFieldsPromote,
    findUser,
    checkPermitDoing,
    checkTaskState,
    promoteToDone
  );
module.exports = router;

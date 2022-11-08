const users = require("../models/a3");

exports.checkKeys = async (req, res, next) => {
  const keys = Object.keys(req.body);
  var values = [
    "username",
    "password",
    "A_acronym",
    "T_name",
    "T_desc",
    "T_notes",
    "T_plan",
  ];
  const correctKeys =
    values.every((data) => keys.includes(data)) && keys.length == 7;
  if (correctKeys) {
    // console.log("correct number of keys and correct naming");
    next();
  } else {
    console.log("wrong number of keys/ wrong naming");
    res.send({ Code: 398 });
  }
};
exports.checkKeysState = async (req, res, next) => {
  const keys = Object.keys(req.body);
  var values = ["username", "password", "A_acronym", "T_state"];
  const correctKeys =
    values.every((data) => keys.includes(data)) && keys.length == 4;
  if (correctKeys) {
    console.log("correct number of keys and correct naming");
    next();
  } else {
    console.log("wrong number of keys/ wrong naming");
    res.send({ Code: 398 });
  }
};
exports.checkKeysPromote = async (req, res, next) => {
  console.log("checking keys");
  const keys = Object.keys(req.body);
  var values = ["username", "password", "T_id"];
  const correctKeys =
    values.every((data) => keys.includes(data)) && keys.length == 3;
  if (correctKeys) {
    console.log("correct number of keys and correct naming");
    next();
  } else {
    console.log("wrong number of keys/ wrong naming");
    res.send({ Code: 398 });
  }
};

exports.checkMFields = async (req, res, next) => {
  const { username, password, A_acronym, T_name } = req.body;
  if (
    username.length == 0 ||
    password.length == 0 ||
    A_acronym.length == 0 ||
    T_name.length == 0
  ) {
    res.send({ Code: 399 });
  } else {
    next();
  }
};
exports.checkMFieldsState = async (req, res, next) => {
  const { username, password, T_state, A_acronym } = req.body;
  if (
    username.length == 0 ||
    password.length == 0 ||
    A_acronym.length == 0 ||
    T_state.length == 0
  ) {
    res.send({ Code: 399 });
  } else {
    next();
  }
};

exports.checkMFieldsPromote = async (req, res, next) => {
  console.log("check mandatory fields");

  const { username, password, T_id } = req.body;
  if (username.length == 0 || password.length == 0 || T_id == 0) {
    res.send({ Code: 399 });
  } else {
    next();
  }
};
exports.findUser = async (req, res, next) => {
  const { username, password } = req.body;
  await users.findUser({ username }, async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (!data) {
        res.send({ Code: 401 });
      } else {
        const checkeduser = data.username;
        await users.checkPassword(
          { checkeduser, password },
          async (err, data) => {
            if (err) throw err;
            if (!data) {
              res.send({
                Code: 401,
              });
            } else {
              await users.checkStatus({ checkeduser }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                  res.send({
                    Code: 401,
                  });
                } else {
                  next();
                }
              });
            }
          }
        );
      }
    }
  });
};

exports.findApp = async (req, res, next) => {
  const { A_acronym } = req.body;
  await users.getApp(
    {
      A_acronym,
    },
    async (err, data) => {
      if (err) {
        throw err;
      } else {
        if (data.length == 0) {
          //invalid application acronym
          res.send({
            Code: 402,
          });
        } else {
          //   res.send({ message: "App found and login valid" });
          req.Appdata = data;
          next();
        }
      }
    }
  );
};

exports.checkPermitCreate = async (req, res, next) => {
  const { username } = req.body;
  const usergroup = req.Appdata[0].App_permit_create;
  await users.checkGroup({ username, usergroup }, async (err, data) => {
    if (err) {
      console.log(err);
    }
    if (!data) {
      res.send({ Code: 405 });
    } else {
      //   res.send({ message: "App found,login valid and has permit to create" });
      next();
    }
  });
};
exports.checkPermitDoing = async (req, res, next) => {
  console.log("checking permit");

  const { T_id, username } = req.body;
  const App_Acronym = T_id.split("_");
  console.log(App_Acronym[0]);
  const A_acronym = App_Acronym[0];
  await users.getApp(
    {
      A_acronym,
    },
    async (err, data) => {
      if (err) {
        throw err;
      } else {
        if (data.length == 0) {
          //invalid application acronym
          //   res.send({
          //     Code: 405,
          //   });
          console.log("app does not exist?");
        } else {
          const usergroup = data[0].App_permit_Doing;
          console.log(usergroup);
          await users.checkGroup({ username, usergroup }, async (err, data) => {
            if (err) {
              console.log(err);
            }
            if (!data) {
              res.send({ Code: 405 });
            } else {
              next();
            }
          });
        }
      }
    }
  );
};

//Task functions
function auditNotes(creator, notes, date) {
  // console.log(creator, notes, date);
  if (notes.length == 0) {
    return null;
  } else {
    date = new Date(date);
    var new_notes = creator + " added notes:" + "\n'" + notes + "' on " + date;
    return new_notes;
  }
}
function auditTrail(creator, state, date) {
  date = new Date(date);
  var new_state = creator + " created task in " + state + " on " + date;
  return new_state;
}

async function updateColorforTask(appname, taskid, planname) {
  const Plan_app_Acronym = appname;
  const Task_app_Acronym = appname;
  const Task_id = taskid;
  const Plan_MVP_name = planname;
  await users.getColorFromPlan(
    { Plan_app_Acronym, Plan_MVP_name },
    async (err, data) => {
      if (err) {
        return err;
      } else {
        const Task_color = data.data[0].Plan_color;
        await users.updateColorforTask(
          { Task_color, Task_app_Acronym, Task_id },
          async (err, data) => {
            if (err) {
              return err;
            } else {
              console.log(data);
              return data;
            }
          }
        );
      }
    }
  );
}

exports.checkPlan = async (req, res, next) => {
  const { A_acronym, T_plan } = req.body;
  if (T_plan.length == 0) {
    console.log("no plan found");
    next();
  } else {
    await users.getSingleplan({ A_acronym, T_plan }, async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        if (!data.length == 0) {
          console.log("plan found");
          next();
        } else {
          res.send({ Code: 403 });
        }
      }
    });
  }
};

exports.createTask = async (req, res, next) => {
  var { username, A_acronym, T_name, T_desc, T_notes, T_plan } = req.body;
  const apprnum = req.Appdata[0].App_Rnumber;
  console.log(req.Appdata[0].App_Rnumber);
  const Task_id = A_acronym + "_" + apprnum;
  const Task_state = "Open";
  const Task_createDate = new Date();
  const Task_creator = username;
  const Task_owner = username;
  const Task_app_Acronym = A_acronym;
  const Task_new_notes = auditNotes(Task_creator, T_notes, Task_createDate);
  const Task_new_state = auditTrail(Task_creator, Task_state, Task_createDate);
  if (Task_new_notes == null) {
    T_notes = Task_new_state;
  } else {
    T_notes = Task_new_notes + "\n" + Task_new_state;
  }
  await users.createTask(
    {
      T_name,
      T_desc,
      T_notes,
      Task_id,
      T_plan,
      Task_app_Acronym,
      Task_state,
      Task_creator,
      Task_owner,
      Task_createDate,
    },
    async (err, data) => {
      if (err) {
        console.log(err);
        // res.send(err);
      } else {
        const appname = Task_app_Acronym;
        await users.updateRnum({ appname }, async (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log("application rnum increased");
          }
        });
        if (T_plan.length == 0) {
          res.send({
            Code: 201,
            Task_id: Task_id,
          });
        } else {
          await updateColorforTask(Task_app_Acronym, Task_id, T_plan);
          res.send({
            Code: 201,
            Task_id: Task_id,
          });
        }
      }
    }
  );
};
exports.checkStateName = async (req, res, next) => {
  const { T_state } = req.body;
  if (
    T_state !== "Open" &&
    T_state !== "ToDo" &&
    T_state !== "Doing" &&
    T_state !== "Done" &&
    T_state !== "Closed"
  ) {
    // console.log(T_state);
    res.send({ Code: 403 });
  } else {
    next();
  }
};

exports.getTasksbyState = async (req, res) => {
  const { A_acronym, T_state } = req.body;
  var Open = [];
  var Todo = [];
  var Doing = [];
  var Done = [];
  var Closed = [];
  await users.getTasks(
    {
      A_acronym,
    },
    async (err, data) => {
      if (err) {
        res.send(err);
      } else {
        for (i in data) {
          if (data[i].Task_state == "Open") {
            Open.push(data[i]);
          } else if (data[i].Task_state == "ToDo") {
            Todo.push(data[i]);
          } else if (data[i].Task_state == "Doing") {
            Doing.push(data[i]);
          } else if (data[i].Task_state == "Done") {
            Done.push(data[i]);
          } else if (data[i].Task_state == "Closed") {
            Closed.push(data[i]);
          }
        }
        if (T_state == "Open") {
          res.send({ Code: 201, Tasks: Open });
        } else if (T_state == "ToDo") {
          res.send({ Code: 201, Tasks: Todo });
        } else if (T_state == "Doing") {
          res.send({ Code: 201, Tasks: Doing });
        } else if (T_state == "Done") {
          res.send({ Code: 201, Tasks: Done });
        } else if (T_state == "Closed") {
          res.send({ Code: 201, Tasks: Closed });
        }
      }
    }
  );
};

exports.checkTaskState = async (req, res, next) => {
  const { T_id } = req.body;
  await users.getSingleTask({ T_id }, async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      //   console.log(data);
      if (!data.length) {
        res.send({ Code: 402 });
      } else {
        req.Taskdata = data;
        if (data[0].Task_state !== "Doing") {
          res.send({ Code: 403 });
        } else {
          next();
        }
      }
    }
  });
};
function promoteAuditTrail(creator, state, newstate, date) {
  date = new Date(date);
  var new_state =
    creator + " moved task from " + state + " to " + newstate + " on " + date;
  return new_state;
}
exports.promoteToDone = async (req, res) => {
  console.log(req.Taskdata);
  const { username, T_id } = req.body;
  const Task_owner = username;
  const Task_state = req.Taskdata[0].Task_state;
  const Task_createDate = new Date();
  var Task_new_state = "Done";
  const Task_notes =
    promoteAuditTrail(Task_owner, Task_state, Task_new_state, Task_createDate) +
    "\n";
  await users.promoteTask(
    { Task_owner, Task_new_state, Task_notes, T_id },
    async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ Code: 201 });
      }
    }
  );
};

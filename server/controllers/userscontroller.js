const users = require("../models/users");
const bcrypt = require("bcrypt");
function validateCredentials(username, password, email) {
  const validUser = new RegExp(/^\S*$/);
  const validPassword = new RegExp(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,10}$/
  );
  const validEmail = new RegExp(/^\S+@\S+\.\S+$/);

  if (!validUser.test(username)) {
    return {
      success: false,
      message: "Please remove spacings in username.",
    };
  }

  if (!validPassword.test(password)) {
    return {
      success: false,
      message: "Please meet password requirements",
    };
  }
  if (email) {
    if (!validEmail.test(email)) {
      return {
        success: false,
        message: "Please key in correct format of email.",
      };
    }
  }
  return {
    success: true,
    message: "success",
  };
}
function validateGroup(group) {
  const validGroup = new RegExp(/^\S*$/);
  if (!validGroup.test(group)) {
    return {
      success: false,
      message: "Please remove spaces in your group",
    };
  }
  return {
    success: true,
    message: "success",
  };
}
exports.getUser = (req, res) => {
  //   const { username, password, usrgrp } = req.body;
  users.get(req.body, (err, data) => {
    if (err) {
      res.send(data);
    } else {
      res.send(data);
    }
  });
};

exports.findUser = async (req, res) => {
  const { username } = req.body;
  await users.findUser({ username }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data) {
        res.json(data);
      } else {
        console.log("No such user");
        res.send(false);
      }
    }
  });
};
exports.findUserByParams = async (req, res) => {
  const username = req.params.id;
  await users.findUser({ username }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data) {
        // console.log(data);
        res.json(data);
      } else {
        console.log("No such user");
        res.send(false);
      }
    }
  });
};
exports.createUser = (req, res) => {
  const { username, password, email, usergroup, status } = req.body;

  if (!validateCredentials(username, password, email).success) {
    console.log(email);
    const message = validateCredentials(username, password, email).message;
    res.send({ data: false, message: message });
  } else {
    users.create(
      {
        username,
        password,
        email,
        usergroup,
        status,
      },
      (err, data) => {
        if (err) {
          if (err.errno == 1062) {
            res.json({
              message: "Duplicate username detected.",
              data: false,
              error: err,
            });
          } else {
            res.json({
              error: err,
            });
          }
        } else {
          // console.log(data);
          res.json({ message: "user created", data: true });
        }
      }
    );
  }
};

exports.loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.send({ message: "Please enter username / password" });
  }
  if (!validateCredentials(username, password, "abc@gmail.com").success) {
    return res.send({ message: "Invalid username / password" });
  }
  await users.findUser({ username }, async (err, data) => {
    if (err) throw err;
    if (!data) {
      res.send({ message: "Invalid username /  password" });
    } else {
      const checkeduser = data.username;
      await users.checkPassword(
        { checkeduser, password },
        async (err, data) => {
          if (err) throw err;
          if (!data) {
            res.send({
              message: "Invalid username / password",
              username: checkeduser,
            });
          } else {
            await users.checkStatus({ checkeduser }, async (err, data) => {
              if (err) throw err;
              if (!data) {
                res.send({
                  message: " User disabled.",
                });
              } else {
                console.log("valid user");
                res.json({ message: true, username: checkeduser });
              }
            });
          }
        }
      );
    }
  });
};

exports.editUser = async (req, res) => {
  const { username, password, email, usergroupedit, status } = req.body;

  var usergroupstr = usergroupedit.toString();
  await users.findUser({ username }, async (err, data) => {
    if (err) throw err;
    if (!data) {
      res.send({ message: "The user doesn't exist to edit" });
    } else {
      var editusername = data.username;
      if (password.length == 0) {
        var checkpassword = "abc$1234";
      } else {
        var checkpassword = password;
        console.log(checkpassword);
      }
      if (!validateCredentials(data.username, checkpassword, email).success) {
        console.log(checkpassword);
        const message = validateCredentials(
          username,
          checkpassword,
          email
        ).message;
        res.send({ data: false, message: message });
      } else {
        var finalpassword;
        if (password.length === 0) {
          finalpassword = data.password;
        } else {
          finalpassword = await bcrypt.hash(password, 10);
        }
        users.edit(
          { editusername, finalpassword, email, usergroupstr, status },
          (err, data) => {
            if (err) throw err;
            else {
              res.send({
                message: `${editusername} has been edited.`,
                data: true,
              });
            }
          }
        );
      }
    }
  });
};

exports.deleteUser = async (req, res) => {
  const { username } = req.body;
  await users.delete({ username }, (err, data) => {
    if (err) throw err;
    if (!data) {
      res.send({ message: "The user doesn't exist to delete" });
    } else {
      res.send({ message: `${username} deleted.` });
    }
  });
};

exports.createGroup = async (req, res) => {
  const { usergroup } = req.body;
  if (!validateGroup(usergroup).success) {
    const message = validateCredentials(usergroup).message;
    res.send({ data: false, message: message });
  } else {
    await users.createGroup({ usergroup }, (err, data) => {
      if (err) {
        if (err.errno == 1062) {
          res.send({
            status: false,
            message: "Duplicate groupname detected.",
            error: err,
          });
        } else {
          res.send({
            message: err,
            error: err,
          });
        }
      } else {
        res.send({ status: true, message: `${usergroup} created.` });
      }
    });
  }
};
exports.getGroups = async (req, res) => {
  await users.getGroup(req.body, (err, data) => {
    if (err) {
      res.send(data);
    } else {
      res.send(data);
    }
  });
};

exports.addGroup = async (req, res) => {
  const { username, usergroup } = req.body;
  await users.findUser({ username }, (err, data) => {
    if (err) throw err;
    if (!data) {
      res.send({ message: "The user doesn't exist to add group" });
    } else {
      var editusername = data.username;
      users.addGroup({ editusername, usergroup }, (err, data) => {
        if (err) throw err;
        else {
          res.send(data);
        }
      });
    }
  });
};
exports.checkAdmin = async (req, res) => {
  const { username } = req.body;
  await users.checkAdmin({ username }, (err, data) => {
    if (err) throw err;
    else {
      if (!data) {
        //user is not admin
        res.send(false);
      } else {
        res.send(true);
      }
    }
  });
};

exports.CheckgroupRoute = async (req, res) => {
  if (await Checkgroup(req.body.username, req.body.usergroup)) {
    res.send(true);
  } else {
    res.send(false);
  }
};

async function Checkgroup(userid, groupname) {
  //   let sync = true;
  const username = userid;
  const usergroup = groupname;
  var userinGrp = false;
  await users.checkGroup({ username, usergroup }, (err, data) => {
    if (err) throw err;
    else {
      if (!data) {
        userinGrp = false;
      } else {
        userinGrp = true;
      }
    }
    // sync = false;
  });
  //   while (sync) {
  //     deasync.sleep(10);
  //   }
  return userinGrp;
}

//Application controllers
//Create app
function validateRnumber(rnumber) {
  const validRnumber = new RegExp(/^\d+$/);

  if (!validRnumber.test(rnumber)) {
    return {
      success: false,
      message: "Please input an integer for R number.",
    };
  }
  return {
    success: true,
  };
}

exports.createApp = async (req, res) => {
  // console.log(req.body);
  var {
    appname,
    rnumber,
    appdesc,
    appstartdate,
    appenddate,
    permitcreate,
    permitopen,
    permittodo,
    permitdoing,
    permitdone,
  } = req.body;
  appname = appname.trim();

  if (!validateRnumber(rnumber).success) {
    const message = validateRnumber(rnumber).message;
    res.send({ success: false, message: message });
  } else {
    await users.createApp(
      {
        appname,
        rnumber,
        appdesc,
        appstartdate,
        appenddate,
        permitcreate,
        permitopen,
        permittodo,
        permitdoing,
        permitdone,
      },
      (err, data) => {
        if (err) {
          if (err.errno == 1062) {
            res.json({
              message: "Duplicate application name detected.",
              success: false,
            });
          } else {
            console.log(err);
            res.json({
              message: err,
              success: false,
            });
          }
        } else {
          console.log(data);
          res.json(data);
        }
      }
    );
  }
};

exports.getApps = async (req, res) => {
  // console.log("getting apps");
  users.getApps(req.body, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  });
};
exports.findApp = async (req, res) => {
  const { appname } = req.body;
  await users.getApp({ appname }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      if (data.length == 0) {
        res.send({ success: false, message: "Couldn't find application." });
      } else {
        res.send({ success: true, data: data[0] });
      }
    }
  });
};

exports.editApp = async (req, res) => {
  const {
    appname,
    appdesc,
    appstartdate,
    appenddate,
    permitcreate,
    permitopen,
    permittodo,
    permitdoing,
    permitdone,
  } = req.body;

  await users.editApp(
    {
      appname,
      appdesc,
      appstartdate,
      appenddate,
      permitcreate,
      permitopen,
      permittodo,
      permitdoing,
      permitdone,
    },
    async (err, data) => {
      if (err) {
        res.send({ message: err });
      } else {
        console.log(data);
        res.send(data);
      }
    }
  );
};

//Plan methods
exports.getPlans = async (req, res) => {
  const App_Acronym = req.params.app;
  await users.getPlans(App_Acronym, async (err, data) => {
    if (err) {
      res.send({ data });
    } else {
      res.send(data.data);
    }
  });
};

exports.createPlan = async (req, res) => {
  // console.log(req.body);
  var {
    Plan_MVP_name,
    Plan_Notes,
    Plan_startDate,
    Plan_endDate,
    Plan_color,
    Plan_app_acronym,
  } = req.body;
  Plan_MVP_name = Plan_MVP_name.trim();
  await users.createPlans(
    {
      Plan_MVP_name,
      Plan_Notes,
      Plan_startDate,
      Plan_endDate,
      Plan_color,
      Plan_app_acronym,
    },
    async (err, data) => {
      if (err) {
        if (err.errno == 1062) {
          res.json({
            message: "Duplicate plan name detected.",
            success: false,
          });
        } else {
          res.json({
            message: err,
            success: false,
          });
        }
      } else {
        res.send(data);
      }
    }
  );
};

exports.getSingleplan = async (req, res) => {
  const { Plan_app_Acronym, Plan_MVP_name } = req.body;
  await users.getSingleplan(
    {
      Plan_app_Acronym,
      Plan_MVP_name,
    },
    async (err, data) => {
      if (err) {
        res.send(data);
      } else {
        res.send(data);
      }
    }
  );
};

exports.editPlan = async (req, res) => {
  // console.log(req.body);
  const {
    Plan_Notes,
    Plan_startDate,
    Plan_endDate,
    Plan_color,
    Plan_app_Acronym,
    Plan_MVP_name,
  } = req.body;
  await users.editPlan(
    {
      Plan_Notes,
      Plan_startDate,
      Plan_endDate,
      Plan_color,
      Plan_app_Acronym,
      Plan_MVP_name,
    },
    async (err, data) => {
      if (err) {
        res.send({ data });
      } else {
        res.send(data);
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
    var new_notes =
      creator + " added notes: ' " + "\n" + notes + "' on " + date;
    return new_notes;
  }
}
function auditTrail(creator, state, date) {
  date = new Date(date);
  var new_state = creator + " created task in " + state + " on " + date;
  return new_state;
}
function promoteAuditTrail(creator, state, newstate, date) {
  date = new Date(date);
  var new_state =
    creator + " moved task from " + state + " to " + newstate + " on " + date;
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
//Task methods
exports.createTask = async (req, res) => {
  var {
    App_Acronym,
    Task_name,
    Task_description,
    Task_notes,
    Task_plan,
    Task_app_Acronym,
    Task_state,
    Task_creator,
    Task_owner,
    Task_createDate,
  } = req.body;
  const appname = App_Acronym;

  await users.getApp(
    {
      appname,
    },
    async (err, data) => {
      if (err) {
        res.send(err);
      } else {
        if (data.length == 0) {
          console.log("application does not exist");
          res.send({ success: false, message: "application does not exist" });
        } else {
          const Task_id = App_Acronym + "_" + data[0].App_Rnumber;
          const Task_new_notes = auditNotes(
            Task_creator,
            Task_notes,
            Task_createDate
          );
          const Task_new_state = auditTrail(
            Task_creator,
            Task_state,
            Task_createDate
          );
          if (Task_new_notes == null) {
            Task_notes = Task_new_state;
          } else {
            Task_notes = Task_new_notes + "\n" + Task_new_state;
          }

          await users.createTask(
            {
              Task_name,
              Task_description,
              Task_notes,
              Task_id,
              Task_plan,
              Task_app_Acronym,
              Task_state,
              Task_creator,
              Task_owner,
              Task_createDate,
            },
            async (err, data) => {
              if (err) {
                console.log(err);
                res.send(err);
              } else {
                await users.updateRnum({ appname }, async (err, data) => {
                  if (err) {
                    res.send(err);
                  } else {
                    console.log("application rnum increased");
                  }
                });
                if (Task_plan.length == 0) {
                  res.send(data);
                } else {
                  await updateColorforTask(
                    Task_app_Acronym,
                    Task_id,
                    Task_plan
                  );
                  res.send(data);
                }
              }
            }
          );
        }
      }
    }
  );
};
exports.editTask = async (req, res) => {
  var {
    App_Acronym,
    Task_id,
    Task_description,
    Task_Audit,
    Task_notes,
    Task_plan,
    Task_owner,
    Task_createDate,
  } = req.body;
  const appname = App_Acronym;

  await users.getApp(
    {
      appname,
    },
    async (err, data) => {
      if (err) {
        res.send(err);
      } else {
        if (data.length == 0) {
          console.log("application does not exist");
          res.send({ success: false, message: "application does not exist" });
        } else {
          const Task_new_notes = auditNotes(
            Task_owner,
            Task_notes,
            Task_createDate
          );
          if (Task_new_notes !== null) {
            Task_notes = Task_new_notes + "\n" + Task_Audit;
          } else {
            Task_notes = Task_Audit;
          }
          // console.log(Task_notes);
          await users.editTask(
            {
              Task_id,
              Task_description,
              Task_notes,
              Task_plan,
              Task_owner,
            },
            async (err, data) => {
              if (err) {
                res.send(err);
              } else {
                if (Task_plan.length == 0) {
                  res.send(data);
                } else {
                  await updateColorforTask(App_Acronym, Task_id, Task_plan);
                  res.send(data);
                }
              }
            }
          );
        }
      }
    }
  );
};
exports.getSingleTask = async (req, res) => {
  const { Task_id } = req.body;

  await users.getSingleTask(
    {
      Task_id,
    },
    async (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    }
  );
};

exports.getTasks = async (req, res) => {
  const { Task_app_Acronym } = req.body;

  await users.getTasks(
    {
      Task_app_Acronym,
    },
    async (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    }
  );
};

exports.getTasksByState = async (req, res) => {
  // console.log("getting tasks");
  const { Task_app_Acronym, Task_state } = req.body;
  var Open = [];
  var Todo = [];
  var Doing = [];
  var Done = [];
  var Closed = [];
  await users.getTasks(
    {
      Task_app_Acronym,
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
        if (Task_state == "Open") {
          res.send(Open);
        } else if (Task_state == "ToDo") {
          res.send(Todo);
        } else if (Task_state == "Doing") {
          res.send(Doing);
        } else if (Task_state == "Done") {
          res.send(Done);
        } else if (Task_state == "Closed") {
          res.send(Closed);
        }
      }
    }
  );
};

exports.promoteTask = async (req, res) => {
  const { Task_owner, Task_state, Task_id, Task_createDate } = req.body;
  var Task_new_state;
  if (Task_state == "Open") {
    Task_new_state = "ToDo";
  } else if (Task_state == "ToDo") {
    Task_new_state = "Doing";
  } else if (Task_state == "Doing") {
    Task_new_state = "Done";
  } else if (Task_state == "Done") {
    Task_new_state = "Closed";
  }
  const Task_notes =
    promoteAuditTrail(Task_owner, Task_state, Task_new_state, Task_createDate) +
    "\n";
  await users.promoteTask(
    { Task_owner, Task_new_state, Task_notes, Task_id },
    async (err, data) => {
      if (err) {
        res.send(data);
      } else {
        res.send(data);
      }
    }
  );
};

exports.demoteTask = async (req, res) => {
  const { Task_owner, Task_state, Task_id, Task_createDate } = req.body;
  var Task_new_state;
  if (Task_state == "Doing") {
    Task_new_state = "ToDo";
  } else if (Task_state == "Done") {
    Task_new_state = "Doing";
  }
  const Task_notes =
    promoteAuditTrail(Task_owner, Task_state, Task_new_state, Task_createDate) +
    "\n";
  await users.demoteTask(
    { Task_owner, Task_new_state, Task_notes, Task_id },
    async (err, data) => {
      if (err) {
        res.send(data);
      } else {
        res.send(data);
      }
    }
  );
};

exports.a3Createtask = async (req, res) => {
  const {
    username,
    password,
    App_Acronym,
    Task_name,
    Task_description,
    Task_plan,
  } = req.body;

  try {
    await users.findUser({ username }, async (err, data) => {
      if (err) throw err;
      if (!data) {
        res.send({ code: 401 });
      } else {
        const checkeduser = data.username;
        await users.checkPassword(
          { checkeduser, password },
          async (err, data) => {
            if (err) throw err;
            if (!data) {
              res.send({
                code: 401,
              });
            } else {
              await users.checkStatus({ checkeduser }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                  res.send({
                    code: 401,
                  });
                } else {
                  await users.getApp(
                    {
                      App_Acronym,
                    },
                    async (err, data) => {
                      if (err) {
                        throw err;
                      } else {
                        if (data.length == 0) {
                          //invalid application acronym
                          res.send({
                            code: 400,
                          });
                        } else {
                          const permitcreate = data[0].App_permit_create;
                          await users.checkGroup(
                            { username, permitcreate },
                            async (err, data) => {
                              if (err) {
                                console.log(err);
                              }
                              if (!data) {
                                res.send({ code: 401 });
                              } else {
                                const Task_id =
                                  App_Acronym + "_" + data[0].App_Rnumber;
                                const Task_state = "Open";
                                const Task_createDate = new Date();
                                const Task_creator = username;
                                const Task_owner = username;
                                const Task_app_Acronym = App_Acronym;

                                const Task_new_notes = auditNotes(
                                  Task_creator,
                                  Task_notes,
                                  Task_createDate
                                );
                                const Task_new_state = auditTrail(
                                  Task_creator,
                                  Task_state,
                                  Task_createDate
                                );
                                if (Task_new_notes == null) {
                                  Task_notes = Task_new_state;
                                } else {
                                  Task_notes =
                                    Task_new_notes + "\n" + Task_new_state;
                                }

                                await users.createTask(
                                  {
                                    Task_name,
                                    Task_description,
                                    Task_notes,
                                    Task_id,
                                    Task_plan,
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
                                      await users.updateRnum(
                                        { appname },
                                        async (err, data) => {
                                          if (err) {
                                            console.log(err);
                                          } else {
                                            console.log(
                                              "application rnum increased"
                                            );
                                          }
                                        }
                                      );
                                      if (Task_plan.length == 0) {
                                        res.send({
                                          code: 201,
                                          Task_id: Task_id,
                                        });
                                      } else {
                                        await updateColorforTask(
                                          Task_app_Acronym,
                                          Task_id,
                                          Task_plan
                                        );
                                        res.send({
                                          code: 201,
                                          Task_id: Task_id,
                                        });
                                      }
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    }
                  );
                  // res.json({ message: true, username: checkeduser });
                }
              });
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
    res.send({ code: 405 });
  }
};

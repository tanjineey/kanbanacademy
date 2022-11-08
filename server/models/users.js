// exports.createUserModel =
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/mail");

const conn = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  characterEncoding: "utf8mb4",
});
conn.connect((err) => {
  if (err) throw err;
  console.log("DB ready");
});

exports.get = (req, res) => {
  let mystr = `SELECT * FROM usrs`;
  conn.query(mystr, (err, result) => {
    if (err) throw (err, null);
    else {
      res(null, result);
    }
  });
};
exports.create = async (req, res) => {
  const hashedpassword = await bcrypt.hash(req.password, 10);
  let mystr = `INSERT INTO usrs (username, password, email, usergroup, status) VALUES ('${req.username}', '${hashedpassword}', '${req.email}','${req.usergroup}', '${req.status}')`;
  conn.query(mystr, (err, data) => {
    if (err) {
      res(err, null);
    } else {
      res(
        null,
        (data = { message: `Username: ${req.username} is stored in database.` })
      );
    }
  });
};
exports.edit = async (req, res) => {
  let mystr = `UPDATE usrs SET password = '${req.finalpassword}', email = '${req.email}', usergroup = '${req.usergroupstr}', status = '${req.status}' WHERE username = '${req.editusername}'`;
  conn.query(mystr, (err, data) => {
    if (err) {
      res(err, null);
    } else {
      res(
        null,
        (data = {
          message: `Username: ${req.editusername} is edited in database.`,
        })
      );
    }
  });
};

exports.findUser = async (req, res) => {
  let mystr = `SELECT * FROM usrs WHERE BINARY username = ('${req.username}') `;
  conn.query(mystr, (err, result) => {
    if (err) throw (err, null);
    else {
      if (result.length > 0) {
        res(null, result[0]);
      } else {
        res(null, false);
      }
    }
  });
};

exports.checkPassword = async (req, res) => {
  let mystr = `SELECT password FROM usrs WHERE BINARY username = ('${req.checkeduser}') `;
  conn.query(mystr, async (err, result) => {
    if (err) throw (err, null);
    else {
      if (result.length > 0) {
        var decodedPassword = await bcrypt.compare(
          req.password,
          result[0].password
        );
        res(null, decodedPassword);
      } else {
        res(null, false);
      }
    }
  });
};
exports.checkAdmin = async (req, res) => {
  let mystr = `SELECT * FROM usrs WHERE username = ('${req.username}') `;
  return new Promise(function (resolve, reject) {
    conn.query(mystr, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        if (result[0].usergroup.length > 0) {
          var groupList = result[0].usergroup.split(",");

          var isFound = false;
          for (let i in groupList) {
            if (groupList[i] == "admin") {
              isFound = true;
              break;
            }
          }
          if (isFound) {
            resolve(res(null, true));
          } else {
            resolve(res(null, false));
          }
        } else {
          res(null, false);
        }
      }
    });
  });
};

exports.checkStatus = async (req, res) => {
  let mystr = `SELECT * FROM usrs WHERE username = ('${req.checkeduser}')`;
  return new Promise(function (resolve, reject) {
    conn.query(mystr, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        console.log(result);
        if (result[0].status == "Active") {
          resolve(res(null, true));
        } else {
          resolve(res(null, false));
        }
      }
    });
  });
};
exports.checkGroup = async (req, res) => {
  let mystr = `SELECT * FROM usrs WHERE username = ('${req.username}') `;
  return new Promise(function (resolve, reject) {
    conn.query(mystr, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
        return reject(err);
      } else {
        if (result.length) {
          if (result[0].usergroup.length > 0) {
            var groupList = result[0].usergroup.split(",");

            var isFound = false;
            for (let i in groupList) {
              if (groupList[i] == req.usergroup) {
                isFound = true;
                break;
              }
            }
            if (isFound) {
              resolve(res(null, true));
            } else {
              resolve(res(null, false));
            }
          }
        } else {
          resolve(res(null, false));
        }
      }
    });
  });
};
exports.createGroup = async (req, res) => {
  let mystr = `INSERT INTO usergroups (usergroup) VALUES ('${req.usergroup}')`;
  conn.query(mystr, async (err, result) => {
    if (err) {
      res(err);
    } else {
      if (result.message.length > 0) {
        res(null, true);
      } else {
        res(null, false);
      }
    }
  });
};
exports.getGroup = async (req, res) => {
  let mystr = `SELECT usergroup FROM usergroups`;
  conn.query(mystr, (err, result) => {
    if (err) throw (err, null);
    else {
      if (result) {
        var userGroupList = [];
        for (let i in result) {
          userGroupList.push(result[i].usergroup);
        }
        res(null, userGroupList);
      }
    }
  });
};

exports.addGroup = async (req, res) => {
  let mystr = `UPDATE usrs SET usergroup = '${req.usergroup}' WHERE username = ('${req.editusername}') `;
  conn.query(mystr, async (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.message.length > 0) {
        res(
          null,
          (data = {
            message: `Username: ${req.editusername} is edited in database.`,
          })
        );
      } else {
        res(null, false);
      }
    }
  });
};

//Application related
//Application creation
exports.getApp = async (req, res) => {
  let mystr = `SELECT * FROM application WHERE App_Acronym = ('${req.appname}') `;
  // console.log(mystr);
  conn.query(mystr, (err, data) => {
    if (err) throw (err, null);
    else {
      res(null, data);
    }
  });
};
exports.updateRnum = async (req, res) => {
  let mystr = `UPDATE application SET App_Rnumber=App_Rnumber + 1 WHERE App_Acronym =?`;
  conn.query(mystr, [req.appname], (err, data) => {
    if (err) {
      res(err, null);
    } else {
      res(null, {
        success: true,
      });
    }
  });
};
exports.createApp = async (req, res) => {
  let mystr = `INSERT INTO application (App_Acronym , App_Description, App_Rnumber, App_startDate, App_endDate, App_permit_create, App_permit_Open, App_permit_toDoList, App_permit_Doing, App_permit_Done)VALUES (?,?,?,?,?,?,?,?,?,?) `;

  conn.query(
    mystr,
    [
      req.appname,
      req.appdesc,
      req.rnumber,
      req.appstartdate,
      req.appenddate,
      req.permitcreate.length ? req.permitcreate : "",
      req.permitopen.length ? req.permitopen : "",
      req.permittodo.length ? req.permittodo : "",
      req.permitdoing.length ? req.permitdoing : "",
      req.permitdone.length ? req.permitdone : "",
    ],
    (err, data) => {
      if (err) {
        res(err, null);
      } else {
        res(null, {
          success: true,
          message: `App: ${req.appname} has been created.`,
        });
      }
    }
  );
};

exports.getApps = (req, res) => {
  let mystr = `SELECT App_Acronym FROM application`;
  conn.query(mystr, (err, data) => {
    if (err) throw (err, null);
    else {
      res(null, data);
    }
  });
};

exports.editApp = async (req, res) => {
  let mystr = `UPDATE application SET App_Description =?, App_startDate = ?,App_endDate = ?,App_permit_create = ?,App_permit_Open = ?,App_permit_toDoList = ?,App_permit_Doing=?,App_permit_Done = ? WHERE App_Acronym = ?`;
  conn.query(
    mystr,
    [
      req.appdesc,
      req.appstartdate,
      req.appenddate,
      req.permitcreate,
      req.permitopen,
      req.permittodo,
      req.permitdoing,
      req.permitdone,
      req.appname,
    ],
    (err, data) => {
      // console.log(mystr);

      if (err) {
        res({ success: false, message: err }, null);
      } else {
        // console.log(data);
        if (data.affectedRows < 1) {
          res(null, {
            success: false,
            message: "No data updated.",
          });
        } else {
          res(null, {
            success: true,
            message: `App: ${req.appname} successfully edited.`,
          });
        }
      }
    }
  );
};

//Plan related methods

exports.getPlans = async (req, res) => {
  // console.log(req);
  let mystr = `SELECT Plan_MVP_name,Plan_color FROM plan WHERE Plan_app_Acronym =?`;
  conn.query(mystr, req, (err, data) => {
    if (err) {
      res({ success: false, message: err }, null);
    } else {
      // const planList = [];

      // for (let i in data) {
      //   planList.push(data[i].Plan_MVP_name);
      // }
      res(null, { success: false, data });
    }
  });
};

exports.createPlans = async (req, res) => {
  let mystr = `INSERT INTO plan (Plan_app_Acronym, Plan_Notes, Plan_startDate, Plan_endDate, Plan_MVP_name, Plan_color) VALUES (?,?,?,?,?,?)`;
  conn.query(
    mystr,
    [
      req.Plan_app_acronym,
      req.Plan_Notes,
      req.Plan_startDate,
      req.Plan_endDate,
      req.Plan_MVP_name,
      req.Plan_color,
    ],
    (err, data) => {
      // console.log(err);

      if (err) {
        res(err, { success: false, message: err });
      } else {
        res(null, {
          success: true,
          message: `Plan: ${req.Plan_MVP_name} has been created.`,
        });
      }
    }
  );
};

exports.getSingleplan = async (req, res) => {
  let mystr = `SELECT * FROM plan WHERE Plan_app_Acronym =? and Plan_MVP_name=?`;
  conn.query(mystr, [req.Plan_app_Acronym, req.Plan_MVP_name], (err, data) => {
    if (err) {
      res(err, null);
    } else {
      res(null, {
        success: true,
        data,
      });
    }
  });
};

exports.editPlan = async (req, res) => {
  let mystr = `UPDATE plan SET Plan_Notes =?, Plan_startDate = ?,Plan_endDate = ?,Plan_color = ? WHERE Plan_app_Acronym =? and Plan_MVP_name=? `;
  conn.query(
    mystr,
    [
      req.Plan_Notes,
      req.Plan_startDate,
      req.Plan_endDate,
      req.Plan_color,
      req.Plan_app_Acronym,
      req.Plan_MVP_name,
    ],
    (err, data) => {
      // console.log(mystr);

      if (err) {
        res({ success: false, message: err }, null);
      } else {
        // console.log(data);
        if (data.affectedRows < 1) {
          res(null, {
            success: false,
            message: "No data updated.",
          });
        } else {
          res(null, {
            success: true,
            message: `Plan: ${req.Plan_MVP_name} successfully edited.`,
          });
        }
      }
    }
  );
};
exports.getColorFromPlan = async (req, res) => {
  let mystr = `SELECT Plan_color FROM plan WHERE Plan_app_Acronym = ? AND Plan_MVP_name= ?  `;
  conn.query(mystr, [req.Plan_app_Acronym, req.Plan_MVP_name], (err, data) => {
    if (err) {
      res(err, { success: false, err });
    } else {
      res(null, { success: true, data });
    }
  });
};
exports.updateColorforTask = async (req, res) => {
  let mystr = `UPDATE task SET Task_color=? WHERE Task_id =?`;
  conn.query(mystr, [req.Task_color, req.Task_id], (err, data) => {
    if (err) {
      res(err, { success: false, message: err });
    } else {
      res(null, {
        success: true,
        message: ` Task color updated to ${req.Task_color}`,
      });
    }
  });
};
exports.createTask = async (req, res) => {
  let mystr = `INSERT INTO task (Task_name,Task_description,Task_notes,Task_id,Task_plan,Task_app_Acronym,Task_state,Task_creator,Task_owner,Task_createDate) VALUES (?,?,?,?,?,?,?,?,?,?)`;
  // console.log(req);
  conn.query(
    mystr,
    [
      req.Task_name,
      req.Task_description,
      req.Task_notes,
      req.Task_id,
      req.Task_plan.length ? req.Task_plan : "",
      req.Task_app_Acronym,
      req.Task_state,
      req.Task_creator,
      req.Task_owner,
      req.Task_createDate,
    ],
    (err, data) => {
      if (err) {
        res(err, null);
      } else {
        res(null, {
          success: true,
          message: `Task ${req.Task_id}: ${req.Task_name}  has been created.`,
        });
      }
    }
  );
};

exports.editTask = async (req, res) => {
  let mystr = `UPDATE task SET Task_description =?,Task_notes =? ,Task_plan=? ,Task_owner =?  WHERE Task_id = ? `;
  // console.log(req);
  conn.query(
    mystr,
    [
      req.Task_description,
      req.Task_notes,
      req.Task_plan.length ? req.Task_plan : "",
      req.Task_owner,
      req.Task_id,
    ],
    (err, data) => {
      if (err) {
        // console.log(err);
        res(null, {
          success: true,
          message: `Error updating. ${err}`,
        });
        // res(err, err);
      } else {
        // console.log(data);
        res(null, {
          success: true,
          message: `Task ${req.Task_id} has been edited.`,
        });
      }
    }
  );
};
exports.getSingleTask = async (req, res) => {
  let mystr = `SELECT * FROM task WHERE Task_id=? `;
  conn.query(mystr, [req.Task_id], (err, data) => {
    if (err) {
      res(err, null);
    } else {
      res(null, data);
    }
  });
};
exports.getTasks = async (req, res) => {
  let mystr = `SELECT * FROM task WHERE Task_app_Acronym=? `;
  // console.log(req.Task_app_Acronym);
  conn.query(mystr, [req.Task_app_Acronym], (err, data) => {
    if (err) {
      res(err, null);
    } else {
      // console.log(data);
      res(null, data);
    }
  });
};

exports.promoteTask = async (req, res) => {
  let mystr = `UPDATE task SET Task_state=?,Task_notes= CONCAT(?,Task_notes), Task_owner=? WHERE Task_id=?`;
  console.log(req.Task_id);
  conn.query(
    mystr,
    [req.Task_new_state, req.Task_notes, req.Task_owner, req.Task_id],
    async (err, data) => {
      if (err) {
        res(err, err);
      } else {
        if (req.Task_new_state !== "Done") {
          console.log(`new state is ${req.Task_new_state}`);
          res(null, {
            success: true,
            message: `${req.Task_id} has been promoted to ${req.Task_new_state}`,
          });
        } else if (req.Task_new_state == "Done") {
          res(null, {
            success: true,
            message: `${req.Task_id} has been promoted to ${req.Task_new_state}`,
          });

          const message = `${req.Task_id} has been promoted to Done.`;
          await sendEmail({
            email: `jertankanban@gmail.com`,
            subject: `${req.Task_id} promoted`,
            message,
          });
        }
      }
    }
  );
};

exports.demoteTask = async (req, res) => {
  let mystr = `UPDATE task SET Task_state=?,Task_notes= CONCAT(?,Task_notes),Task_owner=? WHERE Task_id=?`;
  conn.query(
    mystr,
    [req.Task_new_state, req.Task_notes, req.Task_owner, req.Task_id],
    (err, data) => {
      if (err) {
        res(err, err);
      } else {
        res(null, {
          success: true,
          message: `${req.Task_id} has been demoted to ${req.Task_new_state}`,
        });
      }
    }
  );
};

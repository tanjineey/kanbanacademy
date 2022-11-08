const mysql = require("mysql");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/mail");

const conn = mysql.createConnection({
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
});
conn.connect((err) => {
  if (err) throw err;
  console.log("A3 DB ready");
});

exports.findUser = async (req, res) => {
  let mystr = `SELECT * FROM usrs WHERE username = ('${req.username}') `;
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

exports.checkStatus = async (req, res) => {
  let mystr = `SELECT * FROM usrs WHERE username = ('${req.checkeduser}')`;
  return new Promise(function (resolve, reject) {
    conn.query(mystr, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      } else {
        if (result[0].status == "Active") {
          resolve(res(null, true));
        } else {
          resolve(res(null, false));
        }
      }
    });
  });
};

exports.getApp = async (req, res) => {
  let mystr = `SELECT * FROM application WHERE App_Acronym = ('${req.A_acronym}') `;
  // console.log(mystr);
  conn.query(mystr, (err, data) => {
    if (err) throw (err, null);
    else {
      res(null, data);
    }
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

exports.createTask = async (req, res) => {
  let mystr = `INSERT INTO task (Task_name,Task_description,Task_notes,Task_id,Task_plan,Task_app_Acronym,Task_state,Task_creator,Task_owner,Task_createDate) VALUES (?,?,?,?,?,?,?,?,?,?)`;
  // console.log(req);
  Task_createDate = new Date(req.Task_createDate).toLocaleString();
  conn.query(
    mystr,
    [
      req.T_name,
      req.T_desc,
      req.T_notes,
      req.Task_id,
      req.T_plan.length ? req.T_plan : "",
      req.Task_app_Acronym,
      req.Task_state,
      req.Task_creator,
      req.Task_owner,
      Task_createDate,
    ],
    (err, data) => {
      if (err) {
        res(err, null);
      } else {
        res(null, {
          success: true,
          message: `Task ${req.T_id}: ${req.T_name}  has been created.`,
        });
      }
    }
  );
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

exports.getSingleplan = async (req, res) => {
  let mystr = `SELECT * FROM plan WHERE Plan_app_Acronym =? and Plan_MVP_name=?`;
  conn.query(mystr, [req.A_acronym, req.T_plan], (err, data) => {
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
  conn.query(mystr, [req.A_acronym], (err, data) => {
    if (err) {
      res(err, null);
    } else {
      // console.log(data);
      res(null, data);
    }
  });
};

exports.getSingleTask = async (req, res) => {
  let mystr = `SELECT * FROM task WHERE Task_id=? `;
  conn.query(mystr, [req.T_id], (err, data) => {
    if (err) {
      res(err, null);
    } else {
      res(null, data);
    }
  });
};

exports.promoteTask = async (req, res) => {
  let mystr = `UPDATE task SET Task_state=?,Task_notes= CONCAT(?,Task_notes), Task_owner=? WHERE Task_id=?`;
  console.log(req.T_id);
  conn.query(
    mystr,
    [req.Task_new_state, req.Task_notes, req.Task_owner, req.T_id],
    async (err, data) => {
      if (err) {
        res(err, err);
      } else {
        if (req.Task_new_state !== "Done") {
          console.log(`new state is ${req.Task_new_state}`);
          res(null, {
            success: true,
            message: `${req.T_id} has been promoted to ${req.Task_new_state}`,
          });
        } else if (req.Task_new_state == "Done") {
          res(null, {
            success: true,
            message: `${req.T_id} has been promoted to ${req.Task_new_state}`,
          });

          const message = `${req.T_id} has been promoted to Done.`;
          await sendEmail({
            email: `jertankanban@gmail.com`,
            subject: `${req.T_id} promoted`,
            message,
          });
        }
      }
    }
  );
};

import React, { useEffect, useState } from "react";
import { Service } from "../services/Service";
import "../styles/form.css";
//components
import Button from "react-bootstrap/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";

function EditTask(props) {
  const service = new Service();
  const [taskname, setTaskName] = useState("");
  const [taskdesc, setTaskDesc] = useState("");
  const [planList, setPlanList] = useState([]);
  const [taskPlan, setTaskPlan] = useState("");
  const [tasknotes, setTaskNotes] = useState("");
  const [taskAudit, setTaskAudit] = useState("");
  const [result, setResult] = useState("");
  const [errcolor, setErrColor] = useState(false);
  const [permitopen, setPermitopen] = useState(false);
  const [permitcreate, setPermitcreate] = useState(false);
  const [permittodo, setPermittodo] = useState(false);
  const [permitdoing, setPermitdoing] = useState(false);
  const [permitdone, setPermitdone] = useState(false);
  const styleCorrResult = { color: "green" };
  const styleErrResult = { color: "#f84f31" };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  async function fetchPlans() {
    try {
      var application = {
        App_Acronym: props.app,
      };
      const response = await service.getPlans(application);
      setPlanList(response);
    } catch (e) {
      console.log("there was a problem ");
    }
  }
  const handleChangePlan = (event) => {
    const {
      target: { value },
    } = event;
    setTaskPlan(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  async function getTask() {
    const app = {
      Task_id: props.taskid,
    };
    const response = await service.getTask(app);
    setTaskDesc(response[0].Task_description);
    setTaskAudit(response[0].Task_notes);
    setTaskName(response[0].Task_name);
    setTaskPlan(response[0].Task_plan);
  }
  async function Auth() {
    setPermitopen(props.permitopen);
    console.log(props.permitcreate);
    setPermitcreate(props.permitcreate);
    setPermittodo(props.permittodo);
    setPermitdoing(props.permitdoing);
    setPermitdone(props.permitdone);
  }
  async function editTask() {
    const form = document.getElementById("form");
    const app = {
      App_Acronym: props.app,
      Task_id: props.taskid,
      Task_description: taskdesc,
      Task_Audit: taskAudit,
      Task_notes: tasknotes,
      Task_plan: taskPlan,
      Task_owner: sessionStorage.getItem("kanbanAppUsername"),
      Task_createDate: new Date(),
    };
    const response = await service.editTask(app);
    if (response.success) {
      setTaskNotes("");
      setTaskPlan([]);
      form.reset();

      getTask();
      // props.getTasks();
      props.edited();
      const resultmsg = response.message;
      console.log(resultmsg);
      setResult(resultmsg);
      setErrColor(false);
    } else {
      const resultmsg = response.data.message;
      console.log(resultmsg);
      setResult(resultmsg);
      setErrColor(true);
    }
  }

  useEffect(() => {
    getTask();
    fetchPlans();
    Auth();
  }, [props.taskid]);

  return (
    <>
      <form
        id="form"
        onSubmit={(e) => {
          e.preventDefault();
          editTask();
          // getTask();
        }}
      >
        <div className="flex-row">
          <div className="flex-column">
            <div className="flex-row ">
              <label className="label-medium" htmlFor="taskname">
                Task Name:
              </label>
              <input
                value={taskname}
                disabled
                onChange={(e) => {
                  e.preventDefault();
                  setTaskName(e.target.value);
                }}
                id="taskname"
              ></input>
            </div>
            <div className="flex-row">
              <label className="label-medium" htmlFor="taskdesc">
                Task Description:
              </label>
              <textarea
                disabled={
                  props.taskstate == "ToDo" ||
                  props.taskstate == "Doing" ||
                  props.taskstate == "Closed" ||
                  permittodo ||
                  permitdoing ||
                  (props.taskstate === "Open" && permitcreate) ||
                  (props.taskstate === "Done" && !permitdone)
                }
                value={taskdesc}
                onChange={(e) => {
                  e.preventDefault();
                  setTaskDesc(e.target.value);
                }}
                style={{ width: "500px", height: "100px" }}
                id="taskdesc"
              ></textarea>
            </div>
            <div className="flex-row">
              <label className="label-medium" htmlFor="tasknotes">
                Task Notes:
              </label>
              <textarea
                disabled={
                  !(
                    (props.taskstate == "Open" && permitopen) ||
                    (props.taskstate == "ToDo" && permittodo) ||
                    (props.taskstate == "Doing" && permitdoing) ||
                    (props.taskstate == "Done" && permitdone)
                  )
                }
                onChange={(e) => {
                  e.preventDefault();
                  setTaskNotes(e.target.value);
                }}
                style={{ width: "500px", height: "100px" }}
                id="tasknotes"
              ></textarea>
            </div>
            <div>
              <label className="label-medium" htmlFor="taskplan">
                Task Plan:
              </label>
              <FormControl sx={{ width: 200 }}>
                <Select
                  disabled={
                    !(
                      (props.taskstate == "Open" && permitopen) ||
                      (props.taskstate == "Done" && permitdone)
                    )
                  }
                  id="taskplan"
                  value={taskPlan}
                  onChange={handleChangePlan}
                  input={<OutlinedInput />}
                  MenuProps={MenuProps}
                >
                  {planList.map((name) => (
                    <MenuItem
                      key={name.Plan_MVP_name}
                      value={name.Plan_MVP_name}
                    >
                      {name.Plan_MVP_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex-row">
              <label className="label-medium" htmlFor="taskaudit">
                Task Audit:
              </label>
              <textarea
                disabled
                value={taskAudit}
                onChange={(e) => {
                  e.preventDefault();
                  setTaskNotes(e.target.value);
                }}
                style={{ width: "500px", height: "100px" }}
                id="taskaudit"
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex-row">
          {!errcolor ? (
            <p style={styleCorrResult}>{result}</p>
          ) : (
            <p style={styleErrResult}>{result}</p>
          )}
        </div>
        <div>
          {((props.taskstate == "Open" && props.permitopen) ||
            (props.taskstate == "ToDo" && props.permittodo) ||
            (props.taskstate == "Doing" && props.permitdoing) ||
            (props.taskstate == "Done" && props.permitdone)) && (
            <Button
              style={{ margin: "10px" }}
              variant="outline-success"
              type="submit"
            >
              Update
            </Button>
          )}
          {/* <Button
            style={{ margin: "10px" }}
            variant="outline-success"
            type="submit"
          >
            Update
          </Button>{" "} */}
        </div>
      </form>
    </>
  );
}

export default EditTask;

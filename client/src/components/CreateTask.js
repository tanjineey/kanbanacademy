import React, { useEffect, useState } from "react";
import { Service } from "../services/Service";

//styles
import "../styles/form.css";

//components
import Button from "react-bootstrap/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";

function CreateTask(props) {
  const service = new Service();
  const [taskname, setTaskName] = useState("");
  const [taskdesc, setTaskDesc] = useState("");
  const [planList, setPlanList] = useState([]);
  const [taskPlan, setTaskPlan] = useState("");
  const [tasknotes, setTaskNotes] = useState("");
  const [taskAudit, setTaskAudit] = useState("");
  const [result, setResult] = useState("");
  const [errcolor, setErrColor] = useState(false);
  const styleCorrResult = { color: "green" };
  const styleErrResult = { color: "#f84f31" };

  //styles
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
  const handleChangePlan = (event) => {
    const {
      target: { value },
    } = event;
    setTaskPlan(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  async function fetchPlans() {
    try {
      var application = {
        App_Acronym: props.appName,
      };
      const response = await service.getPlans(application);
      console.log(response);
      setPlanList(response);
    } catch (e) {
      console.log(e);
      console.log("there was a problem ");
    }
  }
  async function createnewTask(e) {
    e.preventDefault();
    const form = document.getElementById("form1");
    try {
      const app = {
        App_Acronym: props.appName,
        Task_name: taskname,
        Task_description: taskdesc,
        Task_notes: tasknotes,
        Task_plan: taskPlan,
        Task_app_Acronym: props.appName,
        Task_state: "Open",
        Task_creator: sessionStorage.getItem("kanbanAppUsername"),
        Task_owner: sessionStorage.getItem("kanbanAppUsername"),
        Task_createDate: new Date(),
      };

      const response = await service.createTask(app);

      if (response.success) {
        console.log(form);
        form.reset();
        setTaskName("");
        setTaskNotes("");
        setTaskDesc("");
        setTaskPlan([]);
        props.getTasks();
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
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPlans();
  }, [props.getTasks]);
  return (
    <>
      <form id="form1" onSubmit={createnewTask}>
        <div className="flex-row">
          <div className="flex-column">
            <div className="flex-row ">
              <label className="label-medium" htmlFor="taskname">
                Task Name:
              </label>
              <input
                required
                onChange={(e) => {
                  e.preventDefault();
                  setTaskName(e.target.value);
                }}
                maxLength="255"
                id="taskname"
              ></input>
            </div>
            <div className="flex-row">
              <label className="label-medium" htmlFor="taskdesc">
                Task Description:
              </label>
              <textarea
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
          <Button
            style={{ margin: "10px" }}
            variant="outline-success"
            type="submit"
          >
            Create
          </Button>{" "}
        </div>
      </form>
    </>
  );
}

export default CreateTask;

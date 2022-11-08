import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Service } from "../services/Service";

//components
import Button from "react-bootstrap/Button";
import { Table, TableBody } from "@mui/material";
import CreatePlan from "./CreatePlan";
import ViewPlan from "./ViewPlan";

import EditPlan from "./EditPlan";
import Header from "./Header";
import TaskBoard from "./TaskBoard";
import DispatchContext from "../DispatchContext";

function Application() {
  const { app } = useParams();
  const service = new Service();
  const appDispatch = useContext(DispatchContext);
  const [noapp, setNoapp] = useState(false);
  const [appname, setAppName] = useState("");
  const [planList, setPlanList] = useState([]);
  const [toCreate, setToCreate] = useState(false);
  const [toEdit, setToEdit] = useState(false);
  const [editplan, setEditPlan] = useState(false);
  const [created, setCreated] = useState(false);
  const [edited, setEdited] = useState(false);
  const [permitopen, setPermitopen] = useState(false);
  const [permitcreate, setPermitcreate] = useState(false);
  const [permittodo, setPermittodo] = useState(false);
  const [permitdoing, setPermitdoing] = useState(false);
  const [permitdone, setPermitdone] = useState(false);
  const [PM, setPermitPM] = useState(false);

  //   setAppName(app);
  async function checkApp() {
    try {
      const application = {
        appname: app,
      };
      const response = await service.findApplication(application);
      if (!response.success) {
        console.log("no app found");
        setNoapp(true);
      } else {
        const permitPMvalues = {
          username: sessionStorage.getItem("kanbanAppUsername"),
          usergroup: "projectmanager",
        };
        const permitPM = await service.checkGroup(permitPMvalues);

        const permitOpenvalues = {
          username: sessionStorage.getItem("kanbanAppUsername"),
          usergroup: response.data.App_permit_Open,
        };
        const permitOpen = await service.checkGroup(permitOpenvalues);
        const permitToDovalues = {
          username: sessionStorage.getItem("kanbanAppUsername"),
          usergroup: response.data.App_permit_toDoList,
        };
        const permitToDo = await service.checkGroup(permitToDovalues);
        const permitDoingvalues = {
          username: sessionStorage.getItem("kanbanAppUsername"),
          usergroup: response.data.App_permit_Doing,
        };
        const permitDoing = await service.checkGroup(permitDoingvalues);
        const permitDonevalues = {
          username: sessionStorage.getItem("kanbanAppUsername"),
          usergroup: response.data.App_permit_Done,
        };
        const permitDone = await service.checkGroup(permitDonevalues);
        const permitcreatevalues = {
          username: sessionStorage.getItem("kanbanAppUsername"),
          usergroup: response.data.App_permit_create,
        };
        const permitCreate = await service.checkGroup(permitcreatevalues);

        if (permitCreate) {
          sessionStorage.setItem("permitCreate", true);
          setPermitcreate(true);
        }
        if (permitOpen) {
          sessionStorage.setItem("permitOpen", true);
          setPermitopen(true);
        }
        if (permitToDo) {
          sessionStorage.setItem("permitToDo", true);
          setPermittodo(true);
        }
        if (permitDoing) {
          sessionStorage.setItem("permitDoing", true);
          setPermitdoing(true);
        }
        if (permitDone) {
          sessionStorage.setItem("permitDone", true);
          setPermitdone(true);
        }
        if (permitPM) {
          // console.log("is a PM");
          sessionStorage.setItem("PM", true);
          setPermitPM(true);
        }

        setAppName(app);
      }
    } catch (err) {}
  }

  async function fetchPlans() {
    try {
      var application = {
        App_Acronym: app,
      };
      const response = await service.getPlans(application);
      setPlanList(response);
    } catch (e) {
      console.log(e);
      console.log("there was a problem ");
    }
  }
  async function showCPlan() {
    // setToCreate(true);
    setToCreate((prevCheck) => !prevCheck);
    setToEdit(false);
  }
  async function showEditPlan() {
    setToCreate(false);
    setToEdit(true);
  }

  useEffect(() => {
    checkApp();
    fetchPlans();
    setCreated(false);
  }, [created]);

  return (
    <>
      <Header />
      {!noapp ? (
        <>
          <h3 style={{ margin: "10px" }}>Application: {appname}</h3>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div style={{ width: "75vw", margin: "0 30px" }}>
              <TaskBoard
                appName={app}
                PM={PM}
                permitcreate={permitcreate}
                permitopen={permitopen}
                permittodo={permittodo}
                permitdoing={permitdoing}
                permitdone={permitdone}
              />
            </div>
            <div style={{ marginRight: "50px" }}>
              <Table
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "10px 5px",
                }}
              >
                <tbody>
                  <tr>
                    {sessionStorage.getItem("PM") === "true" ? (
                      <Button onClick={showCPlan}>Create Plan</Button>
                    ) : (
                      <></>
                    )}
                  </tr>
                  <tr>{toCreate && <CreatePlan create={setCreated} />}</tr>
                  <tr>
                    {toEdit && sessionStorage.getItem("PM") == "true" && (
                      <EditPlan
                        editappname={appname}
                        editplanname={editplan}
                        created={setCreated}
                      />
                    )}
                    {toEdit && sessionStorage.getItem("PM") == "false" && (
                      <ViewPlan
                        editappname={appname}
                        editplanname={editplan}
                        created={setCreated}
                      />
                    )}
                  </tr>

                  <tr>
                    <th>Plans</th>
                  </tr>
                  <tr>
                    {planList.map((plan) => {
                      return (
                        <>
                          <tr key={plan.Plan_MVP_name}>
                            <td
                              style={{
                                marginLeft: "20px",
                                backgroundColor: `${plan.Plan_color}`,
                                color: " black ",
                                padding: "10px",
                                borderRadius: "10px",
                              }}
                            >
                              {plan.Plan_MVP_name}
                            </td>
                            <td>
                              {sessionStorage.getItem("PM") == "true" ? (
                                <Button
                                  style={{ marginRight: "10px" }}
                                  variant="outline-primary"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    showEditPlan();
                                    setEditPlan(plan.Plan_MVP_name);
                                  }}
                                >
                                  Edit Plan
                                </Button>
                              ) : (
                                <Button
                                  style={{ marginRight: "10px" }}
                                  variant="outline-primary"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    showEditPlan();
                                    setEditPlan(plan.Plan_MVP_name);
                                  }}
                                >
                                  View Plan
                                </Button>
                              )}

                              {/* <Button>View Plan </Button> */}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div style={{ margin: "10px" }}>
            <h1>Application Error</h1>
            <p>Possible error: Please check if app permits have been set</p>
          </div>
        </>
      )}
    </>
  );
}

export default Application;

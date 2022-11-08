import { Table } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//styles
import "../styles/form.css";
//import Service
import { Service } from "../services/Service.js";

//Components
import Button from "react-bootstrap/Button";
import EditApp from "./EditApp.js";
import ViewApp from "./ViewApp.js";

import CreateApplication from "./CreateApplication.js";

function AppNorm() {
  const service = new Service();
  const [appName, setAppName] = useState([]);
  const [editapp, setEditApp] = useState(false);
  const [showCA, setshowCA] = useState(true);
  const [showVA, setshowVA] = useState(false);
  const [created, setCreated] = useState(false);
  const [PL, setPL] = useState(false);

  async function display() {
    setshowCA(true);
    setPL(sessionStorage.getItem("PL") == "true" ? true : false);

    try {
      const response = await service.getAllApplications();
      setAppName(response);
    } catch (err) {
      console.log(err);
    }
  }

  async function edit() {
    setshowCA(false);
  }
  async function view() {
    setshowVA(true);
  }

  useEffect(() => {
    display();
    setCreated(false);
    sessionStorage.setItem("permitCreate", false);
    sessionStorage.setItem("permitOpen", false);
    sessionStorage.setItem("permitToDo", false);
    sessionStorage.setItem("permitDoing", false);
    sessionStorage.setItem("permitDone", false);
    sessionStorage.setItem("PM", false);
  }, [created]);

  return (
    <>
      <div className="flex-row">
        <div style={{ width: "30vw" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Table
              style={{
                margin: "20px",
                borderCollapse: "separate",
                borderSpacing: "0px 5px",
              }}
            >
              <tbody>
                <tr>
                  <th>Applications</th>
                  {/* {PL ? <Button onClick={display}>Create App</Button> : <></>} */}
                  {!showCA && PL && (
                    <Button onClick={display}>Create App</Button>
                  )}
                </tr>
                {appName.map((app) => {
                  return (
                    <>
                      <tr key={app.App_Acronym}>
                        <td>{app.App_Acronym}</td>
                        <td>
                          {PL ? (
                            <Button
                              style={{ marginRight: "10px" }}
                              variant="outline-primary"
                              onClick={(e) => {
                                e.preventDefault();

                                edit();
                                setEditApp(app.App_Acronym);
                              }}
                            >
                              Edit
                            </Button>
                          ) : (
                            <Button
                              style={{ marginRight: "10px" }}
                              variant="outline-primary"
                              onClick={(e) => {
                                e.preventDefault();

                                view();
                                setEditApp(app.App_Acronym);
                              }}
                            >
                              View App
                            </Button>
                          )}

                          <Link to={`/application/${app.App_Acronym}`}>
                            <Button>View Board</Button>
                          </Link>
                        </td>
                      </tr>
                    </>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
        <div>
          <div>
            {PL ? (
              showCA && <CreateApplication setCreate={setCreated} />
            ) : (
              <></>
            )}
          </div>
          <div>{PL && !showCA && <EditApp editappname={editapp} />}</div>
          <div>{PL ? <></> : showVA && <ViewApp editappname={editapp} />}</div>
        </div>
      </div>

      {/* <EditApp app={editapp} /> */}
    </>
  );
}

export default AppNorm;

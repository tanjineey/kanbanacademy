import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

//styles
import "../styles/form.css";

import { Service } from "../services/Service";
//components
import Button from "react-bootstrap/Button";
import { TwitterPicker } from "react-color";

function CreatePlan(props) {
  const service = new Service();
  const { app } = useParams();
  const [planName, setPlanName] = useState("");
  const [planNotes, setPlanNotes] = useState("");
  const [planStart, setPlanStart] = useState("");
  const [planEnd, setPlanEnd] = useState("");
  const [planColor, setPlanColor] = useState("");
  //   const [plan_app_acronym, setplanAppAcronym] = useState();
  const [result, setResult] = useState("");
  const [errcolor, setErrColor] = useState(false);

  const styleCorrResult = { color: "green" };
  const styleErrResult = { color: "#f84f31" };

  async function CreatePlan() {
    console.log(planName, planNotes);
    const plandetails = {
      Plan_MVP_name: planName,
      Plan_Notes: planNotes,
      Plan_startDate: planStart,
      Plan_endDate: planEnd,
      Plan_color: planColor,
      Plan_app_acronym: app,
    };
    // console.log(plandetails);
    const response = await service.createPlan(plandetails);
    console.log(response);
    if (response.success) {
      const form = document.getElementById("form");
      setPlanName("");
      setPlanStart("");
      setPlanEnd("");
      form.reset();
      setResult(response.message);
      setErrColor(false);
      props.create(true);
    } else {
      setErrColor(true);
      setResult(response.message);
    }
  }

  return (
    <>
      <div style={{ marginTop: "10px" }}>
        <h4>Create New Plan</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            CreatePlan();
          }}
          id="form"
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                // width: "500px",
              }}
              id="parentdiv"
            >
              <div className="flex-row">
                <label className="label-short" htmlFor="planName">
                  Plan Name:
                </label>
                <input
                  required
                  maxLength="255"
                  size="15"
                  type="text"
                  id="planName"
                  name="planName"
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </div>
              <div style={{ margin: "10px 0px" }}>
                <label className="label-short" htmlFor="planName">
                  Plan Color:
                </label>
                <div
                  style={{
                    backgroundColor: `${planColor}`,
                    width: 100,
                    height: 25,
                    border: "1px solid #363636",
                  }}
                ></div>
                <TwitterPicker
                  required
                  color={planColor}
                  onChange={(color) => {
                    setPlanColor(color.hex);
                  }}
                />
                {/* <input
                  required
                  size="15"
                  type="text"
                  id="planName"
                  name="planName"
                  onChange={(e) => setplanColor(e.target.value)}
                /> */}
              </div>
              <div className="flex-row">
                <div>
                  <label style={{ width: "100px" }} htmlFor="planNotes">
                    Plan Notes:
                  </label>
                </div>
                <textarea
                  rows="6"
                  cols="25"
                  type="text"
                  id="planNotes"
                  name="planNotes"
                  onChange={(e) => setPlanNotes(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div>
                  <div className="flex-row">
                    <label htmlFor="startdate" style={{ width: "100px" }}>
                      Start Date
                    </label>
                    <div style={{ width: "150px" }}>
                      {" "}
                      <input
                        type="date"
                        onChange={(e) =>
                          setPlanStart(e.target.value).toISOString()
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex-row">
                      <label htmlFor="enddate" style={{ width: "100px" }}>
                        End Date
                      </label>
                      <div style={{ width: "150px" }}>
                        {" "}
                        <input
                          type="date"
                          onChange={(e) =>
                            setPlanEnd(e.target.value).toISOString()
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!errcolor ? (
            <p style={styleCorrResult}>{result}</p>
          ) : (
            <p style={styleErrResult}>{result}</p>
          )}

          <Button variant="outline-success" type="submit">
            Create
          </Button>
        </form>
      </div>
    </>
  );
}

export default CreatePlan;

import React, { useEffect, useState } from "react";
import { Service } from "../services/Service";

//components
import Button from "react-bootstrap/Button";
import { TwitterPicker } from "react-color";
function EditPlan(props) {
  const service = new Service();
  const [planName, setPlanName] = useState("");
  const [planNotes, setPlanNotes] = useState("");
  const [planStart, setPlanStart] = useState("");
  const [planEnd, setPlanEnd] = useState("");
  const [planColor, setPlanColor] = useState("FF6900");
  //   const [plan_app_acronym, setplanAppAcronym] = useState();
  const [result, setResult] = useState("");
  const [errcolor, setErrColor] = useState(false);

  const styleCorrResult = { color: "green" };
  const styleErrResult = { color: "#f84f31" };
  async function getSinglePlan() {
    try {
      const app = {
        Plan_app_Acronym: props.editappname,
        Plan_MVP_name: props.editplanname,
      };
      const response = await service.getSinglePlan(app);
      console.log(response);
      if (response.success) {
        setPlanName(response.data[0].Plan_MVP_name);
        setPlanNotes(response.data[0].Plan_Notes);
        setPlanStart(response.data[0].Plan_startDate);
        setPlanEnd(response.data[0].Plan_endDate);
        setPlanColor(response.data[0].Plan_color);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function editPlan() {
    try {
      const app = {
        Plan_Notes: planNotes,
        Plan_startDate: planStart,
        Plan_endDate: planEnd,
        Plan_color: planColor,
        Plan_app_Acronym: props.editappname,
        Plan_MVP_name: props.editplanname,
      };

      console.log(app);
      const response = await service.editPlan(app);

      // const form = document.getElementById("form");
      if (response.success) {
        // form.reset();
        const resultmsg = response.message;
        console.log(props.edited);
        props.created(true);
        setResult(resultmsg);
        setErrColor(false);
        // props.setCreate(true);
      } else {
        const resultmsg = response.message;
        setResult(resultmsg);
        setErrColor(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getSinglePlan();
  }, [props.editplanname]);

  return (
    <>
      <div style={{ margin: "10px 0px" }}>
        <h4>Edit Plan: {props.editplanname}</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            editPlan();
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
                  size="15"
                  type="text"
                  id="planName"
                  name="planName"
                  disabled
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
              </div>
              <div style={{ margin: "10px 0px" }}>
                <label className="label-short" htmlFor="planColor">
                  Plan Color:
                </label>
                <div
                  style={{
                    backgroundColor: `${planColor}`,
                    width: 100,
                    height: 25,
                    border: "2px solid white",
                  }}
                ></div>
                {/* <TwitterPicker
                  disabled
                  color={planColor}
                  onChange={(color) => {
                    setPlanColor(color.hex);
                  }}
                /> */}
                {/* <input
                  required
                  size="15"
                  type="text"
                  id="planColor"
                  name="planColor"
                  value={planColor}
                  onChange={(e) => setPlanColor(e.target.value)}
                /> */}
              </div>
              <div className="flex-row">
                <div>
                  <label style={{ width: "105px" }} htmlFor="planNotes">
                    Plan Notes:
                  </label>
                </div>
                <textarea
                  rows="6"
                  cols="25"
                  type="text"
                  id="planNotes"
                  name="planNotes"
                  value={planNotes}
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
                        value={planStart}
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
                          value={planEnd}
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
            Update
          </Button>
        </form>
      </div>
    </>
  );
}

export default EditPlan;

import React, { useEffect, useState } from "react";
//service
import { Service } from "../services/Service";
//styles
import "../styles/form.css";

//mui components
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "react-bootstrap/Button";

function CreateApplication(props) {
  const service = new Service();
  const [appName, setAppName] = useState("");
  const [rnum, setrnum] = useState("");
  const [appdesc, setappdesc] = useState("");
  const [appstartdate, setappstartdate] = useState("");
  const [appenddate, setappenddate] = useState("");
  const [usergroups, setUsergroups] = useState([]);
  const [permitcreate, setpermitcreate] = useState([]);
  const [permitopen, setpermitopen] = useState([]);
  const [permittodo, setpermittodo] = useState([]);
  const [permitdoing, setpermitdoing] = useState([]);
  const [permitdone, setpermitdone] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [result, setResult] = useState("");
  const [errcolor, setErrColor] = useState(false);

  const styleCorrResult = { color: "green" };
  const styleErrResult = { color: "#f84f31" };

  async function createApp() {
    // e.preventDefault();
    try {
      const app = {
        appname: appName,
        rnumber: rnum,
        appdesc,
        appstartdate,
        appenddate,
        permitcreate,
        permitopen,
        permittodo,
        permitdoing,
        permitdone,
      };

      // console.log(app);
      const response = await service.createApplication(app);
      const form = document.getElementById("form");
      if (response.success) {
        setAppName("");
        setrnum("");
        setappdesc("");
        setappstartdate("");
        setappenddate("");
        setpermitcreate([]);
        setpermitopen([]);
        setpermittodo([]);
        setpermitdoing([]);
        setpermitdone([]);
        const resultmsg = response.message;
        setResult(resultmsg);
        setErrColor(false);
        props.setCreate(true);
        form.reset();
      } else {
        const resultmsg = response.message;
        setResult(resultmsg);
        setErrColor(true);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function getGroups() {
    const responsegrp = await service.getGroups();
    // console.log(responsegrp);
    setUsergroups(responsegrp);
  }
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
  const handlePermitCreate = (event) => {
    const {
      target: { value },
    } = event;
    setpermitcreate(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handlePermitOpen = (event) => {
    const {
      target: { value },
    } = event;
    setpermitopen(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handlePermitTodo = (event) => {
    const {
      target: { value },
    } = event;
    setpermittodo(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handlePermitDoing = (event) => {
    const {
      target: { value },
    } = event;
    setpermitdoing(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  const handlePermitDone = (event) => {
    const {
      target: { value },
    } = event;
    setpermitdone(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  useEffect(() => {
    getGroups();
  }, []);
  return (
    <>
      <div style={{ marginTop: "10px" }}>
        <h4>Create New App</h4>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createApp();
          }}
          id="form"
        >
          <div style={{ display: "flex", width: "450px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "500px",
              }}
              id="parentdiv"
            >
              <div className="flex-row">
                <div className="flex-row">
                  <label className="label-short" htmlFor="appName">
                    App Name:
                  </label>
                  <input
                    required
                    size="15"
                    maxLength="255"
                    type="text"
                    id="appName"
                    name="appName"
                    onChange={(e) => setAppName(e.target.value)}
                  />
                </div>
                <div className="flex-row">
                  <label
                    style={{ marginLeft: "15px" }}
                    className="label-short"
                    htmlFor="Rnum"
                  >
                    R number:
                  </label>
                  <input
                    required
                    type="text"
                    id="Rnum"
                    name="Rnum"
                    onChange={(e) => setrnum(e.target.value)}
                  />
                </div>
              </div>

              <label htmlFor="appdesc">Application Description</label>
              <textarea
                style={{ height: "150px", width: "50vw" }}
                type="text"
                id="appdesc"
                name="appdesc"
                onChange={(e) => setappdesc(e.target.value)}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <div className="flex-row">
                  <div>
                    <label
                      className="label-long"
                      htmlFor="startdate"
                      style={{ width: "100px" }}
                    >
                      Start Date
                    </label>
                  </div>
                  <div style={{ width: "150px" }}>
                    {" "}
                    <input
                      type="date"
                      onChange={(e) =>
                        setappstartdate(e.target.value).toISOString()
                      }
                    />
                  </div>
                  <div className="flex-row">
                    <div>
                      <label
                        className="label-long"
                        htmlFor="enddate"
                        style={{ width: "100px", marginLeft: "15px" }}
                      >
                        End Date
                      </label>
                    </div>
                    <div style={{ width: "150px" }}>
                      {" "}
                      <input
                        type="date"
                        onChange={(e) =>
                          setappenddate(e.target.value).toISOString()
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "500px",
                }}
              >
                <div>
                  <label htmlFor="create">Create:</label>

                  <FormControl sx={{ width: 150 }}>
                    <Select
                      labelId="create"
                      id="create"
                      value={permitcreate}
                      onChange={handlePermitCreate}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                    >
                      {usergroups.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <label htmlFor="open">Open:</label>

                  <FormControl sx={{ width: 150, marginLeft: "15px" }}>
                    <Select
                      labelId="open"
                      id="open"
                      value={permitopen}
                      onChange={handlePermitOpen}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                    >
                      {usergroups.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <label htmlFor="todo">To-do:</label>

                  <FormControl sx={{ width: 150, marginLeft: "15px" }}>
                    <Select
                      labelId="todo"
                      id="todo"
                      value={permittodo}
                      onChange={handlePermitTodo}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                    >
                      {usergroups.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <label htmlFor="doing">Doing:</label>

                  <FormControl sx={{ width: 150, marginLeft: "15px" }}>
                    <Select
                      labelId="doing"
                      id="doing"
                      value={permitdoing}
                      onChange={handlePermitDoing}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                    >
                      {usergroups.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div>
                  <label htmlFor="done">Done:</label>

                  <FormControl sx={{ width: 150, marginLeft: "15px" }}>
                    <Select
                      labelId="done"
                      id="done"
                      value={permitdone}
                      onChange={handlePermitDone}
                      input={<OutlinedInput />}
                      MenuProps={MenuProps}
                    >
                      {usergroups.map((name) => (
                        <MenuItem key={name} value={name}>
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>

          <br />
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

export default CreateApplication;

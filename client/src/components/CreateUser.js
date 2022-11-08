import React, { useEffect, useState } from "react";
import Axios from "axios";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Button from "react-bootstrap/Button";

function CreateUser(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [usergroup, setUsergroup] = useState([]);
  const [status, setStatus] = useState(["Active"]);
  const [result, setResult] = useState("");
  const [personName, setPersonName] = useState([]);
  const [errcolor, setErrColor] = useState(false);

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

  async function display() {
    // e.preventDefault();
    console.log("finding user to display");
    try {
      // const userget = sessionStorage.getItem("kanbanAppUsername");
      const response = await Axios.get(`/getgroups`);
      // var groupList = response.data.split(",");
      console.log(response.data);
      if (response) {
        setUsergroup(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    display();
  }, []);
  function handleChange(event) {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  }

  const statusList = ["Active", "Inactive"];
  const handleChangeStatus = (event) => {
    const {
      target: { value },
    } = event;
    setStatus(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  async function createUser(e) {
    e.preventDefault();
    const form = document.getElementById("form");
    try {
      const response = await Axios.post("/createuser", {
        username: username,
        password: password,
        usergroup: personName,
        email: email,
        status: status,
      });
      if (response.data.data) {
        form.reset();
        setPersonName([]);
        console.log("props");
        props.setCreate(true);
        const resultmsg = response.data.message.toString();
        console.log(resultmsg);
        setResult(resultmsg);
        setErrColor(false);
        setStatus("Active");
      } else {
        const resultmsg = response.data.message.toString();
        console.log(resultmsg);
        setResult(resultmsg);
        setErrColor(true);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div style={{ marginTop: "10px", maxWidth: "500px" }}>
        <h3>Create new user</h3>
        <form
          className="login100-form validate-form flex-sb flex-w"
          onSubmit={createUser}
          id="form"
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginRight: "10px",
              }}
            >
              <label htmlFor="username">Username:</label>
              <label htmlFor="password">Password:</label>
              <label htmlFor="email">Email:</label>
              <label style={{ marginBottom: "35px" }} htmlFor="usergroup">
                User group:
              </label>
              <label htmlFor="status">Status:</label>
            </div>
            <div>
              <input
                required
                type="text"
                id="username"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
              />
              <br />
              <input
                required
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br />

              <input
                type="text"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <br />
              <FormControl sx={{ mb: 1, width: 250 }}>
                <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={personName}
                  onChange={(e) => handleChange(e)}
                  input={<OutlinedInput />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {usergroup.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={personName.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <br />
              <FormControl sx={{ width: 200 }}>
                <Select
                  labelId="demo-multiple-name-label"
                  id="demo-multiple-name"
                  value={status}
                  onChange={handleChangeStatus}
                  input={<OutlinedInput />}
                  MenuProps={MenuProps}
                >
                  {statusList.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <br />
              {/* <button type="submit" onClick={(e) => props.setCreate(true)}> */}

              {/* <p style={{ color: "red" }}>{result}</p> */}
            </div>
          </div>{" "}
          {errcolor ? (
            <p style={{ color: "red" }}>{result}</p>
          ) : (
            <p style={{ color: "green" }}>{result}</p>
          )}
          <Button type="submit">Create</Button>
        </form>
      </div>
    </>
  );
}
{
  /* <input
              required
              type="text"
              id="usergroup"
              name="usergroup"
              onChange={(e) => setUsergroup(e.target.value)}
            /> */
  // const names = [
  //   "Oliver Hansen",
  //   "Van Henry",
  //   "April Tucker",
  //   "Ralph Hubbard",
  //   "Omar Alexander",
  //   "Carlos Abbott",
  //   "Miriam Wagner",
  //   "Bradley Wilkerson",
  //   "Virginia Andrews",
  //   "Kelly Snyder",
  // ];
  //multiselect default
  //   <FormControl sx={{ mb: 1, width: 300 }}>
  //   <Select
  //     labelId="demo-multiple-checkbox-label"
  //     id="demo-multiple-checkbox"
  //     multiple
  //     value={personName}
  //     onChange={(e) => handleChange(e)}
  //     input={<OutlinedInput />}
  //     renderValue={(selected) => selected.join(", ")}
  //     MenuProps={MenuProps}
  //   >
  //     {names.map((name) => (
  //       <MenuItem key={name} value={name}>
  //         <Checkbox checked={personName.indexOf(name) > -1} />
  //         <ListItemText primary={name} />
  //       </MenuItem>
  //     ))}
  //   </Select>
  // </FormControl>
}
export default CreateUser;

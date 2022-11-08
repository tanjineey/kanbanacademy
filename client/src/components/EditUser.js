import React, { useEffect, useState } from "react";
import Axios from "axios";
//React components
//material ui components
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import Button from "react-bootstrap/Button";

function EditUser(props) {
  const styleResult = {
    color: "green",
  };
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [email, setEmail] = useState([]);
  const [usergroup, setUsergroup] = useState([]);
  const [status, setStatus] = useState([]);
  const [result, setResult] = useState([]);
  const [usergroupedit, setuserGroupEdit] = useState([]);
  const [admin, setAdmin] = useState([]);

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
  function handleChange(event) {
    const {
      target: { value },
    } = event;
    if (value[0] == "") {
      value.splice(0, 1);
    }
    setuserGroupEdit(
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

  async function display() {
    // e.preventDefault();
    console.log("finding user to display");
    try {
      const response = await Axios.post(`/finduser/${props.user}`);
      const responsegrp = await Axios.get(`/getgroups`);
      const responseadmin = await Axios.post("/checkAdmin", {
        username: props.user,
      });
      if (response && responsegrp) {
        setUsername(response.data.username);
        setPassword("");
        setEmail(response.data.email);
        var groupList = response.data.usergroup.split(",");
        setUsergroup(responsegrp.data);
        setuserGroupEdit(groupList);
        setStatus(response.data.status);
        setAdmin(responseadmin.data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    display();
  }, []);
  async function editUser(e) {
    e.preventDefault();
    console.log(usergroupedit);

    try {
      const response = await Axios.post("/editUser", {
        username,
        password,
        email,
        usergroupedit,
        status,
      });
      if (response.data.data) {
        props.setCreate(true);
        setResult(response.data.message);
      } else {
        setResult(response.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <form onSubmit={editUser}>
        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginRight: "10px",
            }}
          >
            <label style={{ marginBottom: "10px" }} htmlFor="username">
              Username:
            </label>
            <label htmlFor="password">Password:</label>
            <label htmlFor="email">Email:</label>
            <label style={{ marginBottom: "35px" }} htmlFor="usergroup">
              User group:
            </label>
            <label style={{ display: "flex" }} htmlFor="status">
              Status:
            </label>
          </div>
          <div style={{ width: "300px" }}>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled
            />
            <br />
            <input
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <FormControl sx={{ mb: 1, width: 300 }}>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={usergroupedit}
                onChange={(e) => handleChange(e)}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {usergroup.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={usergroupedit.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <br />
            <FormControl sx={{ width: 300 }}>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={status}
                disabled={admin && status}
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
          </div>
        </div>

        <p style={styleResult}>{result}</p>
        <Button type="submit">Update</Button>
      </form>{" "}
    </>
  );
}

export default EditUser;

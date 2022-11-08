import React, { useEffect, useState } from "react";
import Axios from "axios";
import Button from "react-bootstrap/Button";

function DisplayOne() {
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [email, setEmail] = useState([]);
  const [usergroupedit, setuserGroupEdit] = useState([]);
  const [status, setStatus] = useState([]);
  const [result, setResult] = useState([]);
  const [errcolor, setErrColor] = useState(false);

  async function display() {
    // e.preventDefault();
    try {
      const userget = sessionStorage.getItem("kanbanAppUsername");
      const response = await Axios.post("/finduser", { username: userget });
      if (response) {
        setUsername(response.data.username);
        setPassword("");
        setuserGroupEdit(response.data.usergroup);
        setEmail(response.data.email);
        setStatus(response.data.status);
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
    try {
      const response = await Axios.post("/edituser", {
        username,
        password,
        usergroupedit,
        email,
        status,
      });
      if (response.data.data) {
        setResult(response.data.message);
        setErrColor(false);
      } else {
        setResult(response.data.message);
        setErrColor(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="container-login100">
        <div className="wrap-login100 p-t-50 p-b-90">
          <h3>Personal information</h3>

          <form className="login100-form validate-form" onSubmit={editUser}>
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
              </div>
              <div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
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

                {/* <input
                  type="text"
                  id="usergroup"
                  name="usergroup"
                  value={usergroupedit}
                  disabled
                />
                <br />
                <input
                  type="text"
                  id="status"
                  name="status"
                  value={status}
                  disabled
                  onChange={(e) => setStatus(e.target.value)}
                /> */}
                <br />
              </div>
            </div>
            {errcolor ? (
              <p style={{ color: "red" }}>{result}</p>
            ) : (
              <p style={{ color: "green" }}>{result}</p>
            )}
            <Button type="submit">Update</Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default DisplayOne;

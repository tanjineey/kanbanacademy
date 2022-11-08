import React, { useEffect, useContext, useState } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function Login() {
  const styleResult = {
    color: "#f84f31",
  };
  const appDispatch = useContext(DispatchContext);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [result, setResult] = useState();
  async function login(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/loginuser", {
        username,
        password,
      });
      if (response.data) {
        setResult(response.data.message);
        console.log(response.data);

        if (response.data.message === true) {
          const adminTrue = await Axios.post("/checkgroup", {
            username: response.data.username,
            usergroup: "admin",
          });
          const PLTrue = await Axios.post("/checkgroup", {
            username: response.data.username,
            usergroup: "projectlead",
          });
          if (adminTrue.data && PLTrue.data) {
            console.log("admin and PL true");
            appDispatch({ type: "PL", data: { username: username } });
            appDispatch({ type: "admin", data: { username: username } });
            return;
          }
          if (adminTrue.data) {
            console.log("admin true");
            appDispatch({ type: "admin", data: { username: username } });
            return;
          }
          if (PLTrue.data) {
            appDispatch({ type: "PL", data: { username: username } });
            return;
          } else {
            appDispatch({ type: "login", data: response.data });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100 p-t-50 p-b-90">
            <form
              onSubmit={login}
              className="login100-form validate-form flex-sb flex-w"
            >
              <span className="login100-form-title p-b-51">Kanban App</span>
              <div
                className="wrap-input100 validate-input m-b-16"
                data-validate="Username is required"
              >
                <input
                  className="input100"
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                />
                <span className="focus-input100"></span>
              </div>
              <div
                className="wrap-input100 validate-input m-b-16"
                data-validate="Password is required"
              >
                <input
                  className="input100"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <span className="focus-input100"></span>
              </div>
              <p style={styleResult}>{result}</p>
              <div className="container-login100-form-btn m-t-17">
                <button className="login100-form-btn" type="submit">
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

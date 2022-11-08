import React, { useEffect, useContext } from "react";

// import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
// import Axios from "axios";
//components
import DisplayUsers from "./DisplayUsers";
import Header from "./Header";
// import DisplayOne from "./DisplayOne";
import Error from "./Error";
function UserManage() {
  // const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  var admin = sessionStorage.getItem("admin");
  // async function checkAdmin(e) {
  //   try {
  //     const username = sessionStorage.getItem("kanbanAppUsername");
  //     const response = await Axios.post("/checkadmin", { username });
  //     if (response.data) {
  //       console.log("running this");
  //       appDispatch({ type: "admin", data: { username: username } });
  //     } else {
  //       sessionStorage.setItem("admin", false);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  // useEffect(() => {
  //   checkAdmin();
  // }, []);

  return (
    <>
      <Header />
      {appState.isAdmin || admin ? (
        <>
          <DisplayUsers />
        </>
      ) : (
        <Error />
      )}
    </>
  );
}

export default UserManage;

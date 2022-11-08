import React, { useEffect, useContext } from "react";
import StateContext from "../StateContext";
//components
import Header from "./Header";
import AppNorm from "./AppNorm";
function Home() {
  const appState = useContext(StateContext);
  return (
    <>
      <Header />
      <h2 style={{ marginLeft: "20px" }}>
        Hello,<strong> {appState.user.username}</strong>{" "}
      </h2>
      <div>
        <AppNorm />
      </div>
      {/* <AppPL /> */}
    </>
  );
}

export default Home;

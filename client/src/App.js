import "./App.css";
import React, { useState, useEffect, useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Axios from "axios";
//components

import Login from "./components/Login";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

//import Components
import UserManage from "./components/UserManage";
import Home from "./components/Home";
import Error from "./components/Error";
import Profile from "./components/Profile";
import Application from "./components/Application";
import { typographyClasses } from "@mui/material";

Axios.defaults.baseURL = "http://localhost:3001";

function App() {
  const initialState = {
    // loggedIn: Boolean(sessionStorage.getItem("kanbanAppToken")),
    // loggedIn: true,
    isAdmin: false,
    isPL: Boolean(false),
    user: {
      // token: sessionStorage.getItem("kanbanAppToken"),
      username: sessionStorage.getItem("kanbanAppUsername"),
    },
  };

  function ourReducer(state, action) {
    switch (action.type) {
      case "login":
        return {
          loggedIn: true,
          user: action.data,
          isPL: state.isPL,
        };
      case "logout":
        return { loggedIn: false, isAdmin: false, isPL: false, user: "" };
      case "admin":
        return {
          loggedIn: true,
          isAdmin: true,
          isPL: state.isPL,
          user: action.data,
        };
      case "PL":
        return {
          loggedIn: true,
          isAdmin: false,
          isPL: true,
          user: action.data,
        };
    }
  }
  const [state, dispatch] = useReducer(ourReducer, initialState);
  useEffect(() => {
    console.log(state.isPL);
    if (state.loggedIn) {
      sessionStorage.setItem("kanbanAppUsername", state.user.username);
    }
    if (state.isAdmin) {
      sessionStorage.setItem("admin", state.isAdmin);
    }
    if (state.isPL) {
      sessionStorage.setItem("PL", state.isPL);
    }
    // if (!state.isPL) {
    //   sessionStorage.setItem("PL", state.isPL);
    //   // console.log(typeof state.isPL);
    // }
  }, [state.loggedIn]);

  // useEffect(() => {
  //   if (state.isAdmin) {
  //     sessionStorage.setItem("admin", state.isAdmin);
  //   }
  // }, [state.isAdmin]);
  // useEffect(() => {
  //   if (state.isAdmin) {
  //     sessionStorage.setItem("admin", state.isAdmin);
  //   }
  // }, [state.isAdmin]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                state.loggedIn ||
                sessionStorage.getItem("kanbanAppUsername") !== null ? (
                  <Home />
                ) : (
                  <Login />
                )
              }
            />

            <Route
              path="/usermanage"
              element={
                state.loggedIn ||
                sessionStorage.getItem("kanbanAppUsername") !== null ? (
                  <UserManage />
                ) : (
                  <Error />
                )
              }
            />
            <Route
              path="/profile"
              element={
                state.loggedIn ||
                sessionStorage.getItem("kanbanAppUsername") !== null ? (
                  <Profile />
                ) : (
                  <Error />
                )
              }
            />
            <Route path="/application/:app" element={<Application />} />
          </Routes>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;

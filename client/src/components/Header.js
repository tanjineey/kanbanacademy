import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
//styles
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
function Header() {
  const styleNav = {
    justifyContent: "flex-start",
  };
  const styleButton = {
    color: "white",
    display: "inline-block",
    width: "100px",
  };
  const styleHome = {
    fontSize: "20px",
    marginRight: "20px",
  };
  const styleProfile = {
    marginRight: "20px",
  };
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  var admin = sessionStorage.getItem("admin");
  async function handleLogout(e) {
    e.preventDefault();
    // e.stopPropagation();

    try {
      appDispatch({ type: "logout" });
      sessionStorage.removeItem("kanbanAppUsername");
      sessionStorage.removeItem("admin");
      sessionStorage.removeItem("PL");
      sessionStorage.removeItem("permitCreate");
      sessionStorage.removeItem("permitOpen");
      sessionStorage.removeItem("permitToDo");
      sessionStorage.removeItem("permitDoing");
      sessionStorage.removeItem("permitDone");
      sessionStorage.removeItem("PM");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container style={styleNav}>
          <Link style={styleHome} to="/">
            MyKanban
          </Link>
          <Nav className="me-auto">
            <Nav.Link>
              {appState.isAdmin || admin ? (
                <Link to="/usermanage">User Management</Link>
              ) : (
                <></>
              )}
            </Nav.Link>
            <Nav.Link></Nav.Link>
          </Nav>
        </Container>

        <Link style={styleProfile} to="/profile">
          {appState.user.username}
        </Link>

        <form>
          <Button onClick={handleLogout}>
            <Link style={styleButton} to="/">
              Sign out
            </Link>
          </Button>
        </form>
      </Navbar>
    </>
  );
}

export default Header;

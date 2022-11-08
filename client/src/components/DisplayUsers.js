import React, { useEffect, useState } from "react";
import Axios from "axios";
import Table from "react-bootstrap/Table";
import CreateUser from "./CreateUser";
import CreateGroup from "./CreateGroup";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EditUser from "./EditUser";

function DisplayUsers() {
  const [users, getusers] = useState([]);
  const [isCUShown, setIsCUShown] = useState(true);
  const [created, setCreated] = useState(false);
  const [editUser, setEditUser] = useState([""]);
  const [modalShow, setModalShow] = useState(false);
  const handleShow = () => {
    setModalShow(true);
  };
  const handleClose = () => {
    setModalShow(false);
  };
  async function display(e) {
    // e.preventDefault();
    try {
      const response = await Axios.get("/getuser");
      getusers(response.data);
    } catch (err) {
      console.log(err);
    }
  }
  async function showCreateUser(e) {
    setIsCUShown(true);
    // setIsCGShown(false);
  }
  async function showCreateGroup(e) {
    // setIsCGShown((current) => !current);
    setIsCUShown(false);
  }
  useEffect(() => {
    display();
    handleClose();
    setCreated(false);
  }, [created]);

  // useEffect(() => {
  //   handleClose();
  // }, [created]);
  return (
    <>
      <div style={{ margin: "20px" }}>
        <b>User Management</b>
      </div>
      <div style={{ height: "400px", display: "flex" }}>
        <div style={{ margin: "20px", height: "400px", overflow: "auto" }}>
          <Table style={{ width: "60vw" }} striped>
            <tbody>
              <tr>
                <th> Usernames </th>
                <th> User Group</th>
                <th>Email</th>
                <th> Status</th>
                <th> Actions</th>
              </tr>
              {users.map((user) => {
                return (
                  <>
                    <tr key={user.username}>
                      <td>{user.username}</td>
                      <td>{user.usergroup}</td>
                      <td>{user.email}</td>
                      <td>{user.status}</td>
                      <td>
                        <button
                          style={{ margin: "auto" }}
                          className="button-2"
                          onClick={(e) => {
                            setEditUser(user.username);
                            {
                              handleShow();
                            }
                          }}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </Table>
          <Modal
            size="small"
            show={modalShow}
            onHide={handleClose}
            backdrop="static"
          >
            <Modal.Header closeButton>Editing User: {editUser}</Modal.Header>
            <Modal.Body>
              <EditUser user={editUser} setCreate={setCreated} />
            </Modal.Body>
          </Modal>
        </div>
        <div style={{ height: "400px" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <button
              onClick={showCreateUser}
              className="button-22"
              style={{ margin: "5px" }}
            >
              Create User
            </button>
            <button
              onClick={showCreateGroup}
              className="button-22"
              style={{ margin: "5px" }}
            >
              Create Group
            </button>
          </div>
          <div>{isCUShown && <CreateUser setCreate={setCreated} />}</div>
          <div>{!isCUShown && <CreateGroup />}</div>
        </div>
      </div>
    </>
  );
}

export default DisplayUsers;

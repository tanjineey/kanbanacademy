import React, { useEffect, useState } from "react";
import { Card, CardContent, Grid, Typography, Box, Chip } from "@mui/material";
import { Service } from "../services/Service";
import { makeStyles } from "@mui/styles";
import Modal from "react-bootstrap/Modal";
import EditTask from "../components/EditTask";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const useStyles = makeStyles({
  carddesc: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

function BoardList(props) {
  const service = new Service();
  const classes = useStyles();
  const [state, setState] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [viewtask, setViewTask] = useState("");
  const [appName, setAppName] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [edited, setEdited] = useState(false);
  const [promoted, setPromoted] = useState(false);
  const [permitopen, setPermitopen] = useState(false);
  const [permitcreate, setPermitcreate] = useState(false);
  const [permittodo, setPermittodo] = useState(false);
  const [permitdoing, setPermitdoing] = useState(false);
  const [permitdone, setPermitdone] = useState(false);

  async function Auth() {
    setAppName(props.app);
    setState(props.state);
    setPermitopen(props.permitopen);
    setPermitcreate(props.permitcreate);
    setPermittodo(props.permittodo);
    setPermitdoing(props.permitdoing);
    setPermitdone(props.permitdone);
    console.log(
      props.permitopen,
      props.permitcreate,
      props.permittodo,
      props.permitdoing,
      props.permitdone
    );
  }
  async function getTasks() {
    // console.log(props.state);
    const app = {
      Task_app_Acronym: props.app,
      Task_state: props.state,
    };
    try {
      const response = await service.getTasksByState(app);
      setTaskList(response);
    } catch (err) {
      console.log(err);
    }
    // setTaskList(response);
  }
  const handleShow = () => {
    setModalShow(true);
  };
  const handleClose = () => {
    setModalShow(false);
  };
  async function refreshTasks() {
    setEdited(!edited);
    console.log("refreshing tasks");
  }
  async function promoteTask(taskid) {
    console.log("promoting task");
    try {
      const app = {
        Task_owner: sessionStorage.getItem("kanbanAppUsername"),
        Task_state: props.state,
        Task_id: taskid,
        Task_createDate: new Date(),
      };
      const response = await service.promoteTask(app);
      console.log(response);
      if (response.success) {
        getTasks();
        props.setRefresh(true);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async function demoteTask(taskid) {
    console.log("demoting task");
    try {
      const app = {
        Task_owner: sessionStorage.getItem("kanbanAppUsername"),
        Task_state: props.state,
        Task_id: taskid,
        Task_createDate: new Date(),
      };
      const response = await service.demoteTask(app);
      console.log(response);
      if (response.success) {
        getTasks();
        props.setRefresh(true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getTasks();
    Auth();

    props.setRefresh(false);
  }, [props.created, edited, props.refresh]);

  return (
    <>
      <Grid mb={2}>
        <Grid item xs={12} mb={2}>
          {taskList.map((task) => {
            return (
              <>
                <Card
                  sx={{
                    marginBottom: "10px",
                    borderLeft: `5px solid ${task.Task_color}`,
                  }}
                  // onClick={(e) => {
                  //   e.stopPropagation();
                  //   setViewTask(task.Task_id);
                  //   handleShow();
                  // }}
                >
                  <CardContent sx={{ padding: "8px 12px" }}>
                    <Grid container>
                      <Grid
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewTask(task.Task_id);
                          handleShow();
                        }}
                        item
                        xs={8}
                      >
                        <Typography component="h1" variant="h6">
                          {task.Task_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        {(props.state == "Doing" && props.permitdoing) ||
                        (props.state == "Done" && props.permitdone) ? (
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                              outline: "inherit",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              demoteTask(task.Task_id);
                            }}
                          >
                            <ArrowLeftIcon sx={{ fontSize: 30 }} />
                          </button>
                        ) : (
                          <></>
                        )}
                        {(props.state == "Open" && props.permitopen) ||
                        (props.state == "ToDo" && props.permittodo) ||
                        (props.state == "Doing" && props.permitdoing) ||
                        (props.state == "Done" && props.permitdone) ? (
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                              outline: "inherit",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              promoteTask(task.Task_id);
                            }}
                          >
                            <ArrowRightIcon sx={{ fontSize: 30 }} />
                          </button>
                        ) : (
                          <></>
                        )}
                      </Grid>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{ marginBottom: "1px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewTask(task.Task_id);
                        handleShow();
                      }}
                    >
                      <Typography
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        variant="body2"
                      >
                        Owner: {task.Task_owner}
                      </Typography>
                    </Grid>

                    <Grid
                      container
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewTask(task.Task_id);
                        handleShow();
                      }}
                    >
                      <Grid item xs={6}>
                        {task.Task_plan ? (
                          <Chip
                            size="small"
                            label={task.Task_plan}
                            style={{
                              backgroundColor: task.Task_color,
                              color: "#000000",
                            }}
                          />
                        ) : (
                          <></>
                        )}
                      </Grid>
                      <Grid item xs={6}>
                        <b>{task.Task_id}</b>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </>
            );
          })}{" "}
          <Modal
            size="lg"
            show={modalShow}
            onHide={handleClose}
            // backdrop="static"
          >
            <Modal.Header closeButton>
              <h2>Task: {viewtask} </h2>{" "}
            </Modal.Header>
            <Modal.Body>
              <EditTask
                state={props.noview}
                app={props.app}
                taskstate={props.state}
                permitcreate={props.permitcreate}
                permitopen={props.permitopen}
                permittodo={props.permittodo}
                permitdoing={props.permitdoing}
                permitdone={props.permitdone}
                taskid={viewtask}
                edited={refreshTasks}
              />
            </Modal.Body>
          </Modal>
        </Grid>
      </Grid>
    </>
  );
}

export default BoardList;

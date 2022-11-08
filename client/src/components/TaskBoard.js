import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
//bootstrap components
import Modal from "react-bootstrap/Modal";

//mui components
import { Paper, Grid, Divider, Typography } from "@mui/material";
import AddBoxRoundedIcon from "@mui/icons-material/AddBoxRounded";
import BoardList from "./BoardList";

//app components
import CreateTask from "./CreateTask";
const useStyles = makeStyles({
  root: {
    display: "flex",
    flex: "1 1 auto",
    // height: "100%",
  },
  boardsWrap: {
    display: "flex",
    flex: "1 1 auto",
    overflowX: "auto",
    overflowY: "hidden",
    height: "100%",
  },
  boardsContent: {
    display: "flex",
    paddingTop: "24px",
    paddingBottom: "24px",
    height: "100%",
  },
  boardCard: {
    width: "260px",
    display: "flex",
    maxHeight: "100%",
    overflowX: "hidden",
    overflowY: "hidden",
    marginLeft: "8px",
    marginRight: "8px",
    flexDirection: "column",
  },
  boardHeader: {
    padding: "16px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  boardButton: {
    justifyContent: "center",
  },
  divider: {
    marginTop: "10px",
  },
});

function TaskBoard(props) {
  // const [createtask, setCreateTask] = useState();
  const [modalShow, setModalShow] = useState(false);
  const [created, setCreated] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [permitopen, setPermitopen] = useState(false);
  const [permitcreate, setPermitcreate] = useState(false);
  const [permittodo, setPermittodo] = useState(false);
  const [permitdoing, setPermitdoing] = useState(false);
  const [permitdone, setPermitdone] = useState(false);

  function Auth() {
    console.log(sessionStorage.getItem("permitOpen"));
    console.log(typeof sessionStorage.getItem("permitOpen"));
    setPermitopen(
      sessionStorage.getItem("permitOpen") == "true" ? true : false
    );
    setPermitcreate(
      sessionStorage.getItem("permitCreate") == "true" ? true : false
    );
    setPermittodo(
      sessionStorage.getItem("permitToDo") == "true" ? true : false
    );
    setPermitdoing(
      sessionStorage.getItem("permitDoing") == "true" ? true : false
    );
    setPermitdone(
      sessionStorage.getItem("permitDone") == "true" ? true : false
    );
  }
  const handleShow = () => {
    setModalShow(true);
  };
  const handleClose = () => {
    setModalShow(false);
  };
  const classes = useStyles();
  async function createTask() {
    handleShow();
  }
  async function refreshTasks() {
    setCreated(!created);
    console.log("refreshing tasks");
  }

  useEffect(() => {
    Auth();
  }, []);

  return (
    <>
      <Modal size="lg" show={modalShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <h2>Create New Task</h2>{" "}
        </Modal.Header>
        <Modal.Body>
          <CreateTask appName={props.appName} getTasks={refreshTasks} />
        </Modal.Body>
      </Modal>

      <Grid className={classes.root} container spacing={3}>
        <Grid container className={classes.boardsWrap}>
          <Grid className={classes.boardsContent}>
            <Paper className={classes.boardCard} elevation={3}>
              <Grid className={classes.boardHeader} container>
                <Typography component="h5" variant="h5">
                  Open
                </Typography>
                {props.permitcreate ? (
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      outline: "inherit",
                    }}
                    onClick={createTask}
                  >
                    <AddBoxRoundedIcon />
                  </button>
                ) : (
                  <></>
                )}
              </Grid>{" "}
              <Divider />
              <BoardList
                noview={false}
                app={props.appName}
                state={"Open"}
                created={created}
                setRefresh={setRefresh}
                refresh={refresh}
                permitcreate={props.permitcreate}
                permitopen={props.permitopen}
                permittodo={props.permittodo}
                permitdoing={props.permitdoing}
                permitdone={props.permitdone}
              />
            </Paper>
            <Paper className={classes.boardCard} elevation={3}>
              <Grid className={classes.boardHeader} container>
                <Typography component="h5" variant="h5">
                  To-do
                </Typography>
              </Grid>{" "}
              <Divider />
              <BoardList
                noview={true}
                app={props.appName}
                state={"ToDo"}
                setRefresh={setRefresh}
                refresh={refresh}
                permitcreate={props.permitcreate}
                permitopen={props.permitopen}
                permittodo={props.permittodo}
                permitdoing={props.permitdoing}
                permitdone={props.permitdone}
              />
            </Paper>
            <Paper className={classes.boardCard} elevation={3}>
              <Grid className={classes.boardHeader} container>
                <Typography component="h5" variant="h5">
                  Doing{" "}
                </Typography>
              </Grid>{" "}
              <Divider />
              <BoardList
                noview={true}
                app={props.appName}
                state={"Doing"}
                setRefresh={setRefresh}
                refresh={refresh}
                permitcreate={props.permitcreate}
                permitopen={props.permitopen}
                permittodo={props.permittodo}
                permitdoing={props.permitdoing}
                permitdone={props.permitdone}
              />
            </Paper>
            <Paper className={classes.boardCard} elevation={3}>
              <Grid className={classes.boardHeader} container>
                <Typography component="h5" variant="h5">
                  Done
                </Typography>
              </Grid>{" "}
              <Divider />
              <BoardList
                noview={false}
                app={props.appName}
                state={"Done"}
                setRefresh={setRefresh}
                refresh={refresh}
                permitcreate={props.permitcreate}
                permitopen={props.permitopen}
                permittodo={props.permittodo}
                permitdoing={props.permitdoing}
                permitdone={props.permitdone}
              />
            </Paper>
            <Paper className={classes.boardCard} elevation={3}>
              <Grid className={classes.boardHeader} container>
                <Typography component="h5" variant="h5">
                  Closed{" "}
                </Typography>
              </Grid>{" "}
              <Divider />
              <BoardList
                noview={true}
                app={props.appName}
                state={"Closed"}
                setRefresh={setRefresh}
                refresh={refresh}
                permitcreate={props.permitcreate}
                permitopen={props.permitopen}
                permittodo={props.permittodo}
                permitdoing={props.permitdoing}
                permitdone={props.permitdone}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default TaskBoard;

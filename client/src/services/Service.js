const Axios = require("axios");
const API_URL = "http://localhost:3001";

class Service {
  //usergroup methods
  getGroups() {
    return Axios.get(API_URL + "/getgroups").then((res) => {
      return res.data;
    });
  }
  checkGroup(app) {
    return Axios.post(API_URL + "/checkgroup", app).then((res) => {
      return res.data;
    });
  }

  //application methods
  getAllApplications() {
    return Axios.post(API_URL + "/getapps").then((res) => {
      return res.data;
    });
  }
  findApplication(appdetails) {
    // console.log(appdetails);
    return Axios.post(API_URL + "/findapp", appdetails).then((res) => {
      return res.data;
    });
  }
  createApplication(appdetails) {
    return Axios.post(API_URL + "/createapp", appdetails).then((res) => {
      return res.data;
    });
  }
  editApplication(appdetails) {
    return Axios.post(API_URL + "/editapp", appdetails).then((res) => {
      console.log(res.data);

      return res.data;
    });
  }

  //Plan methods
  createPlan(app) {
    return Axios.post(API_URL + `/application/createplan`, app).then((res) => {
      return res.data;
    });
  }

  getPlans(app) {
    return Axios.post(API_URL + `/application/${app.App_Acronym}`).then(
      (res) => {
        // console.log(res.data);

        return res.data;
      }
    );
  }

  getSinglePlan(app) {
    return Axios.post(API_URL + `/getsingleplan`, app).then((res) => {
      // console.log(res.data);
      return res.data;
    });
  }
  editPlan(app) {
    return Axios.post(API_URL + `/editplan`, app).then((res) => {
      // console.log(res.data);
      return res.data;
    });
  }

  //Tasks methods
  createTask(app) {
    return Axios.post(API_URL + "/createtask", app).then((res) => {
      return res.data;
    });
  }
  getTask(app) {
    return Axios.post(API_URL + "/getsingletask", app).then((res) => {
      // console.log(res);
      return res.data;
    });
  }
  getTasks(app) {
    return Axios.post(API_URL + "/gettasks", app).then((res) => {
      return res.data;
    });
  }
  getTasksByState(app) {
    return Axios.post(API_URL + "/gettasksbystate", app).then((res) => {
      return res.data;
    });
  }
  editTask(app) {
    return Axios.post(API_URL + "/edittask", app).then((res) => {
      return res.data;
    });
  }
  promoteTask(app) {
    return Axios.post(API_URL + "/promotetask", app).then((res) => {
      // console.log(res);
      return res.data;
    });
  }
  demoteTask(app) {
    return Axios.post(API_URL + "/demotetask", app).then((res) => {
      // console.log(res);
      return res.data;
    });
  }
}
export { Service };

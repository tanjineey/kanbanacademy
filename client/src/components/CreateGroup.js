import React, { useEffect, useState } from "react";
import Axios from "axios";

function CreateGroup() {
  const [usergroup, setUsergroup] = useState("");
  const [result, setResult] = useState([]);
  const [complete, setComplete] = useState([]);
  const styleCorrResult = { color: "green" };
  const styleErrResult = { color: "#f84f31" };

  async function createGroup(e) {
    e.preventDefault();
    const form = document.getElementById("form");
    try {
      const response = await Axios.post("/creategroup", { usergroup });
      if (response) {
        console.log(response.data);
        if (response.data.status) {
          form.reset();

          setComplete(true);
          setResult(response.data.message);
        } else {
          setComplete(false);
          setResult(response.data.message);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <div style={{ marginTop: "10px", maxWidth: "500px" }}>
        <h3>Create New Group</h3>
        <form
          className="login100-form validate-form flex-sb flex-w"
          onSubmit={createGroup}
          id="form"
        >
          <label htmlFor="usergroup">User group:</label>
          <input
            type="text"
            id="usergroup"
            name="usergroup"
            onChange={(e) => setUsergroup(e.target.value)}
          />
          <br />
          {complete ? (
            <p style={styleCorrResult}>{result}</p>
          ) : (
            <p style={styleErrResult}>{result}</p>
          )}

          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
}

export default CreateGroup;

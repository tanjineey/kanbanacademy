import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Error() {
  return (
    <>
      <p>You do not have access to this page</p>
      <Link to="/">Back to Home</Link>
    </>
  );
}

export default Error;

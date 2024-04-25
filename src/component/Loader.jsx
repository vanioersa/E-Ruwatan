import React from "react";
import { PropagateLoader } from "react-spinners";
const IconLoader = () => (
    <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        style={{ transform: "translate(-50%, -50%)" }}
    >
        <PropagateLoader color="#1D24CA" />
    </div>
);

export default IconLoader;
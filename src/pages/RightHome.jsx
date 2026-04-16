import React, { useEffect, useState } from "react";
import ViewNote from "../components/ViewNote";

const RightHome = ({ onClick }) => {

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
      <ViewNote onClick={onClick} />
    </div>
  );
};

export default RightHome;

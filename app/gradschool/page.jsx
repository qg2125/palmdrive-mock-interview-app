import React from "react";
import ProgramList from "./_components/ProgramList";

function GradSchool() {
  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl text-primary">
        Graduate School Interviews
      </h2>
      <h2 className="text-gray-500">
        Choose your program and begin the mock interview!
      </h2>

      <ProgramList />
    </div>
  );
}

export default GradSchool;

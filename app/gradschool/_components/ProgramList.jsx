"use client";
import { db } from "@/utils/db";
import { programs, universities } from "@/utils/schema";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import ProgramCard from "./ProgramCard";

function ProgramList() {
  const [programList, setProgramList] = useState([]);
  useEffect(() => {
    GetProgramList();
  }, []);
  const GetProgramList = async () => {
    const result = await db
      .select({
        programId: programs.id,
        programName: programs.name,
        universityName: universities.name, // Select university name
        programUniqueId: programs.programUId,
      })
      .from(programs)
      .leftJoin(universities, eq(programs.universityId, universities.id)) // Join with universities table
      .orderBy(programs.id);
    console.log(result, programList);
    setProgramList(result);
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {programList?.length > 0
          ? programList.map((program, index) => (
              <ProgramCard program={program} key={index} />
            ))
          : [1, 2, 3, 4].map((item, index) => (
              <div
                key={index}
                className="h-[100px] w-full bg-gray-200 animate-pulse rounded-lg "
              ></div>
            ))}
      </div>
    </div>
  );
}

export default ProgramList;

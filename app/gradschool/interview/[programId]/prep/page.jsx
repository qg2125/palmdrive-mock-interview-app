"use client";
import { db } from "@/utils/db";
import { programs, interviewQuestions } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function InterviewPrep({ params }) {
  const resolvedParams = React.use(params);
  const [instruction, setInstruction] = useState("");
  const [questions, setQuestions] = useState([]); //
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GetPrepData();
  }, []);
  const GetPrepData = async () => {
    try {
      // 首先获取program信息
      const programData = await db
        .select({
          id: programs.id,
          instructions: programs.interviewInstructions,
        })
        .from(programs)
        .where(eq(programs.programUId, resolvedParams.programId));

      if (programData && programData[0]) {
        setInstruction(programData[0].instructions);

        // 使用获取到的program.id查询相关的面试题目
        console.log(programData[0].id);
        const questionData = await db
          .select({
            questionText: interviewQuestions.questionText,
            prepTime: interviewQuestions.preparationTimeSeconds,
            recordTime: interviewQuestions.recordingTimeSeconds,
          })
          .from(interviewQuestions)
          .where(eq(interviewQuestions.programId, programData[0].id));

        console.log(questionData);
        setQuestions(questionData);
      }
    } catch (error) {
      console.error("Error fetching interview data:", error);
    }
  };
  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl text-primary">
        Interview Preparation Tips
      </h2>
      <h2 className="text-gray-500">{instruction}</h2>
      <div className="mt-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 font-bold text-2xl text-primary mb-4"
        >
          <span>{isExpanded ? "▼" : "▶"}</span>
          See Interview Questions
        </button>
        {isExpanded && (
          <div className="transition-all duration-300">
            {questions.map((q, index) => (
              <div key={index} className="mb-4 p-4 border rounded-lg">
                <p className="font-semibold">{q.questionText}</p>
                {/* <p className="text-sm text-gray-600">
                  Preparation time: {q.prepTime} seconds | Recording time:{" "}
                  {q.recordTime} seconds
                </p> */}
              </div>
            ))}
          </div>
        )}
      </div>
      <Button onClick={() => router.replace("/gradschool")}>Go Back</Button>
    </div>
  );
}

export default InterviewPrep;

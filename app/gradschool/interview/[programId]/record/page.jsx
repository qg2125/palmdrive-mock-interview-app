"use client";
import { db } from "@/utils/db";
import { programs, interviewQuestions } from "@/utils/schema";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import QuestionsSection from "./_components/QuestionsSection";
import RecordSection from "./_components/RecordSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RecordAnswerSection from "./_components/RecordAnswerSection";

function RecordInterview({ params }) {
  const resolvedParams = React.use(params);
  const [interviewData, setInterviewData] = useState();
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    GetInterviewDetails();
  }, []);

  // 随机选择指定数量的问题
  const getRandomQuestions = (questions, count) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const GetInterviewDetails = async () => {
    try {
      // 首先获取program信息
      const programData = await db
        .select({
          id: programs.id,
          useAllQuestions: programs.useAllQuestions,
          numberOfQuestions: programs.numberOfQuestions,
          programUniqueId: programs.programUId,
          useGlobalTiming: programs.useGlobalTiming,
          globalPreparationSeconds: programs.globalPreparationSeconds,
          globalRecordingSeconds: programs.globalRecordingSeconds,
        })
        .from(programs)
        .where(eq(programs.programUId, resolvedParams.programId));

      if (programData && programData[0]) {
        // 使用获取到的program.id查询相关的面试题目
        setInterviewData(programData[0]);
        console.log(
          programData[0].useAllQuestions,
          programData[0].numberOfQuestions
        );
        const questionData = await db
          .select({
            questionText: interviewQuestions.questionText,
            questionPrepTime: interviewQuestions.preparationTimeSeconds,
            questionRecordTime: interviewQuestions.recordingTimeSeconds,
          })
          .from(interviewQuestions)
          .where(eq(interviewQuestions.programId, programData[0].id));

        // 根据 useAllQuestions 和 numberOfQuestions 设置面试问题
        if (programData[0].useAllQuestions) {
          // 如果使用所有问题，直接设置全部问题
          setMockInterviewQuestion(questionData);
        } else {
          // 如果不使用所有问题，随机选择指定数量的问题
          const randomQuestions = getRandomQuestions(
            questionData,
            programData[0].numberOfQuestions
          );
          setMockInterviewQuestion(randomQuestions);
        }
      }
    } catch (error) {
      console.error("Error fetching interview data:", error);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />
        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestionIndex != mockInterviewQuestion?.length - 1 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex == mockInterviewQuestion?.length - 1 && (
          <Link
            href={
              "/gradschool/interview/" +
              interviewData?.programUniqueId +
              "/feedback"
            }
          >
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default RecordInterview;

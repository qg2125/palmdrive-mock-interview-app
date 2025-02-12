"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Mic, StopCircle } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { db } from "@/utils/db";
import { userAnswers } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { chatSession } from "@/utils/GeminiAIModal";

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { user } = useUser();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening,
  } = useSpeechRecognition();

  useEffect(() => {
    setUserAnswer("");
    resetTranscript();
    setFeedback(null);
    setHasAnswered(false);
  }, [activeQuestionIndex, resetTranscript]);

  useEffect(() => {
    setUserAnswer(transcript);
  }, [transcript]);

  const updateUserAnswer = async () => {
    if (!userAnswer.trim()) {
      console.warn("No answer recorded");
      return;
    }

    try {
      setLoading(true);
      // 修改 prompt 以强制要求特定格式的 JSON 响应
      const feedbackPrompt = `Question: "${mockInterviewQuestion[activeQuestionIndex]?.questionText}"  
User Answer: "${userAnswer}"  

Based on the given interview question and user answer, provide feedback in JSON format.  
- "feedback": Briefly highlight key areas for improvement in a few sentences.  
- "improvedAnswer": Provide a detailed, refined version of the user's answer.   

Return the response in **valid JSON format** only, without additional text.`;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      console.log(mockJsonResp);

      try {
        const JsonFeedbackResp = JSON.parse(mockJsonResp);
        setFeedback(JsonFeedbackResp);
        setHasAnswered(true);

        // 存储到数据库
        const resp = await db.insert(userAnswers).values({
          programUniqueId: interviewData?.programUniqueId,
          question: mockInterviewQuestion[activeQuestionIndex]?.questionText,
          userAns: userAnswer,
          feedback: JsonFeedbackResp.feedback,
          improvedAnswer: JsonFeedbackResp.improvedAnswer,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        });

        console.log("Answer saved to database:", resp);
      } catch (e) {
        console.error("Error processing feedback or saving to database:", e);
        setFeedback({
          feedback: "Error processing feedback. Please try again.",
          improvedAnswer: "Unable to generate improved answer.",
        });
      }
    } catch (error) {
      console.error("Error getting feedback:", error);
      setFeedback({
        feedback: "Failed to get feedback. Please try again.",
        improvedAnswer: "Unable to generate improved answer.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecordingToggle = async () => {
    if (listening) {
      SpeechRecognition.stopListening();
      setTimeout(async () => {
        if (userAnswer.trim()) {
          await updateUserAnswer();
        }
      }, 500);
    } else {
      setFeedback(null);
      SpeechRecognition.startListening({
        continuous: browserSupportsContinuousListening,
      });
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Webcam
          mirrored={true}
          style={{
            height: 500,
            width: 500,
            zIndex: 10,
          }}
        />
      </div>

      <div className="w-full max-w-2xl">
        <div className="flex justify-center my-10">
          <Button
            variant="outline"
            onClick={handleRecordingToggle}
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : hasAnswered ? (
              "Answer Submitted!" // 添加已提交状态的显示
            ) : listening ? (
              <h2 className="text-red-600 flex gap-2 items-center">
                <StopCircle />
                Stop Recording
              </h2>
            ) : (
              <h2 className="text-primary flex gap-2 items-center">
                <Mic /> Record Answer
              </h2>
            )}
          </Button>
        </div>

        {/* <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Your Answer:</h3>
            <p>{userAnswer}</p>
          </div>

          {feedback && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Feedback:</h3>
              <p className="mb-2">Feedback: {feedback.feedback}</p>
              <p>Improved Answer: {feedback.improvedAnswer}</p>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default RecordAnswerSection;

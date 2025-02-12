"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { StopCircle } from "lucide-react";
import { chatSession } from "@/utils/GeminiAIModal";

function RecordSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [prepTime, setPrepTime] = useState(60);
  const [recordTime, setRecordTime] = useState(180);
  const [isCountingDown, setIsCountingDown] = useState(true);
  const [isRecordingCountdown, setIsRecordingCountdown] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: {
      continuous: true,
      interimResults: true,
      maxAlternatives: 1,
      lang: "en-US", //
    },
    timeout: 1000 * 60 * 60, //
    silenceThreshold: Infinity, //
    autoStart: false,
    // onStartSpeaking: () => {
    //   console.log("Started speaking");
    // },
    // onStopSpeaking: () => {
    //   console.log("Stopped speaking");
    // },
    onError: (error) => {
      console.error("Speech recognition error:", error);
      //   if (isRecording) {
      //     stopSpeechToText(); // Stop if an error occurs during recording
      //     setIsRecordingCountdown(false);
      //     setIsFinished(true);
      //     // Optionally display an error message to the user.
      //     alert("Speech recognition encountered an error. Please try again.");
      //   }
    },
  });

  // 准备时间倒计时
  useEffect(() => {
    let timer;
    if (isCountingDown && prepTime > 0) {
      timer = setInterval(() => {
        setPrepTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    // 当准备倒计时结束时
    if (prepTime === 0 && isCountingDown) {
      setIsCountingDown(false);
      setIsRecordingCountdown(true); // 确保设置录制倒计时状态
      try {
        startSpeechToText();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
      }
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [prepTime, isCountingDown, startSpeechToText]);

  // 录制时间倒计时
  useEffect(() => {
    let timer;
    // 只在录制状态和倒计时状态都为 true 时启动倒计时
    if (isRecording && isRecordingCountdown && recordTime > 0) {
      timer = setInterval(() => {
        setRecordTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    // 录制时间结束
    if (recordTime === 0 && isRecording) {
      stopSpeechToText();
      setIsRecordingCountdown(false);
      setIsFinished(true);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [recordTime, isRecordingCountdown, isRecording, stopSpeechToText]);

  const handleRecordButton = () => {
    if (isRecording) {
      stopSpeechToText();
      setIsRecordingCountdown(false);
      setIsFinished(true);
    } else {
      setIsCountingDown(false);
      setPrepTime(0);
      setIsRecordingCountdown(true);
      try {
        startSpeechToText();
      } catch (error) {
        console.error("Failed to start speech recognition:", error);
      }
    }
  };

  //   const resetAll = () => {
  //     setPrepTime(5);
  //     setRecordTime(10);
  //     setIsCountingDown(true);
  //     setIsRecordingCountdown(false);
  //     setIsFinished(false);
  //     if (isRecording) {
  //       stopSpeechToText();
  //     }
  //   };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>

      {/* 准备时间倒计时显示 */}
      {isCountingDown && prepTime > 0 && (
        <div className="mt-5 ">
          Recording in: {prepTime}s. You can press the "Start Recording" button
          to begin answering questions whenever you're ready.
        </div>
      )}

      {/* 录制时间倒计时显示 */}
      {isRecording && isRecordingCountdown && (
        <div className="mt-5 ">
          Recording ends: {recordTime}s. Do not press the "Stop Recording"
          button until you have answered all the questions.
        </div>
      )}

      {/* 只在未完成时显示录制按钮 */}
      {!isFinished && (
        <Button
          variant="outline"
          className="my-10"
          onClick={handleRecordButton}
        >
          {isRecording ? (
            <h2 className="text-red-600 animate-pulse flex gap-2 items-center">
              <StopCircle />
              Stop Recording
            </h2>
          ) : (
            "Start Recording"
          )}
        </Button>
      )}

      {/* 完成后显示结束消息 */}
      {isFinished && (
        <div className="my-10 text-lg font-medium">
          End the interview by clicking the button below.
        </div>
      )}
    </div>
  );
}

export default RecordSection;

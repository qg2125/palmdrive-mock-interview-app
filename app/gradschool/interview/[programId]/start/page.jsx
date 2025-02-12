"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Webcam from "react-webcam";
import { WebcamIcon } from "lucide-react";
import Link from "next/link";

function StartInterview({ params }) {
  const resolvedParams = React.use(params);
  const [webCamEnabled, setWebCamEnabled] = useState();
  const containerStyle = "w-2/5 mx-auto mt-8";

  return (
    <div>
      <div className={containerStyle}>
        {webCamEnabled ? (
          <div className="bg-secondary rounded-lg border p-4">
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              className="w-full h-full rounded"
            />
          </div>
        ) : (
          <>
            <WebcamIcon className="h-72 w-full mx-auto my-7 p-20 bg-secondary rounded-lg border" />
            <div className="flex justify-center">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setWebCamEnabled(true)}
              >
                Enable Web Cam and Microphone
              </Button>
            </div>
          </>
        )}
        <div className="flex justify-center mt-4">
          <Link
            href={
              "/gradschool/interview/" + resolvedParams.programId + "/record"
            }
          >
            <Button>Ready</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StartInterview;

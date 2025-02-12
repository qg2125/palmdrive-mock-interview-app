import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

function ProgramCard({ program }) {
  const router = useRouter();

  const onStart = () => {
    router.push("/gradschool/interview/" + program.programUniqueId + "/record");
  };

  const onPrepPress = () => {
    router.push("/gradschool/interview/" + program.programUniqueId + "/prep");
  };

  const onFeedbackPress = () => {
    router.push(
      "/gradschool/interview/" + program.programUniqueId + "/feedback"
    );
  };

  return (
    <div className="border shadow-sm rounded-lg p-3">
      <h2 className="font-bold text-primary">{program?.universityName}</h2>
      <h2 className="text-sm text-gray-600">{program?.programName} Program</h2>

      <div className="grid grid-cols-2 mt-2 gap-2">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={onPrepPress}
        >
          Prep
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={onFeedbackPress}
        >
          Feedback
        </Button>
        <Button size="sm" className="w-full" onClick={onStart}>
          Start
        </Button>
      </div>
    </div>
  );
}

export default ProgramCard;

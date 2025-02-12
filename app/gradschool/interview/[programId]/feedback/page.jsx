"use client";
import { db } from "@/utils/db";
import { userAnswers } from "@/utils/schema";
import { eq, and, desc } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // 替换为 Clerk

function Feedback({ params }) {
  const resolvedParams = React.use(params);
  const [feedbackList, setFeedbackList] = useState([]);
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user?.emailAddresses?.[0]?.emailAddress) {
      GetFeedback(user.emailAddresses[0].emailAddress);
    }
  }, [isLoaded, user]);

  const GetFeedback = async (userEmail) => {
    const result = await db
      .select()
      .from(userAnswers)
      .where(
        and(
          eq(userAnswers.programUniqueId, resolvedParams.programId),
          eq(userAnswers.userEmail, userEmail)
        )
      )
      .orderBy(desc(userAnswers.createdAt));

    console.log(result);
    setFeedbackList(result);
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>请先登录查看您的反馈。</div>;
  }

  return (
    <div className="p-10">
      {feedbackList?.length == 0 ? (
        <h2 className="font-bold text-xl text-gray-500">
          No Interview Feedback Record Found
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-primary">Congratulation!</h2>
          <h2 className="font-bold text-2xl">
            Here is your interview feedback
          </h2>

          <h2 className="text-sm text-gray-500">
            Find below interview question with feedback for improvement
          </h2>
          {feedbackList &&
            feedbackList.map((item, index) => (
              <Collapsible key={index} className="mt-7">
                <CollapsibleTrigger
                  className="p-2
             bg-secondary rounded-lg flex justify-between
            my-2 text-left gap-7 w-full"
                >
                  <div className="flex justify-between items-center w-full">
                    {item.question} <ChevronsUpDown className="h-5 w-5" />
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="flex flex-col gap-2">
                    <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                      <strong>Feedback: </strong>
                      {item.feedback}
                    </h2>

                    <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                      <strong>Improved Answer: </strong>
                      {item.improvedAnswer}
                    </h2>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
        </>
      )}

      <Button className="mt-2" onClick={() => router.replace("/gradschool")}>
        Go Back
      </Button>
    </div>
  );
}

export default Feedback;

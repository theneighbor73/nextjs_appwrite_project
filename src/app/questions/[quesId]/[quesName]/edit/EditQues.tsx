"use client";

import QuestionForm from "@/components/QuestionForm";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { Models } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

//Move the redirect logic to run only after the user data is available

const EditQues = ({ question }: { question: Models.Document }) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    // Only check authorization when user data is available
    if (user) {
      if (question.authorId !== user?.$id) {
        router.push(`/questions/${question.$id}/${slugify(question.title)}`);
      } else {
        setIsAuthorized(true);
      }
    }
  }, [user, question, router]);

  // Show loading state or null until we verify authorization
  if (!user || !isAuthorized) {
    return (
      <div className="block pb-20 pt-32">
        <div className="container mx-auto px-4">
          <p className="mb-10 mt-4 text-2xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="block pb-20 pt-32">
      <div className="container mx-auto px-4">
        <h1 className="mb-10 mt-4 text-2xl">Edit your public question</h1>

        <div className="flex flex-wrap md:flex-row-reverse">
          <div className="w-full md:w-1/3"></div>
          <div className="w-full md:w-2/3">
            <QuestionForm question={question} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditQues;

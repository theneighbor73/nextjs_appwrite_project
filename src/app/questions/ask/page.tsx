import React from "react";
import QuestionForm from "@/components/QuestionForm";

const Page = () => {
  return (
    <div className="container mx-auto px-4 pb-20 pt-36">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Post your question</h1>
      </div>

      <div className="mb-4">
        <QuestionForm />
      </div>
    </div>
  );
};

export default Page;

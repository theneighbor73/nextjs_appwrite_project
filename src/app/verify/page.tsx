"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/Auth";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = React.useState<
    "verifying" | "success" | "error" | "invalid"
  >("verifying");
  const [message, setMessage] = React.useState("");
  const { updateVerification } = useAuthStore();

  React.useEffect(() => {
    const verifyEmail = async () => {
      const userId = searchParams.get("userId");
      const secret = searchParams.get("secret");
      const expire = searchParams.get("expire");

      if (!userId || !secret) {
        setStatus("invalid");
        setMessage("Invalid verification link. Missing required parameters.");
        return;
      }

      if (expire) {
        const expiryDate = new Date(decodeURIComponent(expire));
        if (new Date() > expiryDate) {
          setStatus("error");
          setMessage(
            "Verification link has expired. Please request a new one."
          );
          return;
        }
      }

      try {
        const response = await updateVerification(userId, secret);
        setStatus("success");
        setMessage(response?.message || "Email verified!");
      } catch (error) {
        setStatus("error");
        setMessage(
          "Verification failed. Please try again or request a new link."
        );
      }
    };

    verifyEmail();
  }, [router, searchParams, updateVerification]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="max-w-md w-full bg-gray-200 rounded-lg shadow-md p-6">
        <div className="text-center">
          {status === "verifying" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-50 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">
                Verifying your email...
              </h2>
              <p className="text-gray-600 mt-2">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Email Verified!
              </h2>
              <p className="text-gray-600 mt-2">{message}</p>
              <button
                onClick={() => router.push("/")}
                className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-green-950"
              >
                Home page
              </button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Verification Failed
              </h2>
              <p className="text-gray-600 mt-2">{message}</p>
              <button
                onClick={() => router.push("/login")}
                className="mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Go to Login
              </button>
            </>
          )}

          {status === "invalid" && (
            <>
              <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Invalid Link
              </h2>
              <p className="text-gray-600 mt-2">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

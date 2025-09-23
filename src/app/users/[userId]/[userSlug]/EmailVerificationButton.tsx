"use client";

import { useAuthStore } from "@/store/Auth";
import React from "react";
import { IconX, IconAlertCircle, IconMailCheck } from "@tabler/icons-react";

const EmailVerificationButton = () => {
  const { user, verifyAccountViaEmail } = useAuthStore();
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  if (!user || user?.emailVerification !== false) return null;

  const handleClick = async () => {
    setError(""); // reset previous state
    setMessage("");
    const response = await verifyAccountViaEmail();

    if (response?.error) {
      setError(response.error.message);
    } else if (response?.message) {
      setMessage(response.message);
    }
  };

  return (
    <p
      className="flex items-center gap-1 text-sm text-gray-500 cursor-pointer hover:text-gray-700"
      onClick={handleClick}
    >
      {error ? (
        <>
          <IconX className="w-4 shrink-0 text-red-500" />
          {error}
        </>
      ) : message ? (
        <>
          <IconMailCheck className="w-4 shrink-0 text-green-500" />
          {message}
        </>
      ) : (
        <>
          <IconAlertCircle className="w-4 shrink-0" />
          Unverified account. Send verification email.
        </>
      )}
    </p>
  );
};

export default EmailVerificationButton;

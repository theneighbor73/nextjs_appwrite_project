"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

const Page = ({ params }: { params: { userId: string; userSlug: string } }) => {
  const { user, updateProfile, updateUserPassword } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error1, setError1] = React.useState("");
  const [message1, setMessage1] = React.useState("");
  const [error2, setError2] = React.useState("");
  const [message2, setMessage2] = React.useState("");
  const [isAuthorized, setIsAuthorized] = React.useState(false);

  React.useEffect(() => {
    // Check if user is authorized when user data is available
    if (user) {
      setIsAuthorized(user.$id === params.userId);
    }
  }, [user, params.userId]);

  const handleSubmitProfileDetails = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    const firstname = formData.get("firstname");
    const lastname = formData.get("lastname");
    const name = `${firstname} ${lastname}`;

    if (!email && !password && !firstname && !lastname) {
      setError1(() => "Please give input to update profile details.");
      return;
    }

    if (email && !password) {
      setError1(() => "When updating email, password is required.");
      return;
    }

    if ((firstname && !lastname) || (lastname && !firstname)) {
      setError1(
        () => "When updating name, both first name and last name are required."
      );
      return;
    }

    setIsLoading(true);
    setError1("");
    setMessage1("");

    const updateProfileResponse = await updateProfile(
      name?.toString(),
      email?.toString(),
      password?.toString()
    );
    if (updateProfileResponse.error) {
      setError1(() => updateProfileResponse.error!.message);
    } else if (updateProfileResponse.message) {
      setMessage1(updateProfileResponse.message);

      // Clear the form inputs
      form.reset();
    }

    setIsLoading(() => false);
  };

  const handleSubmitUpdatePassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // const formData = new FormData(e.currentTarget);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const currentpassword = formData.get("currentpassword");
    const newpassword = formData.get("newpassword");
    const confirmnewpassword = formData.get("confirmnewpassword");

    if (!currentpassword || !newpassword || !confirmnewpassword) {
      setError2(() => "Please fill out all fields");
      return;
    }

    if (newpassword !== confirmnewpassword) {
      setError2(
        () => "Confirm new password field is not the same as new password."
      );
      return;
    }

    if (newpassword == currentpassword) {
      setError2(() => "New password must be different from current password.");
      return;
    }

    setIsLoading(true);
    setError2("");
    setMessage2("");

    const updatePasswordResponse = await updateUserPassword(
      newpassword.toString(),
      currentpassword.toString()
    );
    if (updatePasswordResponse.error) {
      setError2(() => updatePasswordResponse.error!.message);
    } else if (updatePasswordResponse.message) {
      setMessage2(updatePasswordResponse.message);

      // Clear the form inputs
      form.reset();
    }

    setIsLoading(() => false);
  };

  // Only show the form if user is authorized
  if (!isAuthorized) {
    return (
      <div className="mx-auto w-full max-w-md rounded-none border border-solid border-white/30 bg-black p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
        <h2 className="text-xl font-bold text-neutral-500 dark:text-neutral-200">
          Loading...
        </h2>
        <p className="mt-4 text-neutral-400">
          Access denied. You are not authorized to edit this profile.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-none border border-solid border-white/30 bg-black p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
      <h2 className="text-xl font-bold text-neutral-500 dark:text-neutral-200">
        Update profile details
      </h2>

      {/* --- Profile update form --- */}
      <form className="my-8" onSubmit={handleSubmitProfileDetails}>
        {error1 && (
          <p className="mt-4 mb-6 text-center text-sm text-red-500 dark:text-red-400">
            {error1}
          </p>
        )}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            className="text-white"
            id="email"
            name="email"
            placeholder="your_email@gmail.com"
            type="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Current password</Label>
          <p className="text-sm text-neutral-500 dark:text-neutral-200">
            Password is needed when update email
          </p>
          <Input
            className="text-white"
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="firstname">First name</Label>
          <Input
            className="text-white"
            id="firstname"
            name="firstname"
            placeholder="First name"
            type="name"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="lastname">Last name</Label>
          <Input
            className="text-white"
            id="lastname"
            name="lastname"
            placeholder="Last name"
            type="name"
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isLoading}
        >
          Save profile
          <BottomGradient />
        </button>

        {message1 && (
          <p className="mt-8 text-center text-sm text-green-500 dark:text-green-400">
            {message1}
          </p>
        )}
      </form>

      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      {/* --- Password update form --- */}
      <h2 className="text-xl font-bold text-neutral-500 dark:text-neutral-200">
        Update password
      </h2>

      <form className="my-8" onSubmit={handleSubmitUpdatePassword}>
        {error2 && (
          <p className="mt-4 mb-6 text-center text-sm text-red-500 dark:text-red-400">
            {error2}
          </p>
        )}

        <LabelInputContainer className="mb-4">
          <Label htmlFor="currentpassword">Current password</Label>
          <Input
            className="text-white"
            id="currentpassword"
            name="currentpassword"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="newpassword">New password</Label>
          <Input
            className="text-white"
            id="newpassword"
            name="newpassword"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="confirmnewpassword">Confirm new password</Label>
          <Input
            className="text-white"
            id="confirmnewpassword"
            name="confirmnewpassword"
            placeholder="••••••••"
            type="password"
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isLoading}
        >
          Update password
          <BottomGradient />
        </button>

        {message2 && (
          <p className="mt-8 text-center text-sm text-green-500 dark:text-green-400">
            {message2}
          </p>
        )}
      </form>

      <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
    </div>
  );
};

export default Page;

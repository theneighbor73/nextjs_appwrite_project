import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import { AppwriteException, ID, Models } from "appwrite";
import { account } from "@/models/client/config";

export interface UserPrefs {
  reputation: number;
}

interface IAuthStore {
  session: Models.Session | null;
  jwt: string | null;
  user: Models.User<UserPrefs> | null;
  hydrated: boolean;

  setHydrated(): void;
  verfiySession(): Promise<void>;
  login(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  createAccount(
    name: string,
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    error?: AppwriteException | null;
  }>;
  logout(): Promise<void>;
  updateProfile(
    name?: string,
    email?: string,
    password?: string
  ): Promise<{
    success: boolean;
    message?: string;
    error?: AppwriteException | null;
  }>;
  updatePassword(
    currentpassword: string,
    newpassword: string
  ): Promise<{
    success: boolean;
    message?: string;
    error?: AppwriteException | null;
  }>;
}

export const useAuthStore = create<IAuthStore>()(
  persist(
    immer((set) => ({
      session: null,
      jwt: null,
      user: null,
      hydrated: false,

      setHydrated() {
        set({ hydrated: true });
      },

      async verfiySession() {
        try {
          const session = await account.getSession("current");
          set({ session });
        } catch (error) {
          console.log(error);
        }
      },

      async login(email: string, password: string) {
        try {
          const session = await account.createEmailPasswordSession(
            email,
            password
          );
          const [user, { jwt }] = await Promise.all([
            account.get<UserPrefs>(),
            account.createJWT(),
          ]);
          if (!user.prefs?.reputation)
            await account.updatePrefs<UserPrefs>({
              reputation: 0,
            });

          set({ session, user, jwt });

          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async createAccount(name: string, email: string, password: string) {
        try {
          await account.create(ID.unique(), email, password, name);
          return { success: true };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async logout() {
        try {
          await account.deleteSessions();
          set({ session: null, jwt: null, user: null });
        } catch (error) {
          console.log(error);
        }
      },

      async updateProfile(name?: string, email?: string, password?: string) {
        try {
          let updatedUser: Models.User<UserPrefs> | null = null;
          const messages: string[] = [];

          // Update name
          if (name && name.trim() !== "") {
            try {
              const result = await account.updateName(name);
              console.log(result);
              messages.push("Name updated successfully.");
            } catch (error) {
              console.log(error);
              return {
                success: false,
                error: error instanceof AppwriteException ? error : null,
              };
            }
          }

          // Update email
          if (email && password) {
            try {
              const result = await account.updateEmail(email, password);
              console.log(result);
              messages.push("Email updated successfully.");
            } catch (error) {
              console.log(error);
              return {
                success: false,
                error: error instanceof AppwriteException ? error : null,
              };
            }
          }

          // Refresh user
          updatedUser = await account.get<UserPrefs>();
          set({ user: updatedUser });

          return {
            success: true,
            message:
              messages.length > 0
                ? messages.join(" ") + " Update will take a few minutes."
                : "Updated successfully. Please wait a few minutes and refresh.",
          };
        } catch (error) {
          console.log(error);
          return {
            success: false,
            error: error instanceof AppwriteException ? error : null,
          };
        }
      },

      async updatePassword(newpassword: string, currentpassword: string) {
        if (currentpassword.trim() !== "" && newpassword.trim() !== "")
          try {
            const result = await account.updatePassword(
              newpassword,
              currentpassword
            );
            console.log("Password updated:", result);

            return {
              success: true,
              message: "Password updated successfully",
            };
          } catch (error) {
            console.log(error);
            return {
              success: false,
              error: error instanceof AppwriteException ? error : null,
            };
          }
      },
    })),
    {
      name: "auth",
      onRehydrateStorage() {
        return (state, error) => {
          if (!error) state?.setHydrated();
        };
      },
    }
  )
);

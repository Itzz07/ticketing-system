'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [error, setError] = useState<string | null>(null);
function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await sendPasswordResetEmail(firebaseConfig.auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleLogin = () => {
    // Redirect to forgot password page
    router.replace("/");
  };

  const handleRegister = () => {
    // Redirect to register page
    router.replace("/sign-up");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cyan-950">
      <div className="w-full max-w-sm">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="flex  justify-center">
            <img
              className="object-cover  rounded mb-4"
              alt="hero"
              width={300}
              height={160}
              src="/Frontierlogo.jpg"
            />
          </div>
          <h1 className="text-3xl text-cyan-900 font-bold mb-2 text-center">
            Forgot Password
          </h1>
          <p className="text-sm text-cyan-500  mb-4 text-center">
            Please enter your Registered email...
          </p>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="johndoe@example.com"
            />
          </div>
          {message && <div className="text-green-500 mb-4">{message}</div>}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Reset Password
            </button>
          </div>
          <div className="mt-4">
            <div className="text-zinc-700 font-medium">
              Don't have an account{" "}
              <button
                type="button"
                onClick={handleRegister}
                className="text-cyan-500 font-bold py-2 rounded focus:outline-none focus:shadow-outline"
              >
                Sign Up
              </button>
            </div>
            <div className="text-zinc-700 font-medium">
              Already have account{" "}
              <button
                type="button"
                onClick={handleLogin}
                className="text-cyan-500 font-bold py-2  rounded focus:outline-none focus:shadow-outline"
              >
                Log In
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

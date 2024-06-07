"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import firebaseConfig from "../firebaseConfig";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "client">("client");

  function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseConfig.auth,
        email,
        password
      );
      const user = userCredential.user;
      // Set the document ID to the user's UID
      await setDoc(doc(firebaseConfig.db, "users", user.uid), {
        name,
        email,
        role,
      });
      router.replace("/");
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };
 const handleForgotPassword = () => {
   // Redirect to forgot password page
   router.replace("/forget-password");
 };

 const handlelogin = () => {
   // Redirect to register page
   router.replace("/");
 };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cyan-950">
      <div className="w-full max-w-xs md:max-w-3xl">
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
              src="Frontierlogo.jpg"
            />
          </div>
          <h1 className="text-3xl text-cyan-900 font-bold mb-2 text-center">
            Sign Up
          </h1>
          <p className="text-sm text-cyan-500  mb-4 text-center">
            Please Fill in all the fields to Sign Up...
          </p>
          <div className="grid md:grid-cols-3 ">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="mb-4 md:mx-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
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
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="role"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value as "admin" | "client")
                }
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="admin">Admin</option>
                <option value="client">Client</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="mb-4 md:me-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Password"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Confirm Password"
                required
              />
            </div>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Register
            </button>
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-zinc-700 font-medium">
              Forgot Password?{" "}
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-cyan-500 font-bold py-2  rounded focus:outline-none focus:shadow-outline"
              >
                link
              </button>
            </div>
            <button
              type="button"
              onClick={handlelogin}
              className="text-cyan-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-zinc-300"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

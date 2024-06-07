"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image"; // Import Image from next/image

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchUserRole = useCallback(
    async (uid: string) => {
      try {
        const userDoc = await getDoc(doc(firebaseConfig.db, "users", uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData && userData.role) {
            // Redirect based on role upon successful login
            router.replace(userData.role === "admin" ? "/admin" : "/client");
          } else {
            setError("User role not found");
          }
        } else {
          setError("User not found");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setError("Error fetching user role");
      }
    },
    [router]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseConfig.auth, (user) => {
      if (user) {
        // If user is already logged in, redirect based on role
        fetchUserRole(user.uid); // Fetch user role from database
      }
    });

    // Cleanup function to unsubscribe from the auth state listener
    return () => unsubscribe();
  }, [fetchUserRole]);

  function getErrorMessage(error: unknown) {
    if (error instanceof Error) return error.message;
    return String(error);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseConfig.auth,
        email,
        password
      );
      const user = userCredential.user;
      fetchUserRole(user.uid); // Fetch user role from database
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleForgotPassword = () => {
    // Redirect to forgot password page
    router.replace("/forget-password");
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
          className="bg-white shadow-md rounded-3xl px-8 pt-6 pb-8 mb-4"
        >
          <div className="flex  justify-center">
            <Image
              className="object-cover  rounded mb-4"
              alt="hero"
              width={300}
              height={160}
              src="/Frontierlogo.jpg"
            />
          </div>
          <h1 className="text-3xl text-cyan-900 font-bold mb-2 text-center">
            Login
          </h1>
          <p className="text-sm text-cyan-500  mb-4 text-center">
            Please enter your credentials to Log In...
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
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
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
            />
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Sign In
            </button>
          </div>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleRegister}
              className="text-cyan-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
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
          </div>
        </form>
      </div>
    </main>
  );
}

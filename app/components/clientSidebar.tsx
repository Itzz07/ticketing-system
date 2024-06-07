"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { User } from "firebase/auth";

export default function Client() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // Specify User | null as the state type
  const [activeNavItem, setActiveNavItem] = useState<string>(""); // State to keep track of active navigation item
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseConfig.auth,
      async (userData) => {
        if (userData) {
          setUser(userData);
          const userDoc = await getDoc(
            doc(firebaseConfig.db, "users", userData.uid)
          );
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            if (userData.role !== "client") {
              // If user is not an admin, redirect to login page
              router.push("/");
            }
          }
        } else {
          setUser(null);
          setUserRole(null);
          // If user is not logged in, redirect to login page
          router.push("/");
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await firebaseConfig.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-4/12 lg:w-2/12 bg-cyan-900 min-h-screen text-white">
        <div className="p-4">
          {/* logo  */}
          <div className="flex justify-center">
            <img
              className="object-cover rounded mb-4"
              alt="hero"
              width={300}
              height={160}
              src="/Frontierlogo.jpg"
            />
          </div>
          <ul>
            <li className="py-1">
              <button
                onClick={() => {
                  router.push("/client");
                  setActiveNavItem("/client"); // Set active item to current directory
                }}
                className={`flex items-center text-cyan-500 hover:text-cyan-200 ${
                  activeNavItem === "/client" && "font-bold text-cyan-300" // Apply active styling
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 me-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                  />
                </svg>
                Dashboard
              </button>
            </li>
            <li className="py-1">
              <button
                onClick={() => {
                  setActiveNavItem("/client/create-ticket"); // Set active item to current directory
                  router.push("/client/create-ticket");
                }}
                className={`flex items-center text-cyan-500 hover:text-cyan-200 ${
                  activeNavItem === "/client/create-ticket" &&
                  "font-bold  text-cyan-300" // Apply active styling
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 me-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"
                  />
                </svg>
                Ticket Form
              </button>
            </li>
            <li className="py-1 ">
              <button
                onClick={handleLogout}
                className="flex items-center text-cyan-500 hover:text-cyan-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6 me-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M15.75 2.25H21a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V4.81L8.03 17.03a.75.75 0 0 1-1.06-1.06L19.19 3.75h-3.44a.75.75 0 0 1 0-1.5Zm-10.5 4.5a1.5 1.5 0 0 0-1.5 1.5v10.5a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V10.5a.75.75 0 0 1 1.5 0v8.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V8.25a3 3 0 0 1 3-3h8.25a.75.75 0 0 1 0 1.5H5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
                Log Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

'use client'

import { useState } from "react";
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import firebaseConfig from "../../firebaseConfig";
import Sidebar from "@/app/components/clientSidebar";
import GoBack from "@/app/components/goBack";

export default function TicketForm() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // Format current date
      const currentDate = new Date();
      const creationDate = `${currentDate.toLocaleTimeString()} ${currentDate.toLocaleDateString()}`;

      const status = "Pending";

      // Get the current user's uid if available
      const currentUser = firebaseConfig.auth.currentUser;
      const clientID = currentUser ? currentUser.uid : null;

      if (!clientID) {
        throw new Error("No authenticated user found.");
      }

      // Fetch the users email
      const userDoc = await getDoc(doc(firebaseConfig.db, "users", clientID));
      const userEmail = userDoc.exists()
        ? userDoc.data().email
        : "Unknown User";

      // Sending email
      const response = await fetch("/api/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "demomailtrap.com",
          to: "zimbajoel@gmail.com",
          subject: `TICKET CREATION - ${subject}`,
          text: `Please attend to this TICKET.\n\nMESSAGE: ${description}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email notification.");
      }

      console.log("Email notification sent ", await response.json());

      // // Add ticket data to Firestore
      const docRef = await addDoc(collection(firebaseConfig.db, "tickets"), {
        subject,
        description,
        creationDate,
        status,
        clientID, // Include the clientID in the ticket document
      });

      console.log("Document written with ID: ", docRef.id);

      // Show notification
      setNotification("Ticket submitted successfully.");

      // Clear form fields
      setSubject("");
      setDescription("");
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Failed to submit ticket. Please try again later.");
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <div className="flex bg-zinc-100">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className="flex-grow w-8/12 lg:w-10/12 py-8 px-10 md:px-64">
        <div className="text-zinc-900 justify-between flex mt-8">
          <h1 className="text-2xl font-bold mb-8">Submit a Ticket</h1>
          {/* Back button */}
          <GoBack />
        </div>
        {/* Your form JSX */}

        {/* {notification && (
          <div className="bg-green-100 border-green-400 text-green-700 px-4 py-3 mb-4 rounded">
            {notification}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
            {error}
          </div>
        )} */}
        {notification && (
          <div
            className={`${
              notification.includes("failed") || notification.includes("error")
                ? "bg-red-100 border-red-400 text-red-700"
                : "bg-green-100 border-green-400 text-green-700"
            } px-4 py-3 mb-4 rounded relative`}
            role="alert"
          >
            <span className="block sm:inline">{notification}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg
                className={`fill-current h-6 w-6 ${
                  notification.includes("failed") ||
                  notification.includes("error")
                    ? "text-red-500"
                    : "text-green-500"
                } `}
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                onClick={() => setNotification(null)}
              >
                <title>Close</title>
                <path
                  fillRule="evenodd"
                  d="M14.354 5.646a.5.5 0 01.708.708L10.707 10l4.354 4.354a.5.5 0 11-.708.708L10 10.707l-4.354 4.353a.5.5 0 01-.708-.708L9.293 10 4.94 5.646a.5.5 0 01.708-.708L10 9.293l4.354-4.647z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </div>
        )}

        <div className="mb-4 text-zinc-900">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-2xl px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="subject"
              >
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter subject"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                placeholder="Enter description"
                required
              />
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

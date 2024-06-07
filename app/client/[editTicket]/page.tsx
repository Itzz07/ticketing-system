"use client";

import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  DocumentData,
} from "firebase/firestore";
import firebaseConfig from "../../firebaseConfig";
import Sidebar from "../../components/clientSidebar";
import GoBack from "../../components/goBack";
import { useRouter } from "next/navigation";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  creationDate: string;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  time: string;
  userId: string;
  username: string; // Add username field to Comment interface
}

export default function Dashboard({
  params,
}: {
  params: { editTicket: string };
}) {
  const router = useRouter();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [newSubject, setSubject] = useState("");
  const [newDescription, setDescription] = useState("");
  const [newComment, setNewComment] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketDoc = await getDoc(
          doc(firebaseConfig.db, "tickets", params.editTicket)
        );
        if (ticketDoc.exists()) {
          const ticketData = ticketDoc.data();
          // Check if the comments array exists, if not, initialize it as an empty array
          const comments = ticketData.comments || [];
          // Fetch usernames for each comment
          const updatedComments = await Promise.all(
            comments.map(async (comment: Comment) => {
              const userDoc = await getDoc(
                doc(firebaseConfig.db, "users", comment.userId)
              );
              const username = userDoc.exists()
                ? userDoc.data().name
                : "Unknown User";
              return { ...comment, username };
            })
          );
          setTicket({
            id: ticketDoc.id,
            ...ticketData,
            comments: updatedComments, // Update the comments array with usernames
          } as Ticket);
        } else {
          // Ticket not found, handle error or redirect
        }
      } catch (error) {
        console.error("Error fetching ticket: ", error);
        // Handle error
      }
    };

    if (params.editTicket) {
      fetchTicket();
    }
  }, [params.editTicket]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      // Format current date
      const updateDate = new Date();
      const updateAt = `${updateDate.toLocaleTimeString()} ${updateDate.toLocaleDateString()}`;

      if (newSubject !== "") {
        await updateDoc(doc(firebaseConfig.db, "tickets", ticket!.id), {
          subject: newSubject,
        });
      }
      if (newDescription !== "") {
        await updateDoc(doc(firebaseConfig.db, "tickets", ticket!.id), {
          description: newDescription,
        });
      }
      if (newComment !== "") {
        const userId = firebaseConfig.auth.currentUser?.uid ?? "unknown";

        // Fetch the username
        const userDoc = await getDoc(doc(firebaseConfig.db, "users", userId));
        const username = userDoc.exists()
          ? userDoc.data().name
          : "Unknown User";

        const commentData: Comment = {
          id: userId,
          text: newComment,
          time: updateAt,
          userId: userId,
          username: username, // Use fetched username
        };

        await updateDoc(doc(firebaseConfig.db, "tickets", ticket!.id), {
          comments: arrayUnion(commentData),
          updatedAt: updateAt,
        });
      }
      // Refetch the ticket data after updating
      const updatedTicketDoc = await getDoc(
        doc(firebaseConfig.db, "tickets", params.editTicket)
      );
      if (updatedTicketDoc.exists()) {
        setTicket({
          id: updatedTicketDoc.id,
          ...updatedTicketDoc.data(),
        } as Ticket);
      } else {
        // Handle error if ticket not found
      }
      // Clear input fields
      setNewComment("");
      setNotification("Ticket updated successfully!");
      // Hide the notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error("Error updating ticket: ", error);
      setNotification("Failed to update ticket. Please try again later.");
      // Hide the notification after 3 seconds
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
      <div className="flex-grow w-8/12 lg:w-10/12 p-8">
        <div className="container mx-auto mt-8 ">
          <div className="flex items-center justify-between mb-4 text-zinc-900">
            {/* Row for ticket information and button */}
            <div>
              <p className="text-md font-bold uppercase">
                Ticket no# - {params.editTicket}
              </p>
            </div>
            {/* GoBack Bar */}
            <GoBack />
          </div>
          {ticket ? (
            <div className="text-zinc-800">
              {notification && (
                <div
                  className={`mb-4 border p-2 rounded-md ${
                    notification.includes("failed") ||
                    notification.includes("error")
                      ? "bg-red-100 border-red-400 text-red-700"
                      : "bg-green-100 border-green-400 text-green-700"
                  }`}
                >
                  {notification}
                </div>
              )}

              <div className="grid grid-cols-2">
                <div>
                  <p className="text-md font-medium mb-4">
                    Subject: {ticket.subject}
                  </p>
                  <p className="text-md font-medium mb-4">
                    Description: {ticket.description}
                  </p>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-sm">
                      <label
                        className="block text-cyan-700 text-sm font-bold mb-2"
                        htmlFor="subject"
                      >
                        Subject
                      </label>
                      <input
                        id="subject"
                        type="text"
                        value={newSubject}
                        onChange={(e) => setSubject(e.target.value)}
                        className=" shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Enter subject"
                      />
                    </div>
                    <div className="grid grid-cols-2">
                      <div className="mb-4 me-2 text-sm">
                        <label
                          className="block text-cyan-700 text-sm font-bold mb-1"
                          htmlFor="description"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={newDescription}
                          onChange={(e) => setDescription(e.target.value)}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
                          placeholder="Enter description"
                        />
                      </div>

                      <div className="mb-4 text-sm">
                        <label className="block mb-1 font-bold text-cyan-700">
                          New Comment:
                        </label>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add Comment..."
                          className="px-3 py-2 w-full border rounded-md outline-none focus:border-cyan-500 h-24"
                        ></textarea>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                    >
                      Update
                    </button>
                  </form>
                </div>
                <div className="mx-10 max-h-sceen h-96 px-10 py-8 bg-cyan-200 rounded-3xl overflow-x-hidden overflow-y-auto">
                  <div className="text-zinc-600">
                    {" "}
                    <h1 className="text-md font-bold mb-4">
                      View all Comments
                    </h1>
                    {/* <h2 className="text-md font-medium  mb-4">Comments</h2> */}
                  </div>

                  {ticket.comments &&
                    ticket.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="mb-4 text-sm text-justify"
                      >
                        <p className="text-cyan-700  ">{comment.time}</p>
                        <p className="text-cyan-700  ">
                          {comment.userId === "unknown"
                            ? "Unknown User"
                            : comment.userId}
                        </p>
                        <p className="text-cyan-700 font-bold uppercase">
                          {comment.username}
                        </p>
                        <p className="font-medium">{comment.text}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-cyan-500 text-center mt-52 bg-zinc-100 font-extrabold uppercase tracking-widest">
              Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



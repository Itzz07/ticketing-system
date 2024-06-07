'use client'

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import firebaseConfig from "../firebaseConfig";
import Sidebar from "../components/clientSidebar";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  creationDate: string;
  status: string;
  comments: Comment[];
  clientID: string;
}

interface Comment {
  id: string;
  text: string;
  time: string;
  userId: string;
  username: string;
}

export default function TicketList() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

  const handleSearchChange = (event: { target: { value: string } }) => {
    setSearchTerm(event.target.value);
  };

  const handleEditTicket = (ticketId: string) => {
    router.push(`/client/${ticketId}`);
  };

  const filteredTickets = tickets.filter((ticket) => {
    return (
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.creationDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage);

  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firebaseConfig.db, "tickets")
        );
        const ticketData: Ticket[] = [];
        const currentUserID = firebaseConfig.auth.currentUser?.uid;
        querySnapshot.forEach((doc) => {
          const ticket = { id: doc.id, ...doc.data() } as Ticket;
          if (ticket.clientID === currentUserID) {
            ticketData.push(ticket);
          }
        });
        setTickets(ticketData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets: ", error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="flex bg-zinc-100">
      <Sidebar />
      <div className="flex-grow flex-col w-8/12 lg:w-10/12">
        {/* Navbar */}
        <Navbar />
        <div className="container mx-auto mb-8 px-8">
          <div className="flex items-center justify-between mb-4 text-zinc-900">
            <div>
              {" "}
              <h1 className="text-2xl font-bold ">Ticket List</h1>
              <p className="text-sm">See information about all Tickets</p>
            </div>
            {/* add ticket  */}
            <button
              className="flex items-center p-2 bg-cyan-500 text-zinc-100 rounded-full"
              onClick={() => {
                router.push("/client/create-ticket");
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
          {/* search button  */}
          <div className="mb-4 justify-start flex">
            <input
              type="text"
              placeholder="Search..."
              className="w-1/4 px-4 text-zinc-700 py-2 rounded-3xl  border border-zinc-300 focus:border-cyan-500 focus:outline-none"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="text-xs w-full bg-zinc-100 shadow-md rounded-xl">
              <thead className="bg-zinc-300">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                    TICKET ID
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                    SUBJECT
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                    DESCRIPTION
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                    COMMENTS
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                    CREATED DATE
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="p-3 text-left text-xs font-semibold text-zinc-800 uppercase tracking-wider">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm8.25 5.25a.75.75 0 0 1 .75-.75h8.25a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-zinc-800 text-center whitespace-nowrap"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : (
                  paginatedTickets.map((ticket) => (
                    <tr key={ticket.id} className="bg-white">
                      <td className="p-3 whitespace-nowrap text-xs text-gray-900">
                        {ticket.id}
                      </td>
                      <td className="p-3 whitespace-nowrap text-xs text-gray-900 overflow-hidden  max-w-20 text-ellipsis">
                        {ticket.subject}
                      </td>
                      <td className="p-3 whitespace-nowrap text-xs text-gray-900 overflow-hidden  max-w-20 text-ellipsis">
                        {ticket.description}
                      </td>
                      <td className="p-3 whitespace-nowrap text-xs text-zinc-800">
                        {ticket.comments && ticket.comments.length > 0 && (
                          <>
                            <p>
                              {ticket.comments[ticket.comments.length - 1].text}
                            </p>
                            <p className="text-gray-500">
                              {
                                ticket.comments[ticket.comments.length - 1]
                                  .username
                              }
                            </p>
                          </>
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap text-xs text-gray-900">
                        {ticket.creationDate}
                      </td>
                      <td className="p-2 whitespace-nowrap text-xs text-gray-900">
                        <div
                          className={`px-2 py-1 text-center rounded-full ${
                            ticket.status == "Resolved"
                              ? "bg-green-300"
                              : ticket.status == "In Progress"
                              ? "bg-yellow-300"
                              : "bg-red-300"
                          }`}
                        >
                          {ticket.status}
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-sky-800 hover:text-sky-500">
                        <button
                          className="focus:outline-none "
                          onClick={() => handleEditTicket(ticket.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="size-5"
                          >
                            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex justify-between mt-4">
                <select
                  className="px-3 py-1 text-cyan-700  bg-zinc-100 rounded border border-gray-300 focus:border-cyan-500"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
                    setCurrentPage(1); // Reset to first page when changing rows per page
                  }}
                >
                  {[10, 15, 20, 50].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="mx-2 px-3 py-1 rounded bg-gray-200 text-gray-700"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`mx-2 px-3 py-1 rounded ${
                        currentPage === index + 1
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="mx-2 px-3 py-1 rounded bg-gray-200 text-gray-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


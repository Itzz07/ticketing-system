"use client";



import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import firebaseConfig from "../firebaseConfig";
import Sidebar from "../components/adminSidebar";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  creationDate: string;
  status: string;
  updatedAt: string;
  comments: Comment[];
  clientID: string;
}

interface Comment {
  id: string;
  text: string;
  userId: string;
  username: string; // Add username field to Comment interface
}

interface User {
  name: string;
  role: string;
  email: string;
}

interface TicketWithUser extends Ticket {
  userName: string;
  role: string;
  email: string;
}

export default function Dashboard() {
     const router = useRouter();
  const [tickets, setTickets] = useState<TicketWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTickets, setFilteredTickets] = useState<TicketWithUser[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Change this value according to your requirement

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(firebaseConfig.db, "tickets")
        );
        const ticketData: TicketWithUser[] = [];
        const promises: Promise<void>[] = [];

        querySnapshot.forEach((doc) => {
          const ticket = { id: doc.id, ...doc.data() } as TicketWithUser;
          ticketData.push(ticket);
          if (ticket.clientID) {
            const promise = fetchUserData(ticket.clientID).then((userData) => {
              ticket.userName = userData.name;
              ticket.role = userData.role;
              ticket.email = userData.email;
            });
            promises.push(promise);
          }
        });

        await Promise.all(promises);

        setTickets(ticketData);
        setFilteredTickets(ticketData); // Initialize filtered tickets with all tickets
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets: ", error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const fetchUserData = async (userID: string): Promise<User> => {
    try {
      const userDoc = await getDoc(doc(firebaseConfig.db, "users", userID));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        return userData;
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
    return {
      name: "Unknown User",
      role: "",
      email: "",
    };
  };

  // Function to filter tickets based on the search query
  const filterTickets = (query: string) => {
    const filtered = tickets.filter(
      (ticket) =>
        ticket.id.toLowerCase().includes(query.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(query.toLowerCase()) ||
        ticket.status.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTickets(filtered);
  };

  // Handle search input change
  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
    filterTickets(event.target.value);
  };

  // Calculate index of the first and last ticket for the current page
  const indexOfLastTicket = currentPage * rowsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - rowsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstTicket,
    indexOfLastTicket
  );

  const handleEditTicket = (ticketId: string) => {
    // Navigate to the edit page with the ticket ID
    router.push(`/admin/${ticketId}`);
  };


  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex bg-zinc-100 ">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content */}
      <div className="flex-grow flex-col w-8/12 lg:w-10/12 ">
        {/* Navbar */}
        <Navbar />
        <div className="container mx-auto mt-8 px-8">
          <div className="flex items-center justify-between mb-4 text-zinc-900">
            {/* Row for ticket information and button */}
            <div>
              <h1 className="text-2xl font-bold ">Ticket List</h1>
              <p className="text-sm">See information about all Tickets</p>
            </div>
            {/* Search Bar */}
            <div className="mb-4 justify-end flex w-1/3">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search by TicketID, Subject or Status..."
                className="w-full px-4 py-2 rounded-3xl ring-1 border-1 border-cyan-500  focus:ring-cyan-300 focus:border-cyan-300 focus:outline-none"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="text-xs w-full bg-white shadow-md rounded-xl">
              {/* Table Header */}
              <thead className="bg-cyan-100">
                {" "}
                <tr>
                  {" "}
                  <th className="p-2 font-semibold text-zinc-700 uppercase tracking-wide">
                    ticket ID{" "}
                  </th>{" "}
                  <th className="p-2 font-semibold text-zinc-700 uppercase tracking-wide">
                    Subject{" "}
                  </th>{" "}
                  <th className="p-2 font-semibold text-zinc-700 uppercase tracking-wide">
                    Description{" "}
                  </th>{" "}
                  <th className="p-2 font-semibold text-zinc-700 uppercase tracking-wide">
                    Created Date{" "}
                  </th>{" "}
                  <th className="p-2 font-semibold text-zinc-700 uppercase tracking-wide">
                    Status{" "}
                  </th>{" "}
                  <th className="p-2 font-semibold text-zinc-700 uppercase tracking-wide">
                    updated Date{" "}
                  </th>{" "}
                  <th className="p-2 font-semibold text-zinc-700 uppercase tracking-wide">
                    Comments{" "}
                  </th>{" "}
                  <th className="p-2 font-semibold text-zinc-700 uppercase tracking-wide">
                    Name{" "}
                  </th>{" "}
                  <th className="p-2 font-semibold text-zinc-700 uppercase tracking-wide">
                    Role{" "}
                  </th>{" "}
                  {/* <th className="p-2 font-semibold text-zinc-700 uppercase tracking-wide">
                    Email{" "}
                  </th>{" "} */}
                  <th className="p-2 font-semibold text-zinc-700 uppercase tracking-wider">
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
                    </svg>{" "}
                  </th>{" "}
                </tr>{" "}
              </thead>
              {/* Table Body */}
              <tbody className="divide-y divide-zinc-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-6 py-4 text-center whitespace-nowrap  text-zinc-800"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : (
                  currentTickets.map((ticket) => (
                    <tr key={ticket.id} className="bg-white">
                      <td className="p-4 whitespace-nowrap text-zinc-800">
                        {ticket.id}
                      </td>
                      <td className="p-4 whitespace-nowrap text-zinc-800 overflow-hidden  max-w-20 text-ellipsis">
                        {ticket.subject}
                      </td>
                      <td className="p-4 whitespace-nowrap text-zinc-800">
                        <button
                          className=" overflow-hidden  max-w-20 text-ellipsis"
                          onClick={() => handleEditTicket(ticket.id)}
                        >
                          {ticket.description}
                        </button>
                      </td>
                      <td className="p-4 whitespace-wrap text-zinc-800">
                        {ticket.creationDate}
                      </td>
                      <td className="p-4 whitespace-nowrap text-zinc-800">
                        <div
                          className={`px-2 py-1 rounded-2xl ${
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
                      <td className="p-4 whitespace-wrap text-zinc-800">
                        {ticket.updatedAt}
                      </td>
                      <td className="p-4 whitespace-nowrap text-zinc-800">
                        {/* Display the latest comment's text and username */}
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
                      <td className="p-4 whitespace-nowrap text-zinc-800">
                        {ticket.userName}
                      </td>
                      <td className="p-4 whitespace-nowrap text-zinc-800">
                        {ticket.role}
                      </td>
                      {/* <td className="p-4 whitespace-nowrap text-zinc-800">
                        {ticket.email}
                      </td> */}
                      <td className="px-2 py-4 whitespace-nowrap text-cyan-800">
                        <button
                          className="focus:outline-none"
                          onClick={() => handleEditTicket(ticket.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredTickets.length}
            itemsPerPage={rowsPerPage}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
}

// Pagination Component
const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  paginate,
}: {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  paginate: (pageNumber: number) => void;
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="flex justify-center mt-4">
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`mr-2 focus:outline-none ${
            currentPage === number
              ? "bg-cyan-500 text-white"
              : "bg-white text-cyan-500"
          } px-3 py-1 rounded-full`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};
// import { useState, useEffect } from "react";
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import firebaseConfig from "../firebaseConfig";
// import Sidebar from "../components/adminSidebar";

// interface Ticket {
//   id: string;
//   subject: string;
//   description: string;
//   creationDate: string;
//   status: string;
//   clientID: string;
// }

// interface User {
//   name: string;
//   role: string;
//   email: string;
// }

// interface TicketWithUser extends Ticket {
//   userName: string;
//   role: string;
//   email: string;
// }

// export default function Dashboard() {
//   const [tickets, setTickets] = useState<TicketWithUser[]>([]);
//   const [loading, setLoading] = useState(true);
//  const [searchQuery, setSearchQuery] = useState("");
//  const [filteredTickets, setFilteredTickets] = useState<TicketWithUser[]>([]);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const querySnapshot = await getDocs(
//           collection(firebaseConfig.db, "tickets")
//         );
//         const ticketData: TicketWithUser[] = [];
//         const promises: Promise<void>[] = [];

//         querySnapshot.forEach((doc) => {
//           const ticket = { id: doc.id, ...doc.data() } as TicketWithUser;
//           ticketData.push(ticket);
//           if (ticket.clientID) {
//             const promise = fetchUserData(ticket.clientID).then((userData) => {
//               ticket.userName = userData.name;
//               ticket.role = userData.role;
//               ticket.email = userData.email;
//             });
//             promises.push(promise);
//           }
//         });

//         await Promise.all(promises);

//         setTickets(ticketData);
//         setFilteredTickets(ticketData); // Initialize filtered tickets with all tickets
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching tickets: ", error);
//         setLoading(false);
//       }
//     };

//     fetchTickets();
//   }, []);

//   const fetchUserData = async (userID: string): Promise<User> => {
//     try {
//       const userDoc = await getDoc(doc(firebaseConfig.db, "users", userID));
//       if (userDoc.exists()) {
//         const userData = userDoc.data() as User;
//         return userData;
//       }
//     } catch (error) {
//       console.error("Error fetching user data: ", error);
//     }
//     return {
//       name: "Unknown User",
//       role: "",
//       email: "",
//     };
//   };

//   // Function to filter tickets based on the search query
//   const filterTickets = (query: string) => {
//     const filtered = tickets.filter(
//       (ticket) =>
//         ticket.id.toLowerCase().includes(query.toLowerCase()) ||
//         ticket.subject.toLowerCase().includes(query.toLowerCase()) ||
//         ticket.status.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredTickets(filtered);
//   };

//   // Handle search input change
//   const handleSearchInputChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setSearchQuery(event.target.value);
//     filterTickets(event.target.value);
//   };

//   return (
//     <div className="flex bg-zinc-100">
//       {/* Sidebar */}
//       <Sidebar />
//       {/* Main content */}
//       <div className="flex-grow w-8/12 lg:w-10/12 p-8">
//         <div className="container mx-auto mt-8">
//           <div className="flex items-center justify-between mb-4 text-zinc-900">
//             {/* Row for ticket information and button */}
//             <div>
//               {" "}
//               <h1 className="text-2xl font-bold ">Ticket List</h1>
//               <p className="text-sm">See information about all Tickets</p>
//             </div>
//             {/* Search Bar */}
//             <div className="mb-4 justify-end flex w-1/3">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={handleSearchInputChange}
//                 placeholder="Search by TicketID, Subject or Status..."
//                 className="w-full px-4 py-2 rounded-3xl ring-1 border-1 border-cyan-500  focus:ring-cyan-500 focus:border-cyan-500"
//               />
//             </div>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="text-xs w-full bg-white shadow-md rounded-xl">
//               <thead className="bg-cyan-100">
//                 <tr>
//                   <th className="p-3 font-semibold text-zinc-700 uppercase tracking-wide">
//                     ticket ID
//                   </th>
//                   <th className="p-3 font-semibold text-zinc-700 uppercase tracking-wide">
//                     Subject
//                   </th>
//                   <th className="p-3 font-semibold text-zinc-700 uppercase tracking-wide">
//                     Description
//                   </th>
//                   <th className="p-3 font-semibold text-zinc-700 uppercase tracking-wide">
//                     Created Date
//                   </th>
//                   <th className="p-3 font-semibold text-zinc-700 uppercase tracking-wide">
//                     Status
//                   </th>
//                   <th className="p-3 font-semibold text-zinc-700 uppercase tracking-wide">
//                     Name
//                   </th>
//                   <th className="p-3 font-semibold text-zinc-700 uppercase tracking-wide">
//                     Role
//                   </th>
//                   <th className="p-3 font-semibold text-zinc-700 uppercase tracking-wide">
//                     Email
//                   </th>
//                   <th className="p-3 font-semibold text-zinc-700 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-zinc-200">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={8} className="px-6 py-4 whitespace-nowrap">
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredTickets.map((ticket) => (
//                     <tr key={ticket.id} className="bg-white">
//                       <td className="p-4 whitespace-nowrap text-zinc-800">
//                         {ticket.id}
//                       </td>
//                       <td className="p-4 whitespace-nowrap text-zinc-800">
//                         {ticket.subject}
//                       </td>
//                       <td className="p-4 whitespace-wrap text-zinc-800">
//                         {ticket.description}
//                       </td>
//                       <td className="p-4 whitespace-wrap text-zinc-800">
//                         {ticket.creationDate}
//                       </td>
//                       <td className="p-4 whitespace-nowrap text-zinc-800">
//                         <div
//                           className={`px-2 py-1 rounded-2xl ${
//                             ticket.status == "Resolved"
//                               ? "bg-green-300"
//                               : ticket.status == "In Progress"
//                               ? "bg-yellow-300"
//                               : "bg-red-300"
//                           }`}
//                         >
//                           {ticket.status}
//                         </div>
//                       </td>
//                       <td className="p-4 whitespace-nowrap text-zinc-800">
//                         {ticket.userName}
//                       </td>
//                       <td className="p-4 whitespace-nowrap text-zinc-800">
//                         {ticket.role}
//                       </td>
//                       <td className="p-4 whitespace-nowrap text-zinc-800">
//                         {ticket.email}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm justify-center flex text-gray-900">
//                         <button
//                           className="focus:outline-none"
//                           //   onClick={() => handleEditTicket(ticket.id)}
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             strokeWidth={1.5}
//                             stroke="currentColor"
//                             className="size-6"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
//                             />
//                           </svg>
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




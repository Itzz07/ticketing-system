import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import firebaseConfig from "../firebaseConfig";

export default function Dashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userId = firebaseConfig.auth.currentUser?.uid ?? "unknown";
        const userDoc = await getDoc(doc(firebaseConfig.db, "users", userId));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } catch (error) {
        console.error("Error fetching user role: ", error);
        // Handle error
      } finally {
        setLoading(false); // Update loading state when fetch is complete
      }
    };

    fetchUserRole(); // Call fetchUserRole directly inside useEffect
  },);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator
  }

  return (
    <>
      {/* Navbar */}
      <nav className="bg-zinc-100 py-2 px-8">
        <div className="container mx-auto flex justify-end items-center">
          <h1 className="text-cyan-500 text-xl text-end font-extrabold">
            {userRole === "admin" ? "Welcome Admin" : "Welcome Client"}
          </h1>
          {/* Add logout button if needed */}
        </div>
      </nav>
    </>
  );
}

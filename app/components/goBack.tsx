import { useRouter } from "next/navigation";
export default function GoBack(){
      const router = useRouter(); // Initialize useRouter hook
// Function to handle going back
  const handleGoBack = () => {
    router.back(); // Go back to the previous page in history
  };
    return (
      <div>
        <button
          className="p-2 text-zinc-100 bg-cyan-500 rounded-full hover:bg-cyan-600 "
          onClick={handleGoBack} // Attach onClick event to the handleGoBack function
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>{" "}
      </div>
    );
}
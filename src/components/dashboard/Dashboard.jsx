"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "./Navbar";
import { FiUploadCloud } from "react-icons/fi";
import UserCard from "./UserCard";

export function Dashboard() {
  const router = useRouter();
  const [guests, setGuests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/check-token",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 401) {
          window.location.href = "/login";
        } else {
          const data = await response.text();
          console.log("Valid token:", data);
        }
      } catch (error) {
        toast.error("Error while verifying token:", error);
        window.location.href = "/login";
      }
    };

    const fetchGuests = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/users/guests",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch guests");
        }

        const data = await response.json();
        setGuests(data);
      } catch (error) {
        toast.error("Error fetching guests", error);
      }
    };

    verifyToken();
    fetchGuests();
  }, [router]);

  const filteredGuests = guests.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.gstNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openReportModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeReportModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setReportFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      return;
    }

    setReportFile(file);
  };

  const handleSubmitReport = async () => {
    if (!reportFile) {
      toast.error("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", reportFile); // ✅ Ensure file is added
    formData.append("reportedUser", selectedUser?.name);
    formData.append("gstNo", selectedUser?.gstNo);
    formData.append("email", selectedUser?.email);

    const token = localStorage.getItem("token"); // ✅ Get the token

    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Ensure token is included
        },
        body: formData, // ✅ Use FormData (No need for Content-Type)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit report");
      }

      toast.success("Report submitted successfully!");
      closeReportModal();
    } catch (error) {
      toast.error(error.message);
    }
  };

  

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <Navbar className="top-2" />
      <div className="flex flex-col items-center justify-center h-screen px-4 sm:px-8 md:px-16">
        <div className="w-full max-w-4xl rounded-md text-center p-6 md:p-10 flex flex-col items-center justify-center antialiased">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold">
            Welcome to Dashboard
          </h1>

          {/* 🔎 Search Input */}
          <div className="my-4 w-full max-w-md">
            <input
              type="text"
              placeholder="Search by Name or GST No"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border opacity-50 dark:bg-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:placeholder:text-white"
            />
          </div>

          <div className="text-white text-4xl font-bold mb-6">Guest Users</div>

          {/* Guest List as Cards */}
          <div>
          {filteredGuests.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              No guests found
            </p>
          ) : (
            filteredGuests.map((user) => (
              <UserCard
                key={user.gstNo}
                user={user}
                openReportModal={openReportModal}
              />
            ))
          )}
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
              Report {selectedUser?.name}
            </h2>

            {/* Upload Image Input */}
            <div className="mt-4 flex flex-col items-center">
              <label
                htmlFor="file-upload"
                className="cursor-pointer border-2 border-dashed border-gray-400 dark:border-gray-600 p-6 rounded-lg flex flex-col items-center w-full"
              >
                <FiUploadCloud className="text-4xl text-gray-500 dark:text-gray-400 mb-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  Click to upload PDF
                </span>
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf"
                onChange={handleFileChange}
              />

              {reportFile && (
                <p className="mt-2 text-sm text-green-600">
                  PDF selected: {reportFile.name}
                </p>
              )}
            </div>

            {/* Modal Buttons */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={closeReportModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

"use client";
import React, { useEffect, useState } from "react";

const UserCard = ({ user, openReportModal }) => {
  const [ReportedGuests, setReportedGuests] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchReportedGuests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("https://cap-backend-6vpq.onrender.com/api/reports/approved-reports", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setReportedGuests(data);
      } catch (error) {
        console.error("Error fetching reported guests:", error.message);
      }
    };

    fetchReportedGuests();
  }, []);

  // Find reporters for this user
  const reportedBy = ReportedGuests.find((report) => report.gstNo === user.gstNo)?.reporters || [];

  return (
    <div className="p-2">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col w-full">
        <div className="flex items-center space-x-4">
          {/* Profile Photo */}
          <img
            src={user?.profilePhoto || "/default-profile.png"} // Fallback image
            alt={user?.name || "User"}
            className="w-16 h-16 rounded-full object-cover border border-gray-300"
          />

          {/* User Details */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.name || "Unknown User"}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">{user?.email || "No email provided"}</p>
            <p className="text-gray-700 dark:text-gray-400">
              <strong>GST No:</strong> {user?.gstNo || "N/A"}
            </p>
            <p className="text-gray-700 dark:text-gray-400">
              <strong>Role:</strong> {user?.role || "N/A"}
            </p>
          </div>

          {/* Report Button */}
          <button
            onClick={() => openReportModal(user)}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Report
          </button>
        </div>

        {/* Reported Users List */}
        {reportedBy.length > 0 && (
          <div className="mt-2 p-1 bg-gray-200 dark:bg-gray-900 rounded-lg">
            {/* <h4 className="text-md font-semibold text-gray-700 dark:text-white">Reported By:</h4> */}

            <div className="flex flex-wrap gap-2">
              {(showAll ? reportedBy : reportedBy.slice(0, 2)).map((reporter, index) => (
                <div key={index} className="flex items-center gap-2 p-2 dark:bg-gray-700 shadow rounded-lg">
                  <img
                    src={reporter.profilePhoto}
                    alt={reporter.name}
                    className="w-6 h-6 rounded-full border border-gray-300"
                  />
                  <span className="text-xs text-white">{reporter.name}</span>
                </div>
              ))}
            </div>

            {/* Show More Button */}
            {reportedBy.length > 2 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                {showAll ? "Show Less" : `+${reportedBy.length - 2} More`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;

"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../dashboard/Navbar";

function Approve() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reports", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const updateReportStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/reports/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${status.toLowerCase()} report`);
      }

      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === id ? { ...report, status } : report
        )
      );
    } catch (error) {
      console.error(`Error updating report status:`, error);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <Navbar className="top-2" />

      <div className="max-w-4xl w-full mt-28 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
          Approve or Decline Reports
        </h2>

        <div className="mt-4">
          {reports.length === 0 ? (
            <p className="text-gray-500 text-center">No reports found</p>
          ) : (
            <table className="w-full mt-4 border-collapse border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                  <th className="border border-gray-300 p-2">Reported User</th>
                  <th className="border border-gray-300 p-2">GST No</th>
                  <th className="border border-gray-300 p-2">Status</th>
                  <th className="border border-gray-300 p-2">Report File</th>
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report._id} className="text-center">
                    <td className="border border-gray-300 p-2">{report.reportedUser}</td>
                    <td className="border border-gray-300 p-2">{report.gstNo}</td>
                    <td
                      className={`border border-gray-300 p-2 ${
                        report.status === "Approved"
                          ? "text-green-600"
                          : report.status === "Declined"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {report.status}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <a
                        href={report.legalDocument}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View Report
                      </a>
                    </td>
                    <td className="border border-gray-300 p-2 flex gap-2 justify-center">
                      {report.status === "Pending" && (
                        <>
                          <button
                            onClick={() => updateReportStatus(report._id, "Approved")}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateReportStatus(report._id, "Rejected")}
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                          >
                            Decline
                          </button>
                        </>
                      )}
                      {(report.status === "Approved" || report.status === "Rejected") && (
                        <span className="text-gray-500">{report.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Approve;

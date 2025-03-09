"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../dashboard/Navbar";

function Reportstatus() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
        const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5000/api/reports/my-reports", {
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

  const deleteReport = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete report");
      }

      setReports((prevReports) => prevReports.filter((report) => report._id !== id));
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center">
      <Navbar className="top-2" />

      <div className="max-w-4xl w-full mt-28 p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
          My Report Status
        </h2>

        <div className="mt-4">
          {reports.length === 0 ? (
            <p className="text-gray-500 text-center">No reports found</p>
          ) : (
            <table className="w-full mt-4 border-collapse border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-200 dark:bg-gray-700">
                <th className="border border-gray-300 p-2">Reported</th>
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
                      {(report.status === "Approved" || report.status === "Rejected") && (
                        <button
                          onClick={() => deleteReport(report._id)}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                      {report.status === "Pending" && <span className="text-gray-500">Pending</span>}
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

export default Reportstatus;

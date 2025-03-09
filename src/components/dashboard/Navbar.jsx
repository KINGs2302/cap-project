"use client";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { navItems } from "@/components/utils/role";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

function Navbar({ className }) {
  const pathname = usePathname();
  const [role, setRole] = useState("guest");
  const router = useRouter();

  useEffect(() => {
    const storedRole = localStorage.getItem("userrole") || "guest";
    setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userrole");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", { autoClose: 1000 });
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <div
      className={cn(
        "fixed top-5 left-0 right-0 mx-auto z-50 bg-white dark:bg-gray-900 shadow-lg p-4 rounded-lg max-w-3xl w-full md:w-auto",
        className
      )}
    >
      <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
        {navItems[role]?.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={cn(
              "px-4 py-2 rounded-md text-sm sm:text-base transition-all duration-300",
              pathname === item.path
                ? "bg-slate-800 text-white font-semibold"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
          >
            {item.name}
          </button>
        ))}
        {role !== "guest" && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-900 text-sm sm:text-base"
          >
            Logout
          </button>
        )}
      </nav>
    </div>
  );
}

export default Navbar;

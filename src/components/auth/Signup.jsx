"use client";
import React,{useState} from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import {ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function SignupFormDemo() {
    const router = useRouter();
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      password: "",
      gstNo: "",
      address:"",
      role: "user",
    });
    const [error, setError] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
  
      try {
        const response = await fetch("https://cap-backend-6vpq.onrender.com/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Signup failed");

        toast.success("Signup successful! Redirecting...", { autoClose: 2000 });
  
        localStorage.setItem("token", data.token); // Store JWT
        localStorage.setItem("userrole", formData.role);
        localStorage.setItem("username", formData.name); 
        setTimeout(() => {
        router.push("/login");
      }, 2000); // Redirect to dashboard
  
      } catch (err) {
        toast.error(err.message || "Something went wrong!");
      }
    };
  
  return (
    (<div
      className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to CAM
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Login to aceternity if you can because we don&apos;t have a login flow
        yet
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <div
          className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="name">Username</Label>
            <Input id="name" placeholder="xyz" type="text" 
                value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="gstNo">GST NO.</Label>
          <Input id="gstNo" placeholder="1111xxxxxxx1x11" type="text" 
             value={formData.gstNo}
            onChange={(e) => setFormData({ ...formData, gstNo: e.target.value.toUpperCase() })}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="project@xyz.com" type="email"
           value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="address">Address</Label>
          <Input id="address" placeholder="xyz" type="text" 
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit">
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div
          className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500">
          Login
        </a>
      </p>
        <div className="flex flex-col space-y-4">
          
        </div>
      </form>
    </div>)
  );
}

const BottomGradient = () => {
  return (<>
    <span
      className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span
      className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>);
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    (<div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>)
  );
};

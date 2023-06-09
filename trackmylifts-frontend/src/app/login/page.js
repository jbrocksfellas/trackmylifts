"use client";
import React, { useEffect, useState } from "react";
import { apiAxios } from "../utils/api.util";
import { getAccessToken, getUser, saveAccessToken, saveUser } from "../utils/auth.util";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "../utils/toast.util";
import { extractError } from "../utils/error.util";

export default function page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!(email && password)) return toast.error("Please enter all details");

      const { data } = await apiAxios.post("/users/login", { email, password });

      const token = data.accessToken;
      const user = data.user;

      saveAccessToken(token);
      saveUser(user);

      // update user timezone

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await apiAxios.put("/users/me/timezone", { timezone: timeZone }, { headers: { Authorization: "Bearer " + token } });

      // if user is admin send to admin panel
      if (user.type === "admin") router.push("/admin/exercises");
      else router.push("/user/track");
    } catch (err) {
      console.log(err);
      if (err.name === "AxiosError") {
        const { status, message } = extractError(err);
        console.log(status);
        toast.error("Invalid email or password!");
      }
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      const user = getUser();

      if (user.type === "admin") router.push("/admin/exercises");
      else router.push("/user/track");
    }
  }, []);

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg">
        <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Light weight baby...</h1>

        <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
          Looking for an easy way to track your progress at the gym? Look no further than our gym lift tracking app!
        </p>

        <form action="" className="mb-0 mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8" onSubmit={handleFormSubmit}>
          <p className="text-center text-lg font-medium">Sign in to your account</p>

          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>

            <div className="relative">
              <input
                type="email"
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span className="absolute inset-y-0 end-0 grid place-content-center px-4 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </span>
            </div>
          </div>

          <button type="submit" className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white">
            Sign in
          </button>

          <p className="text-center text-sm text-gray-500">
            No account?
            <Link className="underline" href="/register">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

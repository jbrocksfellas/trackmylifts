"use client";
import classNames from "classnames";
import React from "react";
import Link from "next/link";

export default function AdminNavigation({ className }) {
  const handleLogout = () => {};

  return (
    <div className={classNames("navbar bg-base-100", className)}>
      <div className="flex-1">
        <Link href="#" className="btn btn-ghost normal-case text-xl">
          TrackMyLifts
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control"></div>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img src="/default.jpg" />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

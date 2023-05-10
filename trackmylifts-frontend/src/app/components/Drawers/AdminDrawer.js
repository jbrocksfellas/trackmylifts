"use client";
import classNames from "classnames";
import Link from "next/link";
import React, { useRef } from "react";

export default function AdminDrawer({ className, children }) {
  const drawerToggleRef = useRef();

  const toggleDrawer = () => {
    drawerToggleRef.current.checked = false;
  };

  return (
    <div className={classNames("drawer drawer-mobile", className)}>
      <input ref={drawerToggleRef} id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-start justify-start">
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden ml-4">
          Open
        </label>
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-100 text-base-content">
          <li>
            <Link href="/admin/users" onClick={toggleDrawer}>
              users
            </Link>
          </li>
          <li>
            <Link href="/admin/exercises" onClick={toggleDrawer}>
              exercises
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

"use client";

import classNames from "classnames";

export default function PercentageUpIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" width="24px" height="24px" className={classNames(className)}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M7 14l5-5 5 5H7z" />
    </svg>
  );
}
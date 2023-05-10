"use client";

import classNames from "classnames";

export default function Table({ className, headings = [], rows = [] }) {
  return (
    <div className={classNames("overflow-x-auto", className)}>
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th></th>
            {headings.map((heading, i) => {
              return <th key={i}>{heading}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {rows.map((row, i) => {
            return (
              <tr key={i}>
                <th>{i + 1}</th>

                {row.map((r, i) => {
                  return <td key={i}>{r}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

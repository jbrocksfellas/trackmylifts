"use client";

import classNames from "classnames";

export default function Modal({ children, show = false }) {
  return (
    <div>
      <input type="checkbox" id="my-modal" className="modal-toggle" />
      <div className={classNames("modal", { "modal-open": show })}>
        <div className="modal-box">{children}</div>
      </div>
    </div>
  );
}

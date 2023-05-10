import classNames from "classnames";
import { CiCircleRemove } from "react-icons/ci";

export default function Badge({ value, className, onRemove }) {
  return (
    <div className={classNames("badge bg-primary py-2", className)}>
      {value} <CiCircleRemove className="ml-1 cursor-pointer" onClick={onRemove} />
    </div>
  );
}

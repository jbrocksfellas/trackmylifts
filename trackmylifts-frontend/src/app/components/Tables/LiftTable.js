"use client";

export default function LiftTable({ sets = [], onAdd }) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        {/* head */}
        <thead>
          <tr>
            <th>Set</th>
            <th>Reps</th>
            <th>Weight (kg)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          {sets.map((set, i) => {
            return (
              <tr key={i}>
                <th>{i + 1}</th>
                <td>{set.reps}</td>
                <td>{set.weight}</td>
                <td>
                  <button className="btn btn-accent">Edit</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

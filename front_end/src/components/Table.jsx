import React from "react";

const Table = ({ columns, data }) => (
  <div className="overflow-x-auto bg-n-8 rounded-xl border border-n-6">
    <table className="min-w-full bg-n-8 rounded-xl">
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col}
              className="px-4 py-2 text-left text-n-1 font-semibold border-b border-n-6"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="hover:bg-n-7">
            {row.map((cell, j) => (
              <td key={j} className="px-4 py-2 border-b border-n-6">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;

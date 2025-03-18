import { flexRender, Table as ReactTable } from "@tanstack/react-table";

interface TableProps<T> {
  table: ReactTable<T>;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function Table<T>({
  table,
  isLoading = false,
  emptyMessage = "No data available",
}: Readonly<TableProps<T>>) {
  const renderTableBody = () => {
    // Loading state
    if (isLoading) {
      return (
        <tr>
          <td
            colSpan={table.getAllColumns().length}
            className="px-4 py-6 text-center text-sm text-gray-500"
          >
            Loading...
          </td>
        </tr>
      );
    }

    // Data state - render rows
    if (table.getRowModel().rows.length) {
      return table.getRowModel().rows.map((row) => (
        <tr key={row.id} className="hover:bg-gray-50">
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-4 py-3 text-sm text-gray-700">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ));
    }

    // Empty state
    return (
      <tr>
        <td
          colSpan={table.getAllColumns().length}
          className="px-4 py-6 text-center text-sm text-gray-500"
        >
          {emptyMessage}
        </td>
      </tr>
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: "↑",
                    desc: "↓",
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">{renderTableBody()}</tbody>
      </table>
    </div>
  );
}

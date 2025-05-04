import React, { useState } from 'react';

interface TableGridSelectorProps {
  open: boolean;
  onClose: () => void;
  onInsert: (rows: number, cols: number) => void;
  anchorRef?: React.RefObject<HTMLButtonElement | null>;
}

export const TableGridSelector: React.FC<TableGridSelectorProps> = ({ open, onClose, onInsert }) => {
  const [hoveredRow, setHoveredRow] = useState(0);
  const [hoveredCol, setHoveredCol] = useState(0);

  const maxGrid = 10;

  if (!open) return null;

  return (
    <div className="fixed top-[60px] left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg border rounded p-3 w-fit">
      <div className="grid gap-0.5" style={{ gridTemplateRows: `repeat(${maxGrid}, 20px)` }}>
        {[...Array(maxGrid)].map((_, row) => (
          <div key={row} className="grid grid-cols-10 gap-0.5">
            {[...Array(maxGrid)].map((_, col) => {
              const isActive = row <= hoveredRow && col <= hoveredCol;
              return (
                <div
                  key={col}
                  className={`w-5 h-5 border ${isActive ? 'bg-blue-400' : 'bg-white'}`}
                  onMouseEnter={() => {
                    setHoveredRow(row);
                    setHoveredCol(col);
                  }}
                  onClick={() => onInsert(row + 1, col + 1)}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-2 text-sm text-center">
        {hoveredRow + 1} x {hoveredCol + 1} Table
      </div>
      <div className="text-right mt-2">
        <button
          onClick={onClose}
          className="text-sm px-2 py-1 border rounded hover:bg-neutral-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

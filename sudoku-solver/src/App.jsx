import "./App.css";
import React, { useState } from "react";
import { Eraser, Zap, RotateCcw, Camera, Upload } from "lucide-react";

function App() {
  const [board, setBoard] = useState(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(0))
  );
  const [solution, setSolution] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [inputMode, setInputMode] = useState(true); // true = input mode, false = solution mode
  // Solver Algorithm
  const solveSudoku = (grid) => {
    const board = grid.map((row) => [...row]);

    const isValid = (board, row, col, num) => {
      // Check row
      for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
      }

      // Check column
      for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
      }

      // Check 3x3 box
      const boxRow = Math.floor(row / 3) * 3;
      const boxCol = Math.floor(col / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[boxRow + i][boxCol + j] === num) return false;
        }
      }

      return true;
    };

    const solve = () => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(board, row, col, num)) {
                board[row][col] = num;
                if (solve()) return true;
                board[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    if (solve()) {
      return board;
    }
    return null;
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    if (inputMode) {
      setSelectedCell({ row, col });
    }
  };

  // Handle number input
  const handleNumberInput = (num) => {
    if (!selectedCell || !inputMode) return;

    const { row, col } = selectedCell;
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);
    setSolution(null); // Clear solution when board changes
  };

  // Solve the puzzle
  const handleSolve = () => {
    const result = solveSudoku(board);
    console.log(result);

    if (result) {
      setSolution(result);
      setInputMode(false);
      alert("✓ Puzzle solved successfully!");
    } else {
      alert("✗ No solution found. Please check your input.");
    }
  };

  // Clear board
  const handleClear = () => {
    setBoard(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(0))
    );
    setSolution(null);
    setSelectedCell(null);
    setInputMode(true);
  };

  // Reset to input
  const handleReset = () => {
    setSolution(null);
    setInputMode(true);
    setSelectedCell(null);
  };

  // Handle keyboard input
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedCell && inputMode) {
        const num = parseInt(e.key);
        if (num >= 1 && num <= 9) {
          handleNumberInput(num);
        } else if (
          e.key === "Backspace" ||
          e.key === "Delete" ||
          e.key === "0"
        ) {
          handleNumberInput(0);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedCell, inputMode]);

  const displayBoard = solution || board;
  return (
    <>
      <div className="min-h-screen min-w-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-indigo-900 mb-2">
              📱 Sudoku Solver
            </h1>
            <p className="text-gray-600">
              Enter your puzzle and get instant solution!
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-indigo-900 mb-3">
              📝 How to Use:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                <strong>Enter Your Puzzle:</strong> Click any cell and type
                numbers 1-9 (or use the number pad below)
              </li>
              <li>
                <strong>Leave Empty Cells:</strong> Keep cells at 0 or press
                Backspace/Delete to clear
              </li>
              <li>
                <strong>Solve:</strong> Click the "Solve Puzzle" button to get
                the solution
              </li>
            </ol>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={handleSolve}
                disabled={!inputMode}
                className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
              >
                <Zap size={20} />
                Solve Puzzle
              </button>

              <button
                onClick={handleReset}
                disabled={inputMode}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-semibold"
              >
                <RotateCcw size={20} />
                Edit Puzzle
              </button>

              <button
                onClick={handleClear}
                className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                <Eraser size={20} />
                Clear All
              </button>
            </div>
          </div>

          {/* Mode Indicator */}
          {!inputMode && (
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-6 text-center">
              <p className="text-green-800 font-semibold text-lg">
                ✓ Solution Displayed
              </p>
              <p className="text-green-700 text-sm">
                Click "Edit Puzzle" to make changes
              </p>
            </div>
          )}

          {/* Sudoku Board */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 flex justify-center">
            <div className="inline-block border-4 border-indigo-900">
              {displayBoard.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                  {row.map((cell, colIndex) => {
                    const isInput = board[rowIndex][colIndex] !== 0;
                    const isSolved =
                      solution &&
                      solution[rowIndex][colIndex] !==
                        board[rowIndex][colIndex];
                    const isSelected =
                      selectedCell?.row === rowIndex &&
                      selectedCell?.col === colIndex;
                    const isBoldBorder =
                      (rowIndex + 1) % 3 === 0 && rowIndex !== 8;
                    const isBoldRightBorder =
                      (colIndex + 1) % 3 === 0 && colIndex !== 8;

                    return (
                      <div
                        key={colIndex}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        className={`
                        w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg sm:text-xl font-semibold
                        border border-gray-300 transition
                        ${inputMode ? "cursor-pointer" : "cursor-default"}
                        ${
                          isInput && !solution
                            ? "bg-blue-100 text-blue-900 font-bold"
                            : "bg-white"
                        }
                        ${
                          isSolved
                            ? "bg-green-100 text-green-700 font-bold"
                            : "text-black font-bold"
                        }
                        ${
                          isSelected && inputMode
                            ? "ring-2 ring-indigo-500 bg-indigo-50"
                            : ""
                        }
                        ${inputMode && !isInput ? "hover:bg-indigo-50" : ""}
                        ${isBoldBorder ? "border-b-2 border-b-indigo-900" : ""}
                        ${
                          isBoldRightBorder
                            ? "border-r-2 border-r-indigo-900"
                            : ""
                        }
                      `}
                      >
                        {cell !== 0 ? cell : ""}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Number Pad */}
          {inputMode && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 text-center">
                Number Pad
              </h3>
              <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleNumberInput(num)}
                    disabled={!selectedCell}
                    className="w-full aspect-square text-2xl font-bold bg-indigo-100 hover:bg-indigo-200 disabled:bg-gray-100 disabled:text-gray-400 text-indigo-100 rounded-lg transition"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handleNumberInput(0)}
                  disabled={!selectedCell}
                  className="w-full aspect-square text-lg font-bold bg-red-100 hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 text-red-900 rounded-lg transition"
                >
                  Clear
                </button>
              </div>
              <p className="mt-4 text-sm text-gray-600 text-center">
                {selectedCell
                  ? "Type 1-9 or Backspace to clear"
                  : "Click a cell to start"}
              </p>
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Color Guide:</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 border border-gray-300"></div>
                <span className="text-black">Your input</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 border border-gray-300"></div>
                <span className="text-black">Solved numbers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white border-2 border-indigo-500"></div>
                <span className="text-black">Selected cell</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

import React, { useEffect, useState } from "react";

export default function Board() {
  const [table, setTable] = useState(Array(9).fill(null));
  const [currentTurn, setCurrentTurn] = useState(0);
  const [endgame, setEndgame] = useState(false);
  const [winCells, setWinCells] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");

  const handleUserClick = (index) => {
    if (!table[index] && !endgame) {
      setTable((prev) => {
        const copy = [...prev];
        copy[index] = currentTurn === 0 ? "X" : "O";
        return copy;
      });
      setCurrentTurn((prev) => (prev === 0 ? 1 : 0));
    }
  };

  const checkRow = () => {
    for (let i = 0; i < 9; i += 3) {
      console.log(table[i]);
      if (
        table[i] === table[i + 1] &&
        table[i] === table[i + 2] &&
        !!table[i]
      ) {
        setWinCells([i, i + 1, i + 2]);
        return true;
      }
      return false;
    }
  };

  const checkCol = () => {
    for (let i = 0; i < 3; i++) {
      if (
        table[i] === table[i + 3] &&
        table[i] === table[i + 6] &&
        !!table[i]
      ) {
        setWinCells([i, i + 3, i + 6]);
        return true;
      }
    }
    return false;
  };

  const checkDiagonal = () => {
    const firstDiag =
      table[0] === table[4] && table[0] === table[8] && !!table[0];
    const secondDiag =
      table[2] === table[4] && table[2] === table[6] && !!table[2];

    if (firstDiag) {
      setWinCells([0, 4, 8]);
    }
    if (secondDiag) {
      setWinCells([2, 4, 6]);
    }
    return firstDiag || secondDiag;
  };

  const checkDraw = () => {
    console.log(
      "🚀 ~ checkDraw ~ table.filter((cell) => cell):",
      table.filter((cell) => cell !== null).length === 9
    );
    return table.filter((cell) => cell !== null).length === 9;
  };

  const checkWin = () => {
    return checkRow() || checkCol() || checkDiagonal();
  };

  useEffect(() => {
    if (checkWin()) {
      setEndgame(true);
      setStatusMessage(`Match won by ${currentTurn === 1 ? "X" : "O"}`);
    }
    if (checkDraw()) {
      setEndgame(true);
      setStatusMessage("Match is a draw");
    }
  }, [table]);

  const resetGame = () => {
    setEndgame(false);
    setTable(Array(9).fill(null));
    setWinCells([]);
    setStatusMessage("");
  };

  useEffect(() => {
    return () => {
      resetGame();
    };
  }, []);

  return (
    <>
      {statusMessage ? <p>{statusMessage}</p> : <p>Match in progress</p>}
      <button onClick={resetGame}>Reset</button>
      <div className="board">
        {table.map((value, index) => (
          <Square
            key={index}
            value={value}
            onClick={() => handleUserClick(index)}
            win={endgame && winCells.includes(index)}
          />
        ))}
      </div>
    </>
  );
}

function Square({ value, onClick, win }) {
  return (
    <button onClick={onClick} className={`square ${win ? "win" : ""}`}>
      <p>{value}</p>
    </button>
  );
}

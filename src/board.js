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
    for (let j = 0; j < 9; j++) {
      console.log("check row", j);
      // console.log("check row + 1", i + 1);
      // console.log("check row + 2", i + 2);
      if (
        table[j] === table[j + 1] &&
        table[j] === table[j + 2] &&
        table[j] !== null
      ) {
        setWinCells([j, j + 1, j + 2]);
        return true;
      }
    }
    return false
  };

  const checkCol = () => {
    for (let i = 0; i < 3; i++) {
      if (
        table[i] === table[i + 3] &&
        table[i] === table[i + 6] &&
        table[i] !== null
      ) {
        setWinCells([i, i + 3, i + 6]);
        return true;
      }
    }
    return false;
  };

  const checkDiagonal = () => {
    const firstDiag =
      table[0] === table[4] && table[0] === table[8] && table[0] !== null;
    const secondDiag =
      table[2] === table[4] && table[2] === table[6] && table[2] !== null;

    if (firstDiag) {
      setWinCells([0, 4, 8]);
    }
    if (secondDiag) {
      setWinCells([2, 4, 6]);
    }
    return firstDiag || secondDiag;
  };

  const checkDraw = () => {
    return table.filter((cell) => cell !== null).length === 9;
  };

  const checkWin = () => {
    return checkRow() || checkCol() || checkDiagonal();
  };

  useEffect(() => {
    if (checkWin()) {
      setEndgame(true);
      setStatusMessage(`Match won by ${currentTurn === 1 ? "X" : "O"}`);
      return;
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

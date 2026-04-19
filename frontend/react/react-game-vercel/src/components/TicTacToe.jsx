import { useState, useEffect } from "react";
import { processInit, processRule, processBot } from "../js/gameRules";
import { useGlobalStore } from "../store/useGlobalStore";

const Square = ({ id, value, onClick }) => {
  return <>
    <div className="square" id={id} onClick={() => onClick(id)}>
      <span className="piece">{value}</span>
    </div>
  </>
}

export default function TicTacToe() {
  const [step, setStep] = [useGlobalStore(state => state.step), useGlobalStore(state => state.setStep)];
  const setGlobalPage = useGlobalStore(state => state.setGlobalPage);
  const setGameOver = useGlobalStore(state => state.setGameOver);
  const uuid = useGlobalStore(state => state.uuid);
  const level = useGlobalStore(state => state.level);
  const [board, setBoard] = useState({});
  const [role, setRole] = useState("");
  const [squareId, setSquareId] = useState("");

  useEffect(() => {
    initGame();
  }, [uuid])

  useEffect(() => {
    const result = processRule({ board, role, squareId });
    if (result) {
      if (result.isEnd) {
        if (result.role) {
          setGameOver({ msg: `${result.role}贏了！`, winner: result.role });
        } else {
          setGameOver({ msg: `和局！` });
        }
        setGlobalPage("GameOver");
      } else {
        if (result.role == "BOT") {
          handleBot();
        }
      }
    }

  }, [board]); // board 更新後執行

  const initGame = () => {
    setRole("");
    setSquareId("");
    processInit({ setBoard });
  }

  const handlePlayer = (id) => {
    setBoard(prev => {
      if (!prev[id]) {
        setRole("PLAYER");
        setSquareId(id);
        return { ...prev, [id]: "O" };
      } else {
        setRole("");
        setSquareId("");
        return prev;
      }
    });
    setStep(step + 1);
  }

  const handleBot = () => {
    setBoard(prev => {
      const id = processBot({ board: prev }, level);
      if (id) {
        setRole("BOT");
        setSquareId(id);
        return { ...prev, [id]: "X" };
      } else {
        setSquareId("");
        return prev;
      }
    });
  }

  return (
    <div className="board">
      {Object.entries(board).map(([id, val], index) => (
        <Square key={index} id={id} value={val} onClick={handlePlayer} />
      ))}
    </div>
  );
}
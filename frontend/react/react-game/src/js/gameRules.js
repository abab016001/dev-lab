import util from "./util";
import bot from "./bot";

let X = 3;

export const processRule = ({ board, role, squareId }) => {
  const rtn = { "isEnd": false, "role": null };

  const curId = parseInt(squareId.split("square_")[1]);
  if (isNaN(curId)) {
    return null;
  }

  const is_O_end = util.processEnd(board, "O", curId, X);
  const is_X_end = util.processEnd(board, "X", curId, X);
  switch (role) {
    case "PLAYER":
      if (is_O_end) {
        rtn.isEnd = true;
        rtn.role = "玩家";
        return rtn;
      }
      break;
    case "BOT":
      if (is_X_end) {
        rtn.isEnd = true;
        rtn.role = "電腦";
        return rtn;
      }
      break;
  }

  const no_active_ids = Object.keys(board).filter(_id => !board[_id]);
  if (!no_active_ids.length) {
    rtn.isEnd = true;
    rtn.role = null;
    return rtn;
  }

  if (role == "PLAYER") {
    rtn.isEnd = false;
    rtn.role = "BOT";
  }

  return rtn;
}

export const processInit = ({ setBoard }) => {
  const board = Object.fromEntries(
    Array.from({ length: 9 }, (_, index) => [`square_${index + 1}`, '']),
  )

  setBoard(board)
};

export const processBot = ({ board: prev }, level) => {
  switch (level) {
    case 1:
      return bot.level_1({ board: prev }, X);
    case 2:
      return bot.level_2({ board: prev }, X);
  }
};
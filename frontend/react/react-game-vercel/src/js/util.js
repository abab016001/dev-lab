let X = 3;

const getRow = (id) => {
  const [q, r] = [Math.floor(id / X), id % X];
  const row = q + (r > 0 ? 1 : 0)
  return row;
}

const getCol = (id) => {
  const [q, r] = [Math.floor(id / X), id % X];
  return r;
}

const getValue = (board, id) => board[`square_${id}`];

const processEnd = (board, val, curId, x = 3) => {
  X = x;

  const is_active_ids = Object.keys(board).filter(_id => board[_id] == val).map(x => x.split('square_')[1]);
  if (is_active_ids.length < X) {
    return false
  }

  const cur_row = getRow(curId);
  if (is_active_ids.map(_id => getRow(_id)).filter(id_row => id_row == cur_row).length >= X) {
    return true;
  }
  const cur_col = getCol(curId);
  if (is_active_ids.map(_id => getCol(_id)).filter(id_col => id_col == cur_col).length >= X) {
    return true;
  }

  const row_ary = Array(X).fill("").map((_, index) => index + 1);
  const lt_rb_ids = [];
  for (const r of row_ary) {
    const c = r;
    const val = X * (r - 1) + c;
    lt_rb_ids.push(val);
  }
  if (lt_rb_ids.every(id => board[`square_${id}`] == val)) {
    const _cols = lt_rb_ids.map(id => getCol(id));
    if (new Set(_cols).size == _cols.length) {
      return true;
    }
  }

  const col_ary = Array(X).fill("").map((_, index) => index + 1);
  const lb_rt_ids = [];
  for (const c of col_ary) {
    const r = X + 1 - c;
    const val = X * (r - 1) + c;
    lb_rt_ids.push(val);
  }
  if (lb_rt_ids.every(id => board[`square_${id}`] == val)) {
    const _rows = lb_rt_ids.map(id => getRow(id));
    if (new Set(_rows).size == _rows.length) {
      return true;
    }
  }

  return false;
}

export default { processEnd, getRow, getCol, getValue };
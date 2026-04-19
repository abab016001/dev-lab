import util from "./util";

const _getLT_RB = (x_ary, X) => {
  const _ids = [];
  for (let r of x_ary) {
    const c = r + 1;
    const val = (r * X) + c;
    _ids.push(val);
  }
  return _ids;
}

const _getRT_LB = (x_ary, X) => {
  const _ids = [];
  for (let r of x_ary) {
    const c = X - r;
    const val = (r * X) + c;
    _ids.push(val);
  }
  return _ids;
}

const _handleDefense = (o_ids, prev, X) => {
  const x_ary = Array(X).fill("").map((_, index) => index);
  let _ids = [];
  let empty = null;
  let ans = null;

  const _calc = (_ids) => {
    if (_ids.filter(x => util.getValue(prev, x) == "O").length > 1) {
      empty = _ids.find(_id => !prev[`square_${_id}`]);
      if (empty) {
        return `square_${empty}`;
      }
    }
    return null;
  }

  for (const o of o_ids) {
    /** 找尋橫線 */
    const _row = util.getRow(o);
    _ids = x_ary.map(_i => (_row - 1) * X + (_i + 1));
    ans = _calc(_ids);
    if (ans) {
      return ans;
    }

    /** 找尋直線 */
    const _col = util.getCol(o);
    _ids = x_ary.map(_i => _i * X + _col);
    ans = _calc(_ids);
    if (ans) {
      return ans;
    }
  }

  /** 找尋斜線 \ */
  _ids = _getLT_RB(x_ary, X);
  ans = _calc(_ids);
  if (ans) {
    return ans;
  }

  /** 找尋斜線 / */
  _ids = _getRT_LB(x_ary, X);
  ans = _calc(_ids);
  if (ans) {
    return ans;
  }

  return null;
}

const _handleAttack = (prev, X) => {
  const x_ary = Array(X).fill("").map((_, index) => index);
  let _ids = [];
  let empty = null;
  let ans = null;

  const _calc = (_ids) => {
    if (_ids.some(x => util.getValue(prev, x) == "O")) {
      return null;
    }
    empty = _ids.find(_id => !prev[`square_${_id}`]);
    if (empty) {
      return `square_${empty}`;
    }
    return null;
  }

  /** 找尋橫線 */
  for (let r of x_ary) {
    _ids = [];
    for (let c of x_ary) {
      const val = (r * X) + (c + 1);
      _ids.push(val);
    }
    ans = _calc(_ids);
    if (ans) {
      return ans;
    }
  }

  /** 找尋直線 */
  for (let c of x_ary) {
    _ids = [];
    for (let r of x_ary) {
      const val = (r * X) + (c + 1);
      _ids.push(val);
    }
    ans = _calc(_ids);
    if (ans) {
      return ans;
    }
  }

  /** 找尋斜線 \ */
  _ids = _getLT_RB(x_ary, X);
  ans = _calc(_ids);
  if (ans) {
    return ans;
  }

  /** 找尋斜線 / */
  _ids = _getRT_LB(x_ary, X);
  ans = _calc(_ids);
  if (ans) {
    return ans;
  }

  return null;
}

const _handleIsFin = (prev, X) => {
  const x_ary = Array(X).fill("").map((_, index) => index);
  let _ids = [];
  let empty = null;
  let ans = null;

  const _calc = (_ids) => {
    if (_ids.some(x => util.getValue(prev, x) == "O")) {
      return null;
    }
    if (_ids.filter(x => util.getValue(prev, x) == "X").length > 1) {
      empty = _ids.find(x => !util.getValue(prev, x));
      if (empty) {
        return `square_${empty}`;
      }
    }

    return null;
  }

  /** 找尋橫線 */
  for (let r of x_ary) {
    _ids = [];
    for (let c of x_ary) {
      const val = (r * X) + (c + 1);
      _ids.push(val);
    }
    ans = _calc(_ids);
    if (ans) {
      return ans;
    }
  }

  /** 找尋直線 */
  for (let c of x_ary) {
    _ids = [];
    for (let r of x_ary) {
      const val = (r * X) + (c + 1);
      _ids.push(val);
    }
    ans = _calc(_ids);
    if (ans) {
      return ans;
    }
  }

  /** 找尋斜線 \ */
  _ids = _getLT_RB(x_ary, X);
  ans = _calc(_ids);
  if (ans) {
    return ans;
  }

  /** 找尋斜線 / */
  _ids = _getRT_LB(x_ary, X);
  ans = _calc(_ids);
  if (ans) {
    return ans;
  }

  return null;
}

/** LEVEL 1 */

const level_1 = ({ board: prev }, X) => {
  const no_active_ids = Object.keys(prev).filter(_id => !prev[_id]);
  const randomIndex = Math.floor(Math.random() * no_active_ids.length);
  const id = no_active_ids[randomIndex];

  return id;
}

/** LEVEL 2 */
const level_2 = ({ board: prev }, X) => {
  const x_ids = Object.keys(prev).filter(key => prev[key] == "X").map(key => key.split(`square_`)[1]);
  const o_ids = Object.keys(prev).filter(key => prev[key] == "O").map(key => key.split(`square_`)[1]);

  if (o_ids.length <= 1) {
    return level_1({ board: prev }, X); // 遊戲剛開始，可以隨機下
  }

  const fin = _handleIsFin(prev, X);
  if (fin) {
    return fin;
  }

  const defense = _handleDefense(o_ids, prev, X);
  if (defense) {
    return defense;
  }

  if (x_ids.length < 1) {
    return level_1({ board: prev }, X); // 遊戲剛開始，可以隨機下
  }

  const attack = _handleAttack(prev, X);
  if (attack) {
    return attack;
  }

  return level_1({ board: prev }, X);;
}

export default { level_1, level_2 }
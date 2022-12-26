import * as dom from './dom';
import { GAME_ATTEMPTS, winningConditions } from './game_options';

let isDraw = false;
let isGameOver = false;
let attempts = GAME_ATTEMPTS;
let resultData = winningConditions;

dom.start.onclick = e => {
  dom.table.style.pointerEvents = 'all';
  dom.reset.style.pointerEvents = 'all';
  dom.newGame.style.pointerEvents = 'all';
  definePlayers();
  randomPlayer();
  e.target.style.visibility = 'hidden';
};
dom.reset.onclick = () => {
  window.location.reload();
};
dom.newGame.onclick = () => {
  attempts = GAME_ATTEMPTS;
  isGameOver = false;
  randomPlayer();
  resultData = winningConditions;
  dom.table.style.pointerEvents = 'all';
  [...dom.tds].forEach(td => {
    td.innerHTML = '';
    td.className = '#';
    td.style.pointerEvents = 'all';
  });
  [...dom.labels].forEach(label => {
    label.innerHTML = label.dataset.text;
    label.className = '#';
  });
};
[...dom.tds].forEach(td => {
  td.addEventListener('click', () => {
    attempts--;
    td.style.pointerEvents = 'none';
    td.innerHTML = `${activePlayerValue()}`;
    resultData = refreshResultData(td);
    checkResult(resultData);
    if (attempts) {
      nextTurn();
    } else {
      if (!isGameOver && isDraw) {
        winnerSet().draw();
        winnerSet().msg();
      }
    }
  });
});
function randomPlayer() {
  const choise = [dom.playerX, dom.playerO];
  const randomPlayer1 = Math.floor(Math.random() * choise.length);
  const randomPlayer2 = randomPlayer1 === 0 ? 1 : 0;
  choise[randomPlayer1].classList.add('active');
  choise[randomPlayer2].classList.remove('active');
}
function nextTurn() {
  if (!isGameOver) {
    [dom.playerX, dom.playerO].forEach(player => {
      player.classList.toggle('active');
    });
  }
}
function activePlayerValue() {
  return [dom.playerO, dom.playerX].find(player =>
    player.classList.contains('active')
  ).dataset.player;
}
function crossedLineClass(idx) {
  idx = idx.toString();
  if (idx === '0' || idx === '1' || idx === '2') {
    return 'crossedHorizontal';
  }
  if (idx === '3' || idx === '4' || idx === '5') {
    return 'crossedVertical';
  }
  if (idx === '6') {
    return 'crossedLeft';
  }
  if (idx === '7') {
    return 'crossedRight';
  }
  return;
}
function refreshResultData(td) {
  return resultData.map(data =>
    data.map(value => {
      if (value === td.dataset.cell) {
        value = activePlayerValue();
      }
      return value;
    })
  );
}
function checkResult(resultData) {
  resultData.map((data, idx) => {
    if (data.join('') === 'XXX' || data.join('') === 'OOO') {
      isGameOver = true;
      isDraw = true;
      [...dom.tds].forEach(td => {
        td.style.pointerEvents = 'none';
      });
      winnerSet(data).crossedLine(idx);
      winnerSet(data).msg();
    }
    return false;
  });
}
function winnerSet(data) {
  const winner = new Set(data).values().next().value;
  [dom.playerX, dom.playerO].forEach(player => {
    player.classList.remove('active');
  });
  return {
    msg: function () {
      [...dom.labels].forEach(label => {
        if (label.innerHTML[0] === winner) {
          label.innerHTML = 'You are Winner 🏆!';
          label.classList.add('select');
          winner === 'X' ? this.winnerX() : this.winnerO();
        }
        if (!winner) {
          label.innerHTML = 'Draw ✌';
          label.classList.add('select');
        }
      });
    },
    crossedLine: idx =>
      winningConditions[idx].forEach(win => {
        [...dom.tds].forEach(td => {
          if (td.dataset.cell === win) {
            td.classList.add(crossedLineClass(idx));
          }
        });
        return winningConditions[idx];
      }),
    winnerX: function () {
      dom.scorePlayerX.innerHTML = Number(dom.scorePlayerX.innerHTML) + 1;
    },
    winnerO: function () {
      dom.scorePlayerO.innerHTML = Number(dom.scorePlayerO.innerHTML) + 1;
    },
    draw: function () {
      this.winnerX();
      this.winnerO();
    }
  };
}
function definePlayers() {
  if (dom.playerX.value === '' && dom.playerO.value === '') {
    dom.playerX.value = 'Player_1';
    dom.playerO.value = 'Player_2';
  }
  if (dom.playerX.value === '' || dom.playerO.value === '') {
    [dom.playerO, dom.playerX].forEach(player => {
      player.value = player.value === '' ? 'Player_2' : player.value;
    });
  }
}

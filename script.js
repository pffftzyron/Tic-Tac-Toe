(() => {
const cells = Array.from(document.querySelectorAll('.cell'));
const turnElem = document.getElementById('turn');
const statusElem = document.getElementById('status');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreDraw = document.getElementById('scoreDraw');
const restartBtn = document.getElementById('restart');
const resetScoresBtn = document.getElementById('resetScores');
const modeRadios = Array.from(document.querySelectorAll('input[name="mode"]'));

let board = Array(9).fill(null);
let current = 'X';
let scores = {X:0, O:0, D:0};
let playing = true;

const WINNING = [
[0,1,2],[3,4,5],[6,7,8],
[0,3,6],[1,4,7],[2,5,8],
[0,4,8],[2,4,6]
];

function updateUI(){
cells.forEach((cell,i)=>{
cell.textContent = board[i] || '';
cell.disabled = !!board[i] || !playing;
});
turnElem.textContent = current;
}

function checkWinner(){
for(const [a,b,c] of WINNING){
if(board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
}
if(board.every(Boolean)) return 'D';
return null;
}

function endRound(result){
playing = false;
if(result === 'D'){
statusElem.textContent = 'Draw!';
scores.D++;
scoreDraw.textContent = scores.D;
} else {
statusElem.textContent = `Player ${result} wins!`;
scores[result]++;
if(result === 'X') scoreX.textContent = scores.X; else scoreO.textContent = scores.O;
}
}

function cpuMove(){
const empties = board.map((v,i)=> v ? null : i).filter(Number.isInteger);
if(!empties.length) return;
const idx = empties[Math.floor(Math.random()*empties.length)];
makeMove(idx);
}

function makeMove(index){
if(board[index] || !playing) return;
board[index] = current;
const winner = checkWinner();
if(winner){
updateUI();
endRound(winner);
return;
}
current = current === 'X' ? 'O' : 'X';
updateUI();

const mode = document.querySelector('input[name="mode"]:checked').value;
if(mode === 'cpu' && current === 'O' && playing){
setTimeout(cpuMove, 300 + Math.random()*400);
}
}

cells.forEach((cell,i)=>{
cell.addEventListener('click', ()=>{
makeMove(i);
});
});

restartBtn.addEventListener('click', ()=>{
board.fill(null);
current = 'X';
playing = true;
statusElem.textContent = 'Turn: ';
updateUI();
});

resetScoresBtn.addEventListener('click', ()=>{
scores = {X:0,O:0,D:0};
scoreX.textContent = '0'; scoreO.textContent = '0'; scoreDraw.textContent = '0';
});

modeRadios.forEach(r => r.addEventListener('change', ()=>{
restartBtn.click();
}));

updateUI();
})();
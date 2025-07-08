var seconds = 0;
var isTimerRunning = false;
var timerInterval = null;

window.addEventListener('DOMContentLoaded', function () {
   var filas = 8;
   var columnas = 8;
   var cellSize = 40;
   var gap = 2;

   var container = document.querySelector('.container');
   var grid = document.querySelector('.grid');
   var timerDisplay = document.querySelector('.timerGame');

   var gridWidth = columnas * cellSize + (columnas - 1) * gap;
   var gridHeight = filas * cellSize + (filas - 1) * gap;

   grid.style.width = gridWidth + 'px';
   grid.style.height = gridHeight + 'px';
   container.style.width = gridWidth + 'px';

   for (var i = 1; i <= filas * columnas; i++) {
      var cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = 'cell-' + i;
      cell.textContent = i;
      grid.appendChild(cell);
   }
   clearRanking();

   startTimer(timerDisplay);

   var nombreJugador = "Lucas";
   saveResult(nombreJugador, calculateScore(), getDuration());
   var nombreJugador = "Pepe";
   saveResult(nombreJugador, calculateScore(), getDuration());
   var nombreJugador = "Ricardo";
   saveResult(nombreJugador, calculateScore(), getDuration());


   var modal = document.getElementById("rankingModal");
   var btn = document.getElementById("openBtn");
   var span = document.getElementsByClassName("close")[0];

   btn.onclick = function () {
      renderRanking();
      modal.style.display = "block";
   };

   span.onclick = function () {
      modal.style.display = "none";
   };

   window.onclick = function (event) {
      if (event.target === modal) {
         modal.style.display = "none";
      }
   };


});

function startTimer(timerDisplay) {
   if (isTimerRunning) return;
   isTimerRunning = true;
   timerInterval = setInterval(function () {
      seconds++;
      timerDisplay.textContent = formatTime(seconds);
   }, 1000);
}


function formatTime(totalSeconds) {
   var mins = Math.floor(totalSeconds / 60);
   var secs = totalSeconds % 60;
   var minStr = (mins < 10 ? '0' : '') + mins;
   var secStr = (secs < 10 ? '0' : '') + secs;
   return minStr + ':' + secStr;
}

function stopTimer() {
   clearInterval(timerInterval);
   isTimerRunning = false;
}

function resetTimer(timerDisplay) {
   clearInterval(timerInterval);
   seconds = 0;
   isTimerRunning = false;
   timerDisplay.textContent = "00:00";
}


function validateName(name) {
   return /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,}$/.test(name.trim());
}

var totalMines = 10;
var flagsPlaced = 0;

function updateMineCounter() {
   var remaining = totalMines - flagsPlaced;
   document.getElementById("mine-counter").textContent = remaining;
}


function showError(message) {
   var err = document.getElementById("errorMsg");
   err.textContent = message;
   err.style.display = "block";
   setTimeout(function () {
      err.style.display = "none";
   }, 3000);
}

function saveResult(playerName, score, duration) {
   var results = JSON.parse(localStorage.getItem("minesweeperResults")) || [];

   var newResult = {
      player: playerName,
      score: score,
      duration: duration,
      date: new Date().toLocaleString()
   };

   results.push(newResult);
   localStorage.setItem("minesweeperResults", JSON.stringify(results));
   console.log("Resultado guardado:", newResult);
}

function renderRanking() {
   var results = JSON.parse(localStorage.getItem("minesweeperResults")) || [];

   results.sort(function (a, b) {
      return b.score - a.score;
   });

   var rankingBody = document.getElementById("rankingBody");
   rankingBody.innerHTML = "";

   for (var i = 0; i < results.length; i++) {
      var r = results[i];
      var row = document.createElement("tr");
      row.innerHTML =
         "<td>" + r.player + "</td>" +
         "<td>" + r.score + "</td>" +
         "<td>" + r.duration + "</td>" +
         "<td>" + r.date + "</td>";
      rankingBody.appendChild(row);
   }
}


var modal = document.getElementById("rankingModal");
var btn = document.getElementById("openBtn");
var span = document.getElementsByClassName("close")[0];


btn.onclick = function () {
   renderRanking();
   modal.style.display = "block";
};


span.onclick = function () {
   modal.style.display = "none";
};


window.onclick = function (event) {
   if (event.target === modal) {
      modal.style.display = "none";
   }
};

function sortResults(results, sortBy) {
   if (sortBy === 'score') {
      results.sort(function (a, b) {
         return b.score - a.score;
      });
   } else if (sortBy === 'date') {
      results.sort(function (a, b) {
         return new Date(b.date) - new Date(a.date);
      });
   }
}

function calculateScore() {
   return Math.max(1000 - seconds, 0);
}

function getDuration() {
   return formatTime(seconds);
}

function clearRanking() {
   localStorage.removeItem("minesweeperResults");
   renderRanking();
   console.log("Ranking eliminado.");
}
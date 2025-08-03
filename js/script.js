"use strict";
var seconds = 0;
var isTimerRunning = false;
var timerInterval = null;
var toast;
var timeoutId;
var currentPlayerName = "";
var totalMines = 10;
var flagsPlaced = 0;
var revealedCount = 0;
var juegoFinalizado = false;

var filas = 8;
var columnas = 8;
var cellSize = 40;
var gap = 2;
var timerDisplay = document.querySelector('.timerGame');
var dificultad = document.getElementById('dificultad');
var loseSound = new Audio("audio/Perder.mp3");
var winSound = new Audio("audio/Ganar.mp3");


window.addEventListener('DOMContentLoaded', function () {
   showStartModal();
   initContactModal();
   initRanking();
   initChangeThemeButton();
   
   dificultad.addEventListener("change", function () {
      if (dificultad.value == 'facil'){
         filas = 8;
         columnas = 8;
         totalMines = 10;
         reiniciarJuego();
      }else if (dificultad.value == 'medio') {
         filas = 12;
         columnas = 12;
         totalMines = 25;
         reiniciarJuego();
      } else if(dificultad.value == 'dificil'){
         filas = 16;
         columnas = 16;
         totalMines = 40;
         reiniciarJuego();
      }
   })
   var resetBtn = document.querySelector('.resetGameButton');
   resetBtn.addEventListener('click', reiniciarJuego);
   inicializarTablero(filas, columnas, cellSize, gap);
});


//GAME LOGIC
function inicializarTablero(filas, columnas, cellSize, gap) {
   posicionMinas = generaMinas(columnas, filas);
   var grid = document.querySelector('.grid');
   var container = document.querySelector('.container');
   grid.innerHTML = '';

   var gridWidth = columnas * cellSize + (columnas - 1) * gap;
   var gridHeight = filas * cellSize + (filas - 1) * gap;

   grid.style.width = gridWidth + 'px';
   grid.style.height = gridHeight + 'px';
   container.style.width = gridWidth + 'px';

   for (var i = 1; i <= filas * columnas; i++) {
      var cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = 'cell-' + i;
      grid.appendChild(cell);

      (function (c, r) {
         c.addEventListener("click", function () {
            if (juegoFinalizado) return;
            if (posicionMinas.indexOf(r) !== -1) {
               c.className = 'cell-mine';
               c.style.backgroundImage = 'url("img/mine.jpeg")';
               c.style.backgroundSize = 'cover';
               c.style.backgroundPosition = 'center';
               stopTimer();
               juegoFinalizado = true;
               setEmoji('😵');
               for (var index = 0; index < posicionMinas.length; index++) {
                  var aux = document.getElementById("cell-"+posicionMinas[index]);
                  aux.className = 'cell-mine';
                  aux.style.backgroundImage = 'url("img/mine.jpeg")';
                  aux.style.backgroundSize = 'cover';
                  aux.style.backgroundPosition = 'center';
               } //Muestra las minas
               loseSound.play();
               showEndModal("loseModal");
               saveResult(currentPlayerName, calculateScore(), formatTime(seconds));
            } else {
               startTimer(timerDisplay);
               revelarZonaLibre(r, posicionMinas, []);
            }
         });

         c.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            if (juegoFinalizado) return;
            if (c.classList[0] !== "cell-reveal" && c.classList[0] !== "cell-mine") {
            if (c.querySelector('.flag')) {
                  c.innerHTML = "";
                  flagsPlaced--;
                  } else {
                  c.innerHTML = '<span class="flag">🚩</span>';
                  flagsPlaced++;
                  }
               updateMineCounter();
            }
         });
      })(cell, i);
   }
}


function updateMineCounter() {
   var remaining = totalMines - flagsPlaced;
   document.getElementById("mine-counter").textContent = remaining;
}

function saveResult(playerName, score, duration) {
   var results = JSON.parse(localStorage.getItem("minesweeperResults")) || [];

   var newResult = {
      player: playerName,
      score: score,
      duration: duration,
      date: new Date().toISOString() 
   };

   results.push(newResult);
   localStorage.setItem("minesweeperResults", JSON.stringify(results));
   console.log("Resultado guardado:", newResult);
}

function calculateScore() {
  return Math.max(1000 - seconds, 0); 
}

function generaMinas(columnas, filas) {
   var min = 1
   var max = (columnas * filas)

   var arrayMinas = [];
   var aux = 0

   for (var index = 0; index < totalMines; index++) {

      aux = numeroAleatorio(min, max);
      while (arrayMinas.indexOf(aux) !== -1) {
         aux = numeroAleatorio(min, max);
      }
      arrayMinas[index] = aux; 
      
   }
   return arrayMinas;

}

function numeroAleatorio(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}

function contarMinasAlrededor(celda, minas){
   var cMinas = 0
   var perimetro = validarPerimetro(celda,filas);
   for (var index = 0; index < perimetro.length; index++) {
      if (minas.indexOf(perimetro[index]) !== -1 && perimetro[index] > 0){
         cMinas++;
      }
   }
   if (cMinas == 0) {
      cMinas = '';
   }
   return [cMinas, perimetro];
}

function validarPerimetro(celda, filas){
   var f = Math.trunc((celda/filas)-0.01)+1;
   var c = '';
   for (let i = 0; i < filas+1; i++) {
      if ((filas*f-filas+1+i) == celda) {
         c = i;
         c++
      }
   }
     if(c== 1 && f == 1){
         var perimetro = [celda+1, celda+filas, (celda+1)+filas];
     } else if(c == 1 && f == filas){
         var perimetro = [celda+1, celda-filas, (celda-1)+filas];
     } else if (c == filas && f == 1) {
         var perimetro = [celda-1, celda+filas, (celda-1)+filas];
     } else if(c == filas && f == filas){
         var perimetro = [celda-1, celda-filas, (celda-1)-filas];
     } else if (c==1){
         var perimetro = [celda+1, celda-filas, (celda-filas)+1, celda+filas, (celda+filas)+1];
     } else if(c== filas){
         var perimetro = [celda-1, celda-filas, (celda-filas)-1, celda+filas, (celda+filas)-1]
     } else if (f== 1){
         var perimetro = [celda-1, celda+1, (celda+1)+filas, (celda-1)+filas, celda+filas]
     } else if (f== filas) {
         var perimetro = [celda-filas, celda-1, celda+1, (celda+1)-filas, (celda-1)-filas]
     }else{
      var perimetro = [celda+filas, celda-filas, celda-1, celda+1, (celda+1)+ filas, (celda+1)- filas, (celda-1)+ filas, (celda-1)- filas];
   }
   return perimetro;
}

function revelarZonaLibre(celdaId, minas, yaReveladas) {
   if (yaReveladas.indexOf(celdaId) !== -1) return; 
   yaReveladas.push(celdaId);

   var celda = document.getElementById("cell-" + celdaId);
   if (!celda || celda.classList.contains("cell-reveal")) return;

   celda.classList.add("cell-reveal");
   revealedCount++;

   var resultado = contarMinasAlrededor(celdaId, minas);
   var cantidad = resultado[0];
   var vecinos = resultado[1];

   celda.classList.remove(
   "num-1", "num-2", "num-3", "num-4", "num-5", "num-6", "num-7", "num-8"
   );

   if (cantidad !== '') {
      celda.classList.add("num-" + cantidad);
      celda.innerHTML = cantidad;
   } else {
      celda.innerHTML = '&nbsp;';
   }

   checkWinCondition();

   if (cantidad === '') {
      for (var i = 0; i < vecinos.length; i++) {
         revelarZonaLibre(vecinos[i], minas, yaReveladas);
      }
   }
}

function checkWinCondition() {
   var totalCells = filas * filas; // Generalizar!!!
   var safeCells = totalCells - totalMines;
   if (revealedCount >= safeCells || flagsPlaced == totalMines) {
      stopTimer();
      winSound.play();
      showEndModal("winModal");
      setEmoji('😎');
      juegoFinalizado = true;
      saveResult(currentPlayerName, calculateScore(), getDuration());
   }
}

function reiniciarJuego() {
   revealedCount = 0;
   flagsPlaced = 0;
   juegoFinalizado = false;
   seconds = 0;
   updateMineCounter();
   resetTimer(timerDisplay);
   inicializarTablero(filas, columnas, cellSize, gap);
   setEmoji('😄');
}

function setEmoji(codigoEmoji) {
   var emoji = document.getElementById('emoji');
   if (emoji) {
      emoji.textContent = codigoEmoji;
   }
}

// END GAME LOGIC

// START TIMER LOGIC

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

// END TIMER LOGIC

// START RANKING LOGIC
function initRanking(){
   var modal = document.getElementById("rankingModal");
   var btn = document.getElementById("openBtn");
   var spanRankingClose = document.querySelector("#rankingModal .close");

   var ordenarRankingSelect = document.getElementById('ordenarRanking');

   ordenarRankingSelect.addEventListener('change', function () {
      renderRanking(this.value); // llama con 'score' o 'date'
   });

   btn.onclick = function () {
      var criterio = ordenarRankingSelect.value || 'score';
      renderRanking(criterio);
      modal.style.display = "block";
   };

   spanRankingClose.onclick = function () {
      modal.style.display = "none";
   };
}

function renderRanking(sortBy = 'score') {
  var results = JSON.parse(localStorage.getItem("minesweeperResults")) || [];

  sortResults(results, sortBy);

  var rankingBody = document.getElementById("rankingBody");
  rankingBody.innerHTML = "";

  for (var i = 0; i < results.length; i++) {
    var r = results[i];
    var row = document.createElement("tr");
    row.innerHTML =
      "<td>" + r.player + "</td>" +
      "<td>" + r.score + "</td>" +
      "<td>" + r.duration + "</td>" +
      "<td>" + new Date(r.date).toLocaleString() + "</td>";
    rankingBody.appendChild(row);
  }
}

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

// END RANKING LOGIc

// EXTRAS

function showStartModal() {
   var startModal = document.getElementById("startModal");
   var playerNameInput = document.getElementById("playerNameInput");
   var startGameButton = document.getElementById("startGameBtn");
   var nameError = document.getElementById("nameError");

   startModal.style.display = "block";

   startGameButton.addEventListener("click", function () {
      var name = playerNameInput.value.trim();
      if (/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{3,}$/.test(name.trim())) {
         currentPlayerName = name;
         startModal.style.display = "none";
         // acá poner función para arrancar el juego
      } else {
         nameError.style.display = "block";
      }
   });

   playerNameInput.addEventListener("input", function () {
      nameError.style.display = "none";
   });
}

function initChangeThemeButton() {
  var boton = document.getElementById('toggleTheme');
  var temaActual = localStorage.getItem('theme');
  var prefiereOscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (temaActual === 'dark' || (!temaActual && prefiereOscuro)) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  boton.onclick = () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  };
}

function showEndModal(modalId) {
   var modal = document.getElementById(modalId);
   var closeButton = modal.querySelector("button");

   modal.style.display = "block";

   function handleClick() {
      modal.style.display = "none";
      closeButton.removeEventListener("click", handleClick);
   }

   closeButton.addEventListener("click", handleClick);
}

function initContactModal() {
   var contactModal = document.getElementById("contactModal");
   var openContactBtn = document.getElementById("openContactBtn");
   var closeContactBtn = document.getElementById("closeContact");
   var contactForm = document.getElementById("contactForm");

   openContactBtn.addEventListener("click", function () {
      contactModal.style.display = "block";
   });

   closeContactBtn.addEventListener("click", function () {
      contactModal.style.display = "none";
   });

   contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("contactName").value.trim();
      var email = document.getElementById("contactEmail").value.trim();
      var message = document.getElementById("contactMessage").value.trim();

      let valid = true;

      if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s]+$/.test(name)) {
         document.getElementById("contactNameError").style.display = "block";
         valid = false;
      } else {
         document.getElementById("contactNameError").style.display = "none";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         document.getElementById("contactEmailError").style.display = "block";
         valid = false;
      } else {
         document.getElementById("contactEmailError").style.display = "none";
      }

      if (message.length <= 5) {
         document.getElementById("contactMessageError").style.display = "block";
         valid = false;
      } else {
         document.getElementById("contactMessageError").style.display = "none";
      }

      if (valid) {
         var mailto = "mailto:tuemail@ejemplo.com"
            + "?subject=Contacto de " + encodeURIComponent(name)
            + "&body=" + encodeURIComponent(message + "\n\nEmail: " + email);
         window.location.href = mailto;
      }
   });
}
var seconds = 0;
var isTimerRunning = false;
var timerInterval = null;
var toast;
var timeoutId;

// REVISAR ESTO 
var totalMines = 10;
var flagsPlaced = 0;
var revealedCount = 0;
var juegoFinalizado = false;

window.addEventListener('DOMContentLoaded', function () {
   var filas = 8;
   var columnas = 8;
   var cellSize = 40;
   var gap = 2;
   var posicionMinas = [];

   var resetBtn = document.querySelector('.resetGameButton');
   resetBtn.addEventListener('click', reiniciarJuego);

   inicializarTablero(filas, columnas, cellSize, gap);
   
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


   toast = document.getElementById("toast");
   showError("Aca van los mensajes de errores");

});

var boton = document.getElementById("cell-1");

boton.addEventListener("click", function () {
  alert("¡Click detectado en celda 1!");
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


function updateMineCounter() {
   var remaining = totalMines - flagsPlaced;
   document.getElementById("mine-counter").textContent = remaining;
}


function showError(message) {
   if (!toast) return;

   toast.innerHTML = '<span class="cerrar">×</span> ' + message;

   var cerrarBtn = toast.querySelector(".cerrar");
   cerrarBtn.addEventListener("click", cerrarToast);

   toast.classList.add("mostrar");

   clearTimeout(timeoutId);
   timeoutId = setTimeout(function () {
      toast.classList.remove("mostrar");
   }, 5000);
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

function mostrarToast() {
   toast.classList.add("mostrar");
   clearTimeout(timeoutId);
   timeoutId = setTimeout(function () {
      toast.classList.remove("mostrar");
   }, 6000);
}

function cerrarToast() {
   toast.classList.remove("mostrar");
   clearTimeout(timeoutId);
}

function generaMinas(columnas, filas) {
   //Hay que agregar las condiciones por si cambia el tamaño cambia la cantidad de  minas
   if (columnas == 8 && filas == 8) {
      var minas = 10;
   }
   var min = 1
   var max = (columnas * filas)

   var arrayMinas = [];
   var aux = 0

   for (var index = 0; index < minas; index++) {

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

if (miArray.indexOf(valor) !== -1) {
  // El valor está en el arreglo
}

function contarMinasAlrededor(celda, minas){
   var cMinas = 0
   var perimetro = validarPerimetro(celda,8);
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
   var celdasPerimetrales = []
   for (var index = 0; index < filas; index++) {
      if (index != 0) {
         celdasPerimetrales.push(index);
         celdasPerimetrales.push(index*filas);
         celdasPerimetrales.push(index*filas+1)
      }
      celdasPerimetrales.push((filas*filas)-index);
   }
   var aux = celda/filas
   if (celdasPerimetrales.indexOf(celda)!== -1) {
      if (celda/filas == filas){
         var perimetro = [celda-8, celda-1, celda+1, (celda+1)- 8, (celda-1)- 8]
      } else if (celda/filas > filas-1) {
         var perimetro = [celda-8, celda-1, (celda-1)- 8, celda+1, (celda+1)-8]
      } else if ((celda/filas > 1 && celda/filas < filas-1 && celda/filas % 2 === 0) || celda/filas == filas-1){
         var perimetro = [celda-8, celda-1, celda+8, (celda-1)+ 8, (celda-1)- 8]
      } else if (celda/filas > 1 && celda/filas < filas-1 && celda/filas % 2 !== 0){
         var perimetro = [celda+8, celda+1, (celda+1)+ 8, (celda+1)- 8, celda-8];
      } else if (celda/filas < 1 && celda/filas < celda-1){
         var perimetro = [celda+8, celda-1, celda+1, (celda+1)+ 8, (celda-1)+ 8];
      }else if (celda == filas) {
         var perimetro = [celda+8, celda-1, (celda-1)+ 8]
      } else if (celda == 1) {
         var perimetro = [celda+8, celda+1, (celda+1)+ 8]
      } 
   }else{
      var perimetro = [celda+8, celda-8, celda-1, celda+1, (celda+1)+ 8, (celda+1)- 8, (celda-1)+ 8, (celda-1)- 8];
   }
   return perimetro;
}

//Funcion que revela minas vacias y adyasentes.
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
   var totalCells = 8 * 8; // Generalizar!!!
   var safeCells = totalCells - totalMines;
   if (revealedCount >= safeCells) {
      stopTimer();
      showError("¡Victoria! Has ganado el juego 🎉");
      setEmoji('😎');
      juegoFinalizado = true;
   }
}

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
      cell.textContent = i;
      grid.appendChild(cell);

      (function (c, r) {
         c.addEventListener("click", function () {
            if (juegoFinalizado) return;
            if (posicionMinas.indexOf(r) !== -1) {
               c.className = 'cell-mine';
               c.textContent = '&nbsp;';
               c.style.backgroundImage = 'url("img/mine.jpeg")';
               c.style.backgroundSize = 'cover';
               c.style.backgroundPosition = 'center';
               stopTimer();
               juegoFinalizado = true;
               setEmoji('😵');
            } else {
               revelarZonaLibre(r, posicionMinas, []);
            }
         });

         c.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            if (juegoFinalizado) return;
            if (flagsPlaced < totalMines && c.classList[0] !== "cell-reveal" && c.classList[0] !== "cell-mine") {
               if (c.textContent === "🚩") {
                  c.textContent = r;
                  flagsPlaced--;
               } else {
                  c.innerHTML = "🚩";
                  flagsPlaced++;
               }
               updateMineCounter();
            }
         });
      })(cell, i);
   }
}

function reiniciarJuego() {
   revealedCount = 0;
   flagsPlaced = 0;
   juegoFinalizado = false;
   seconds = 0;

   updateMineCounter();

   var timerDisplay = document.querySelector('.timerGame');
   resetTimer(timerDisplay);
   startTimer(timerDisplay);

   inicializarTablero(8, 8, 40, 2);
   setEmoji('😄');
}

function setEmoji(codigoEmoji) {
   var emoji = document.getElementById('emoji');
   if (emoji) {
      emoji.textContent = codigoEmoji;
   }
}
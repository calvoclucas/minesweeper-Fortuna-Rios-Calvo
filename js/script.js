var seconds = 0;
var isTimerRunning = false;
var timerInterval = null;
var toast;
var timeoutId;


window.addEventListener('DOMContentLoaded', function () {
   var filas = 8;
   var columnas = 8;
   var cellSize = 40;
   var gap = 2;
   var posicionMinas = [];

   posicionMinas = generaMinas(columnas,filas);

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
      //Este es la funcion que escucha los clicks
      (function (c) {
         c.addEventListener("click", function () {
            var partes = c.id.split("-");
            var r = parseInt(partes[1], 10);
            if (posicionMinas.indexOf(r) !== -1) {
               //alert("Hay una mina en " + r);
               c.className = 'cell-mine';
               c.textContent = ''; // Borra el texto
               c.style.backgroundImage = 'url("img/mine.jpeg")';
               c.style.backgroundSize = 'cover';
               c.style.backgroundPosition = 'center';
            }else{
               c.className = 'cell-reveal';
               c.textContent = contarMinasAlrededor(r, posicionMinas);
               
            }
         });
      })(cell);
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

// REVISAR ESTO 
var totalMines = 10;
var flagsPlaced = 0;

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
   var min = 0
   var max = (columnas * filas)-1

   var arrayMinas = [];
   var aux = 0

   for (var index = 0; index < minas; index++) {

      aux = numeroAleatorio(min, max);
      while (arrayMinas.indexOf(aux) !== -1) {
         aux = numeroAleatorio(min, max);
      }
      arrayMinas[index] = aux; 
      
   }
   //Borrar
   console.log("Minas generadas");
   console.log(arrayMinas);
   //
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
   var perimetro = [celda+8, celda-8, celda-1, celda+1, (celda+1)+ 8, (celda+1)- 8, (celda-1)+ 8, (celda-1)- 8]
   //Borrar
   console.log(perimetro)

   for (let index = 0; index < perimetro.length; index++) {
      if (minas.indexOf(perimetro[index]) !== -1){
         cMinas++;
      }
   }
   return cMinas;
}
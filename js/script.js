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


window.addEventListener('DOMContentLoaded', function () {
   showStartModal();
   initContactModal();
   
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

   var posicionMinas = [];

   var resetBtn = document.querySelector('.resetGameButton');
   resetBtn.addEventListener('click', reiniciarJuego);

   inicializarTablero(filas, columnas, cellSize, gap);
   
   clearRanking();

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

function showStartModal() {
   startModal = document.getElementById("startModal");
   playerNameInput = document.getElementById("playerNameInput");
   startGameButton = document.getElementById("startGameBtn");
   nameError = document.getElementById("nameError");
   startModal.style.display = "block";
   startGameButton.addEventListener("click", function () {
      var name = playerNameInput.value.trim();
      if (validateName(name)) {
         currentPlayerName = name;
         startModal.style.display = "none";
         //aca poner funcion para arrancar el juego
      } else {
         nameError.style.display = "block";
      }
   });
   playerNameInput.addEventListener("input", function () {
      nameError.style.display = "none";
   });
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
   var contactModal = document.getElementById("contact-modal");
   var openContactBtn = document.getElementById("open-contact-btn");
   var closeContactBtn = document.getElementById("close-contact");
   var contactForm = document.getElementById("contact-form");

   openContactBtn.addEventListener("click", function () {
      contactModal.style.display = "block";
   });

   closeContactBtn.addEventListener("click", function () {
      contactModal.style.display = "none";
   });

   contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = document.getElementById("contact-name").value.trim();
      var email = document.getElementById("contact-email").value.trim();
      var message = document.getElementById("contact-message").value.trim();

      var valid = true;

      if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9\s]+$/.test(name)) {
         document.getElementById("contact-name-error").style.display = "block";
         valid = false;
      } else {
         document.getElementById("contact-name-error").style.display = "none";
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         document.getElementById("contact-email-error").style.display = "block";
         valid = false;
      } else {
         document.getElementById("contact-email-error").style.display = "none";
      }

      if (message.length <= 5) {
         document.getElementById("contact-message-error").style.display = "block";
         valid = false;
      } else {
         document.getElementById("contact-message-error").style.display = "none";
      }

      if (valid) {
         var mailto = "mailto:tuemail@ejemplo.com"
            + "?subject=Contacto de " + encodeURIComponent(name)
            + "&body=" + encodeURIComponent(message + "\n\nEmail: " + email);
         window.location.href = mailto;
      }
   });
}



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

if (miArray.indexOf(valor) !== -1) {
  // El valor está en el arreglo
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
   var celdasPerimetrales = []
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
   var totalCells = filas * filas; // Generalizar!!!
   var safeCells = totalCells - totalMines;
   if (revealedCount >= safeCells || flagsPlaced == totalMines) {
      stopTimer();
      showEndModal("win-modal");
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
               showEndModal("lose-modal");
            } else {
               startTimer(timerDisplay);
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
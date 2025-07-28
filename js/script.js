var seconds = 0;
var isTimerRunning = false;
var timerInterval = null;
var toast;
var timeoutId;
var currentPlayerName = "";


window.addEventListener('DOMContentLoaded', function () {
   showStartModal();
   showEndModal("win-modal");
   showEndModal("lose-modal");
   initContactModal();

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


   toast = document.getElementById("toast");
   showError("Aca van los mensajes de errores");

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
         console.log("Current player:", currentPlayerName);
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
window.addEventListener('DOMContentLoaded', function() {
    var filas = 8;
    var columnas = 8;
    var cellSize = 40; 
    var gap = 2;       
    
    var container = document.querySelector('.container');
    var grid = document.querySelector('.grid');
    var timer = document.querySelector('.timerGame');
  
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
 
  var seconds = 0;
  var minutes = 0;

  function updateTimer() {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }

    var minStr = (minutes < 10 ? '0' : '') + minutes;
    var secStr = (seconds < 10 ? '0' : '') + seconds;
    timer.textContent = minStr + ':' + secStr;
  }

  setInterval(updateTimer, 1000);

  });
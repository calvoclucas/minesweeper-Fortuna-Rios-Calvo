window.addEventListener('DOMContentLoaded', function() {
    var filas = 8;
    var columnas = 8;
    var cellSize = 40; // px
    var gap = 2;       // px
    
     var container = document.querySelector('.container');
    var grid = document.querySelector('.grid');
    //var playButton = document.querySelector('.playButtons');

    // Calculamos el ancho y alto total de la grilla:
    // ancho = columnas * cellSize + (columnas - 1) * gap
    // alto = filas * cellSize + (filas - 1) * gap
    var gridWidth = columnas * cellSize + (columnas - 1) * gap;
    var gridHeight = filas * cellSize + (filas - 1) * gap;

    grid.style.width = gridWidth + 'px';
    grid.style.height = gridHeight + 'px';
    // playButton.style.width = gridWidth + 'px';

    container.style.width = gridWidth + 'px';

    // Generar celdas
    for (var i = 1; i <= filas * columnas; i++) {
      var cell = document.createElement('div');
      cell.className = 'cell';
      cell.id = 'cell-' + i;
      cell.textContent = i;
      grid.appendChild(cell);
    }
  });
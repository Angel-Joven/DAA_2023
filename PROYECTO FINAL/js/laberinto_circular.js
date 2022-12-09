// PROYECTO FINAL - LABERINTO CIRCULAR

// JOVEN JIMENEZ ANGEL CRISTIAN
// MARTINEZ RIOS LEONARDO DANIEL

// DISEÑO Y ANALISIS DE ALGORITMOS - 1558

// 10/12/2022

//Creamos nuestras variables constantes, las cuales serviran para importar e inicializar el renderizado del laberinto.
//Asi tambien las variables como grosorLaberinto y tamanioLaberinto son ajustes que se pueden editar.
const codigoLaberinto = document.querySelector('.laberinto');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const obtenerTamanioP = window.devicePixelRatio || 1;
const grosorLaberinto = 1;

//Se aleatoriza esta variable para que salgan laberintos con circulos y entradas al azar.
let numero_aleatorio = Math.random();
numero_aleatorio = numero_aleatorio * 100 + 10
tamanioLaberinto = numero_aleatorio; //Valores minimos permitidos = 3; Valores Maximos permitidos = 126; Valores recomendados = 5 - 50; Valor optimo = 25

let anchoLaberinto = 0;
let filasLaberinto = 0;

let gridLaberinto = [];
let distanciaMaxima = 0;

//Aqui empezamos a crear nuestras celdas y enlazamos las celdasA y celdasB para formar la cuadricula.

const enlazarCeldas = (celdaA, celdaB) => {
  const enlazarFilas = celdaA.enlazarLaberinto.find(lineaCamino_Lab => lineaCamino_Lab.filaCelda === celdaB.filaCelda && lineaCamino_Lab.columnaCeldas === celdaB.columnaCeldas);
  return !!enlazarFilas;
};

//Se guardara todas las celdasA y B enlazadas en una lista y se retorna la lista.
const obtenerCeldas_vecinas = celdasLaberinto => {
  const listaCeldas_Lab = [];

  if (celdasLaberinto.contornoLab) listaCeldas_Lab.push(gridLaberinto[celdasLaberinto.contornoLab.filaCelda][celdasLaberinto.contornoLab.columnaCeldas])
  if (celdasLaberinto.circulosLab) listaCeldas_Lab.push(gridLaberinto[celdasLaberinto.circulosLab.filaCelda][celdasLaberinto.circulosLab.columnaCeldas])
  if (celdasLaberinto.interiorLab) listaCeldas_Lab.push(gridLaberinto[celdasLaberinto.interiorLab.filaCelda][celdasLaberinto.interiorLab.columnaCeldas])

  celdasLaberinto.exteriorLab.forEach(circuloExterior_Lab => {
    listaCeldas_Lab.push(gridLaberinto[circuloExterior_Lab.filaCelda][circuloExterior_Lab.columnaCeldas]);
  });

  return listaCeldas_Lab;
};

//Se crean de manera aleatoria las filas y columnas y se añen a la grid.

const cuadriculaAleatoria_Lab = () => {
  const filasAleatorias_Lab = Math.floor(Math.random() * filasLaberinto);
  const ColumnasAleatorias_Lab = Math.floor(Math.random() * gridLaberinto[filasAleatorias_Lab].length);

  let gridActual = gridLaberinto[filasAleatorias_Lab][ColumnasAleatorias_Lab];

//Mientras que la gridActual tenga celdas vecinas, va a enlazar dichas celdas para formar mas grids.

  while (gridActual) {
    const celdasVecinas_noVisitadas = obtenerCeldas_vecinas(gridActual).filter(numero => numero.enlazarLaberinto.length === 0);

//Si hay longitud entre celdas vecinas y celdas que no han sido visitadas, 
//entonces se le asigna una longitud aleatoria a las celdas que no han sido visitadas
//y se van añadiendo dichas celdas a la grid actual, si ya todas las celdas han sido visitadas, entonces hasta ahi termina de agregar celdas a la grid.

    const { length } = celdasVecinas_noVisitadas;
    if (length) {
      const longitudAleatorio = Math.floor(Math.random() * length);
      const { filaCelda, columnaCeldas } = celdasVecinas_noVisitadas[longitudAleatorio];

      gridActual.enlazarLaberinto.push({ filaCelda, columnaCeldas });
      gridLaberinto[filaCelda][columnaCeldas].enlazarLaberinto.push({ filaCelda: gridActual.filaCelda, columnaCeldas: gridActual.columnaCeldas });

      gridActual = celdasVecinas_noVisitadas[longitudAleatorio];
    } else {
      gridActual = null;

      //Bucle para añadir todas las filas y columnas a la grid del laberinto.
      loop:
      for (let filaCelda of gridLaberinto) {
        for (let celdasLaberinto of filaCelda) {
          const obtenerVecino_Lab = obtenerCeldas_vecinas(celdasLaberinto).filter(numero => numero.enlazarLaberinto.length !== 0);

          if (celdasLaberinto.enlazarLaberinto.length === 0 && obtenerVecino_Lab.length !== 0) {
            gridActual = celdasLaberinto;

            const longitudAleatorio = Math.floor(Math.random() * obtenerVecino_Lab.length);
            const { filaCelda, columnaCeldas } = obtenerVecino_Lab[longitudAleatorio];

            gridActual.enlazarLaberinto.push({ filaCelda, columnaCeldas });
            gridLaberinto[filaCelda][columnaCeldas].enlazarLaberinto.push({ filaCelda: gridActual.filaCelda, columnaCeldas: gridActual.columnaCeldas });

            break loop;
          }
        }
      }
    }
  }

//Dibujamos nuestro laberinto
  dibujarLaberinto();
};

//Se dibuja el canvas en base al tamaño de la pantalla.

const dibujarLaberinto = () => {
  ctx.clearRect(0, 0, anchoLaberinto * obtenerTamanioP, anchoLaberinto * obtenerTamanioP);

//Creamos nuestra linea de color rojo el cual servira para mostrar el camino de la entrada al centro del laberinto.

  ctx.lineaSeguimiento = '#000';
  ctx.grosorLaberinto = grosorLaberinto;

//Para cada fila de las celdas en la cuadricula del laberinto, se va a trazar una linea linea verificando las paredes que hay en la grid desde la entrada al centro de la grid
//La linea se va a ir creando de acuerdo al radio de los circulos interiores y exteriores 
//y se va a mover modificando el angulo del circulo cuando vaya encontrando un celda vacia
  for (let filaCelda of gridLaberinto) {
    for (let celdasLaberinto of filaCelda) {
      if (celdasLaberinto.filaCelda) {
        if (!celdasLaberinto.interiorLab || !enlazarCeldas(celdasLaberinto, celdasLaberinto.interiorLab)) {
          ctx.beginPath();
          ctx.moveTo(celdasLaberinto.radioInterior1, celdasLaberinto.radioInterior2);
          ctx.lineTo(celdasLaberinto.radioInterior3, celdasLaberinto.radioInterior4);
          ctx.stroke();
        }

        if (!celdasLaberinto.contornoLab || !enlazarCeldas(celdasLaberinto, celdasLaberinto.contornoLab)) {
          ctx.beginPath();
          ctx.moveTo(celdasLaberinto.radioInterior3, celdasLaberinto.radioInterior4);
          ctx.lineTo(celdasLaberinto.radioExterior3, celdasLaberinto.radioExterior4);
          ctx.stroke();
        }

        if (celdasLaberinto.filaCelda === gridLaberinto.length - 1 && celdasLaberinto.columnaCeldas !== filaCelda.length * 0.75) {
          ctx.beginPath();
          ctx.moveTo(celdasLaberinto.radioExterior1, celdasLaberinto.radioExterior2);
          ctx.lineTo(celdasLaberinto.radioExterior3, celdasLaberinto.radioExterior4);
          ctx.stroke();
        }
      }
    }
  }
};

//Se ordena la cuadricula acomodando las filas y columnas enlazadas para formar el circulo inicial.

const crearCuadricula_Lab = () => {
  const alturaFila_Lab = 1 / filasLaberinto;

  gridLaberinto = [];
  gridLaberinto.push([{ filaCelda: 0, columnaCeldas: 0, enlazarLaberinto: [], exteriorLab: [] }]);

//Se añaden los circulos de acuerdo con el circulo central en donde su tamaño se va a aumentar de manera proporcional hasta el limite de la cuadricula.

  for (let i = 1; i < filasLaberinto; i++) {
    const radioCirculos = i / filasLaberinto;
    const circunferenciaCirculos = 2 * Math.PI * radioCirculos;
    const contarCuadriculas = gridLaberinto[i - 1].length;
    const anchoCelda_Lab = circunferenciaCirculos / contarCuadriculas;
    const areaCuadricula = Math.round(anchoCelda_Lab / alturaFila_Lab);
    const contadorLaberinto = contarCuadriculas * areaCuadricula;

    const filaCelda = [];

//Se insertan las celdas (filas y columnas enlazadas) detras de los circulos.

    for (let j = 0; j < contadorLaberinto; j++) {
      filaCelda.push({
        filaCelda: i,
        columnaCeldas: j,
        enlazarLaberinto: [],
        exteriorLab: [],
      })
    }

    gridLaberinto.push(filaCelda);
  }

//Las celdas donde se encuentra la circunferencia de los circulos va a ir modificandose para abrir los caaminos hacia el centro del laberinto.

  gridLaberinto.forEach((filaCelda, i) => {
    filaCelda.forEach((celdasLaberinto, j) => {
      if (celdasLaberinto.filaCelda > 0) {
        celdasLaberinto.contornoLab = { filaCelda: i, columnaCeldas: (j === filaCelda.length - 1 ? 0 : j + 1) };
        celdasLaberinto.circulosLab = { filaCelda: i, columnaCeldas: (j === 0 ? filaCelda.length - 1 : j - 1) };

        const areaCuadricula = gridLaberinto[i].length / gridLaberinto[i - 1].length;
        const relacion_Lab = gridLaberinto[i - 1][Math.floor(j / areaCuadricula)];

        celdasLaberinto.interiorLab = { filaCelda: relacion_Lab.filaCelda, columnaCeldas: relacion_Lab.columnaCeldas };
        relacion_Lab.exteriorLab.push({ filaCelda: celdasLaberinto.filaCelda, columnaCeldas: celdasLaberinto.columnaCeldas });
      }
    });
  });

  posCeldas_Lab();
};

//Los circulos se van centrando de acuerdo al radio interior y exterior de los demas circulos con ayuda de la cuadricula.

const posCeldas_Lab = () => {
  const circulosCentrados_Lab = anchoLaberinto / 2;

  gridLaberinto.forEach(filaCelda => {
    filaCelda.forEach(celdasLaberinto => {
      const anguloCirculo_Lab = 2 * Math.PI / filaCelda.length;
      const radioInterior_circuloLab = celdasLaberinto.filaCelda * tamanioLaberinto
      const radioExterior_circuloLab = (celdasLaberinto.filaCelda + 1) * tamanioLaberinto
      const anguloCirculos_interiorLab = celdasLaberinto.columnaCeldas * anguloCirculo_Lab;
      const anguloCirculos_exteriorLab = (celdasLaberinto.columnaCeldas + 1) * anguloCirculo_Lab;

      celdasLaberinto.radioInterior1 = Math.round(circulosCentrados_Lab + (radioInterior_circuloLab * Math.cos(anguloCirculos_interiorLab))) * obtenerTamanioP + grosorLaberinto / 2;
      celdasLaberinto.radioInterior2 = Math.round(circulosCentrados_Lab + (radioInterior_circuloLab * Math.sin(anguloCirculos_interiorLab))) * obtenerTamanioP + grosorLaberinto / 2;
      celdasLaberinto.radioExterior1 = Math.round(circulosCentrados_Lab + (radioExterior_circuloLab * Math.cos(anguloCirculos_interiorLab))) * obtenerTamanioP + grosorLaberinto / 2;
      celdasLaberinto.radioExterior2 = Math.round(circulosCentrados_Lab + (radioExterior_circuloLab * Math.sin(anguloCirculos_interiorLab))) * obtenerTamanioP + grosorLaberinto / 2;
      celdasLaberinto.radioInterior3 = Math.round(circulosCentrados_Lab + (radioInterior_circuloLab * Math.cos(anguloCirculos_exteriorLab))) * obtenerTamanioP + grosorLaberinto / 2;
      celdasLaberinto.radioInterior4 = Math.round(circulosCentrados_Lab + (radioInterior_circuloLab * Math.sin(anguloCirculos_exteriorLab))) * obtenerTamanioP + grosorLaberinto / 2;
      celdasLaberinto.radioExterior3 = Math.round(circulosCentrados_Lab + (radioExterior_circuloLab * Math.cos(anguloCirculos_exteriorLab))) * obtenerTamanioP + grosorLaberinto / 2;
      celdasLaberinto.radioExterior4 = Math.round(circulosCentrados_Lab + (radioExterior_circuloLab * Math.sin(anguloCirculos_exteriorLab))) * obtenerTamanioP + grosorLaberinto / 2;

      const anguloCirculos_centradosLab = (anguloCirculos_interiorLab + anguloCirculos_exteriorLab) / 2;

      celdasLaberinto.salidaCentro_X = (Math.round(circulosCentrados_Lab + (radioInterior_circuloLab * Math.cos(anguloCirculos_centradosLab))) * obtenerTamanioP + grosorLaberinto / 2 +
                      Math.round(circulosCentrados_Lab + (radioExterior_circuloLab * Math.cos(anguloCirculos_centradosLab))) * obtenerTamanioP + grosorLaberinto / 2) / 2;
      celdasLaberinto.salidaCentro_Y = (Math.round(circulosCentrados_Lab + (radioInterior_circuloLab * Math.sin(anguloCirculos_centradosLab))) * obtenerTamanioP + grosorLaberinto / 2 +
                      Math.round(circulosCentrados_Lab + (radioExterior_circuloLab * Math.sin(anguloCirculos_centradosLab))) * obtenerTamanioP + grosorLaberinto / 2) / 2;
    });
  });
};

//Aqui se calcula la distancia entre las paredes (o circunferencias) de los circulos, si hay una pared cerca, la linea se movera al lado contrario de la pared.

const calcularDistancia_Pared = (filaCelda = 0, columnaCeldas = 0, paredLaberinto = 0) => {
  distanciaMaxima = Math.max(distanciaMaxima, paredLaberinto);

  gridLaberinto[filaCelda][columnaCeldas].distance = paredLaberinto;
  gridLaberinto[filaCelda][columnaCeldas].enlazarLaberinto.forEach(lineaCamino_Lab => {
    const { distance } = gridLaberinto[lineaCamino_Lab.filaCelda][lineaCamino_Lab.columnaCeldas];
    if (!distance && distance !== 0) {
      calcularDistancia_Pared(lineaCamino_Lab.filaCelda, lineaCamino_Lab.columnaCeldas, paredLaberinto + 1);
    }
  });
};

//Aqui se crea el camino formalmente despues de que se haya verificado que no haya celdas con trazos de circulos dibujados.

const crearCamino_Lab = () => {
  let filaCelda = gridLaberinto.length - 1;
  let celdasLaberinto = { ...gridLaberinto[filaCelda][gridLaberinto[filaCelda].length * 0.75] };
  let siguienteCelda_Lab = null;
  let { distance } = celdasLaberinto;

  ctx.strokeStyle = '#f00'; //Se le asigna una silueta a la linea original la cual va a seguir hasta el centro del laberinto

  ctx.beginPath();
  ctx.moveTo(celdasLaberinto.salidaCentro_X, celdasLaberinto.salidaCentro_Y);

//Mientras que la distancia sea mayor a cero, se van a enlazar las filas y columnas en donde el camino este libre para la linea, asi hasta que llegue al centro del laberinto.

  while (distance > 0) {
    const enlazarFilas = celdasLaberinto.enlazarLaberinto.filter(lineaCamino_Lab => gridLaberinto[lineaCamino_Lab.filaCelda][lineaCamino_Lab.columnaCeldas].distance === distance - 1)[0];
    siguienteCelda_Lab = { ...gridLaberinto[enlazarFilas.filaCelda][enlazarFilas.columnaCeldas] };

    ctx.lineTo(celdasLaberinto.salidaCentro_X, celdasLaberinto.salidaCentro_Y);

    distance -= 1;
    celdasLaberinto = { ...siguienteCelda_Lab };
  }

  ctx.lineTo(anchoLaberinto * 0.5 * obtenerTamanioP, anchoLaberinto * 0.5 * obtenerTamanioP);
  ctx.stroke();
};

//Se ajusta el tamaño del laberinto con base a la pantalla del usuario.

const redimensionarLab = valoresTamanio => {
  anchoLaberinto = Math.min(codigoLaberinto.clientWidth, codigoLaberinto.clientHeight);

  if (valoresTamanio) {
    tamanioLaberinto = Math.floor(anchoLaberinto / 2 / filasLaberinto);
  } else {
    filasLaberinto = Math.floor(anchoLaberinto / 2 / tamanioLaberinto);
  }

  anchoLaberinto = 2 * filasLaberinto * tamanioLaberinto;

  canvas.width = anchoLaberinto * obtenerTamanioP + grosorLaberinto;
  canvas.height = anchoLaberinto * obtenerTamanioP + grosorLaberinto;

  canvas.style.width = `${anchoLaberinto + grosorLaberinto}px`;
  canvas.style.height = `${anchoLaberinto + grosorLaberinto}px`;
};

//Se crea la funcion inicializadora para el boton de 'crear-laberinto'.

const crearLaberinto = () => {
  redimensionarLab();
  crearCuadricula_Lab();
  cuadriculaAleatoria_Lab();
};

crearLaberinto();

//Variable el cual ayudara a llamar a las funciones para resolver el laberinto (para el boton de resolverLaberinto).

const resolverLaberinto = () => {
  calcularDistancia_Pared();
  crearCamino_Lab();
};

//Se crean las funciones de los botones, importando las clases de dichos botones escritas en el .html

const crearLaberinto_btn = document.querySelector('button.crearLaberinto');
const resolverLaberinto_btn = document.querySelector('button.resolverLaberinto');

crearLaberinto_btn.addEventListener('click', () => {
  crearLaberinto();
});
resolverLaberinto_btn.addEventListener('click', () => {
  resolverLaberinto();
});
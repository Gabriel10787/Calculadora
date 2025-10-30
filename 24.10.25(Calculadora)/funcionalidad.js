//Declaramos variables
let operandoa;
let operandob;
let operacion;
let resultado;
// spans para mostrar la expresión (operandoA operacion operandob)
let operandoaDisplay;
let operacionDisplayElem;
let operandobDisplay;

// Función para formatear números con 3 decimales máximo
function formatearNumero(numero) {
    if (typeof numero === 'string') {
        numero = parseFloat(numero.replace(',', '.'));
    }
    let numeroFormateado = Number(numero).toFixed(3);
    // Eliminar ceros no significativos al final
    numeroFormateado = numeroFormateado.replace(/\.?0+$/, '');
    // Convertir punto a coma
    return numeroFormateado.replace('.', ',');
}

function init(){
  //variables
  resultado =          document.getElementById('resultado');
  let porcentaje =     document.getElementById('porcentaje');
  let borrarEntrada =  document.getElementById('borrarEntrada');
  let reset =          document.getElementById('reset');
  let backspace =      document.getElementById('backspace');
  let inverso =        document.getElementById('inverso');
  let potencia =       document.getElementById('potencia');
  let raiz =           document.getElementById('raiz');
  let suma =           document.getElementById('suma');
  let resta =          document.getElementById('resta');
  let multiplicacion = document.getElementById('multiplicacion');
  let division =       document.getElementById('division');
  let igual =          document.getElementById('igual');
  let uno =            document.getElementById('uno');
  let dos =            document.getElementById('dos');
  let tres =           document.getElementById('tres');
  let cuatro =         document.getElementById('cuatro');
  let cinco =          document.getElementById('cinco');
  let seis =           document.getElementById('seis');
  let siete =          document.getElementById('siete');
  let ocho =           document.getElementById('ocho');
  let nueve =          document.getElementById('nueve');
  let cero =           document.getElementById('cero');
  let coma =           document.getElementById('coma');
  let cambioValor =    document.getElementById('cambioValor');


    // referencias a los spans de la expresión
    operandoaDisplay =     document.getElementById('operandoA');
    operacionDisplayElem = document.getElementById('operacionDisplay');
    operandobDisplay =     document.getElementById('operandob');

  //Eventos de click
  uno.onclick = function(e){
      resultado.textContent = resultado.textContent  + "1";
      updateExpression();
  }
  dos.onclick = function(e){
      resultado.textContent = resultado.textContent  + "2";
      updateExpression();
  }
  tres.onclick = function(e){
      resultado.textContent = resultado.textContent  + "3";
      updateExpression();
  }
  cuatro.onclick = function(e){
      resultado.textContent = resultado.textContent  + "4";
      updateExpression();
  }
  cinco.onclick = function(e){
      resultado.textContent = resultado.textContent  + "5";
      updateExpression();
  }
  seis.onclick = function(e){
      resultado.textContent = resultado.textContent  + "6";
      updateExpression();
  }
  siete.onclick = function(e){
      resultado.textContent = resultado.textContent  + "7";
      updateExpression();
  }
  ocho.onclick = function(e){
      resultado.textContent = resultado.textContent  + "8";
      updateExpression();
  }
  nueve.onclick = function(e){
      resultado.textContent = resultado.textContent  + "9";
      updateExpression();
  }
  cero.onclick = function(e){
      resultado.textContent = resultado.textContent  + "0";
      updateExpression();
  }
 
  porcentaje.onclick = function(e){
      if(resultado.textContent !== "") {
          let valor = parseFloat(resultado.textContent.replace(',', '.'));
          resultado.textContent = formatearNumero(valor / 100);
      }
      updateExpression();
  }
  borrarEntrada.onclick = function(e){
      resultado.textContent = "";
      updateExpression();
  }
  reset.onclick = function(e){
      resetear();
      updateExpression();
  }
  backspace.onclick = function(e){
      if(resultado.textContent.length > 0) {
          resultado.textContent = resultado.textContent.slice(0, -1);
      }
      updateExpression();
  }
  inverso.onclick = function(e){
      if(resultado.textContent !== "") {
          let valor = parseFloat(resultado.textContent.replace(',', '.'));
          resultado.textContent = formatearNumero(1 / valor);
      }
      updateExpression();
  }
  potencia.onclick = function(e){
      if(resultado.textContent !== "") {
          let valor = parseFloat(resultado.textContent.replace(',', '.'));
          resultado.textContent = formatearNumero(Math.pow(valor, 2));
      }
      updateExpression();
  }
  raiz.onclick = function(e){
      if(resultado.textContent !== "") {
          let valor = parseFloat(resultado.textContent.replace(',', '.'));
          resultado.textContent = formatearNumero(Math.sqrt(valor));
      } 
      updateExpression();
  }
  suma.onclick = function(e){
      operandoa = resultado.textContent;
      operacion = "+";
      limpiar();
      updateExpression();
  }
  resta.onclick = function(e){
      operandoa = resultado.textContent;
      operacion = "-";
      limpiar();
      updateExpression();
  }
  multiplicacion.onclick = function(e){
      operandoa = resultado.textContent;
      operacion = "*";
      limpiar();
      updateExpression();
  }
  division.onclick = function(e){
      operandoa = resultado.textContent;
      operacion = "/";
      limpiar();
      updateExpression();
  }
  igual.onclick = function(e){
      operandob = resultado.textContent;
      resolver();
      updateExpression();
  }
  
  coma.onclick = function(e){
      if(!resultado.textContent.includes(',')) {
          resultado.textContent = resultado.textContent + ',';
      }
      updateExpression();
  }

  cambioValor.onclick = function(e){
      if(resultado.textContent !== '') {
          let valor = parseFloat(resultado.textContent.replace(',', '.'));
          resultado.textContent = formatearNumero(-1 * valor);
      }
      updateExpression();
  }

}
//Funciones internas
function limpiar(){
  resultado.textContent = "";
}
function resetear(){
  resultado.textContent = "";
  operandoa = 0;
  operandob = 0;
  operacion = "";
    // limpiar la vista de la expresión
    if (typeof operandoaDisplay !== 'undefined' && operandoaDisplay){
        operandoaDisplay.textContent = '';
        operacionDisplayElem.textContent = '';
        operandobDisplay.textContent = '';
    }
}

function resolver(){
  let res = 0;
  // Reemplazar comas por puntos para los cálculos
  let op1 = operandoa.replace(',', '.');
  let op2 = operandob.replace(',', '.');
  
  switch(operacion){
    case "+":
      res = parseFloat(op1) + parseFloat(op2);
      break;
    case "-":
      res = parseFloat(op1) - parseFloat(op2);
      break;
    case "*":
      res = parseFloat(op1) * parseFloat(op2);
      break;
    case "/":
      res = parseFloat(op1) / parseFloat(op2);
      break;
  }
  
  // Formatear el resultado con 3 decimales máximo
  let resultadoFormateado = formatearNumero(res);
  
  // Limpiar la expresión y mostrar solo el resultado
  operandoa = '';
  operandob = '';
  operacion = '';
  resultado.textContent = resultadoFormateado;
  updateExpression();
}

// Actualiza los spans que muestran la expresión en construcción
function updateExpression(){
    if(!operandoaDisplay || !operacionDisplayElem || !operandobDisplay) return;

    // Si hay una operación en curso, mostrar la expresión completa
    if(operacion && operandoa !== undefined && operacion !== ""){
        operandoaDisplay.textContent = operandoa;
        operacionDisplayElem.textContent = operacion === '*' ? '×' : operacion;
        operandobDisplay.textContent = resultado.textContent || '';
        // En este caso, el resultado solo muestra el número que se está escribiendo
        resultado.textContent = resultado.textContent || '';
    } else {
        // Si no hay operación, mostrar solo el resultado abajo y limpiar la expresión
        operandoaDisplay.textContent = '';
        operacionDisplayElem.textContent = '';
        operandobDisplay.textContent = '';
        // El resultado muestra el número actual
        resultado.textContent = resultado.textContent || '';
    }
}
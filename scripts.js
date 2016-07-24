(function(document, window) {
  'use strict';

  var context = document.querySelector('[data-module="calc"]');
  var screenMain = context.querySelector('[data-screen="main"]');
  var screenSecond = context.querySelector('[data-screen="second"]');
  var buttons = [].slice.call(context.querySelectorAll('[data-button]'));
  var removeLast = context.querySelector('[data-button="removeLast"]');
  var removeAll = context.querySelector('[data-button="removeAll"]');

  /**
   * @description Return value of given equation.
   * @param  {String} equation Equation in string form
   * @return {Number} result of equation
   */
  function calculate(equation) {
    var result;
    if(!equation) return 0;

    equation = ('' + equation).replace(/[,]/g, '.');
    equation = ('' + equation).replace(/[x]/g, '*');

    if(isNaN(equation[equation.length -1]))
      equation = equation.slice(0, -1);

    try {
      return(Math.round(eval(equation) * 100) / 100 || 0);
    } catch(e) {
      return 'error';
    }
  }

  /**
   * @description Update screen with proper equation. Display result if '='
   *              character was clicked. Remove last character or result if
   *              'remove' button was clicked.
   */
  function updateScreen() {
    var character = this.dataset.button;
    var value = screenMain.innerText;
    var result = '';

    if(character === 'removeLast') { // remove last
      value = value.slice(0, -1);
      if(value) result = calculate(value);
    } else if(character === 'removeAll') { // remove all
      removeLast.classList.remove('hidden');
      removeAll.classList.add('hidden');
      value = '';
    } else if(character === '=') { // print result
      removeLast.classList.add('hidden');
      removeAll.classList.remove('hidden');
      value = calculate(screenMain.innerText);
    } else { // calculate
      removeLast.classList.remove('hidden');
      removeAll.classList.add('hidden');

      if(isNaN(character) && isNaN(value[value.length -1]))
        value = value.slice(0, -1);

      value = (!value && !(!isNaN(character) || character === '-')) ?
        '' : value + character;

      if(calculate(value) === 'error') value = value.slice(0, -1);

      result = calculate(value);
    }

    screenMain.innerText = value;
    screenSecond.innerText = result;
  }

  /**
   * @description Use keyboard as input. Trigger click event on proper
   *              calculator buttons.
   * @param {Object} event Event object
   */
  function handleKeyboard(event) {
    var actions = {
      '*'      : 'x',
      'Enter'  : '=',
      'Delete' : 'removeAll'
    };
    var key = actions[event.key] || event.key;
    var button = context.querySelector('[data-button="' + key + '"]');
    button && button.click();
  }

  // bind events
  buttons.forEach(button => button.addEventListener('click', updateScreen));
  window.addEventListener('keypress', handleKeyboard);
})(document, window);

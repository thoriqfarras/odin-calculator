/* 
    PROGRESS UPDATE:

    Calculation functionality is somewhat done but has SO many bugs.
*/

function buttonPressed() {
    if (this.id === 'equal') {
        this.style['background-color'] = 'rgb(186, 117, 0)';
        this.style.color = 'rgb(216, 137, 0)';
    } else if (this.className === 'operator') {
        this.style['background-color'] = 'rgb(36, 36, 36)';
        this.style.color = 'gray';
    } else {
        this.style['background-color'] = 'rgb(77, 77, 77)';
        this.style.color = 'gray';
    }
}

function buttonUnpressed(button) {
    /* 
    I added a parameter because the functtion is called
    on an event listener for the whole page.
    */
    if (button.id === 'equal') {
        button.style['background-color'] = 'rgb(196, 127, 0)';
    } else if (button.className === 'operator') {
        button.style['background-color'] = 'rgb(46, 46, 46)';
    } else {
        button.style['background-color'] = 'rgb(87, 87, 87)';
    }
    button.style.color = 'lightgray';
}

function fillMainDisplay(button) {
    const mainDisplay = document.getElementById('main-display');
    mainDisplay.textContent += button.textContent;
}

function updateOperationDisplay(button) {
    const mainDisplay = document.getElementById('main-display');
    const operationDisplay = document.getElementById('operation');
    if (button.textContent === EQUAL) {
        operationDisplay.textContent = `${a} ${previousOperation} ${b} =`;
    } else {
        if (operation === EQUAL) return;
        operationDisplay.textContent = mainDisplay.textContent + ' ' + 
                                        button.textContent;
    }
}

function clearMainDisplay() {
    const mainDisplay = document.getElementById('main-display');
    mainDisplay.textContent = '0';
}

function clearOperationDisplay() {
    const operationDisplay = document.getElementById('operation');
    operationDisplay.textContent = '';
}

function deleteDigit() {
    const mainDisplay = document.getElementById('main-display');
    let processed = Array.from(mainDisplay.textContent);
    let deleted = processed.pop();
    mainDisplay.textContent = processed.join('');
    return deleted;
}

function toggleNumberSign() {
    const mainDisplay = document.getElementById('main-display');
    let processed = Array.from(mainDisplay.textContent);
    if (processed.includes('-')) {
        processed.shift();
    } else {
        processed.unshift('-');
    }
    mainDisplay.textContent = processed.join('');
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

function operate(a, b, operation) {
    if (operation === ADD) {
        return add(a, b)
    } else if (operation === SUBTRACT) {
        return subtract(a, b)
    } else if (operation === MULTIPLY) {
        return multiply(a, b)
    } else if (operation === DIVIDE) {
        return divide(a, b)
    } else return null;
}

function getDisplayValue() {
    const mainDisplay = document.getElementById('main-display');
    return mainDisplay.textContent;
}

function displayResult() {
    const mainDisplay = document.getElementById('main-display');
    mainDisplay.textContent = result;
}

function getOperation(operator) {
    if (operator === ADD) return ADD;
    else if (operator === SUBTRACT) return SUBTRACT;
    else if (operator === MULTIPLY) return MULTIPLY;
    else if (operator === DIVIDE) return DIVIDE;
    else if (operator === EQUAL) return EQUAL;
    return 'empty';
}

function reset() {
    clearMainDisplay();
    clearOperationDisplay();
    numIsDecimal = false;
    previousEventIsOperator = false;
    a = null;
    b = null;
    result = null;
    operation = null;
    operating = false;
    finished = false;
}

// TO FIX:
// (DONE)1. follow up calculations following an equal
// (DONE)2. fix operantor symbol in operation display when pressing equal for the very first time.
// (DONE)3. error in multiplication & division when b is not yet input
// 4. incorrect operator in operation display after finishing a calculation following a cleanup.

const ADD = '+';
const SUBTRACT = '-';
const MULTIPLY = 'x';
const DIVIDE = '÷';
const EQUAL = '='
const mainDisplay = document.getElementById('main-display');
const buttons = document.querySelectorAll('button');
let numIsDecimal = false;
let deleted = '';
let a = null;
let b = null;
let result = null;
let operation = null;
let previousOperation = null;
let previousEventIsOperator = false;
let operating = false;
let finished = false;

buttons.forEach(button => {
    button.addEventListener('dragstart', (e) => { e.preventDefault() });
    
    button.addEventListener('mousedown', buttonPressed);
    
    window.addEventListener('mouseup', () => {
        buttonUnpressed(button);
    });
    
    button.addEventListener('click', () => {
        if (button.id === 'decimal-point' && numIsDecimal) return;

        if (button.className === 'number') {
            if (previousEventIsOperator) {
                mainDisplay.textContent = '';
                previousEventIsOperator = false;
            }

            if (finished) reset();

            if (mainDisplay.textContent === '0' && button.textContent !== '.') {
                mainDisplay.textContent = '';
            } else if (mainDisplay.textContent === '-0' && button.textContent !== '.') {
                mainDisplay.textContent = '-';
            }

            if (button.id === 'decimal-point') numIsDecimal = true; 
            
            fillMainDisplay(button);
        } else if (button.id === 'clear') {
            reset();
        } else if (button.id === 'delete') {
            if (finished) {
                reset();
                return;
            }
            deleted = deleteDigit();
            if (deleted === '.') numIsDecimal = false;
            if (!mainDisplay.textContent) mainDisplay.textContent = '0';
        } else if (button.id === 'plus-minus') {
            if (previousEventIsOperator) {
                mainDisplay.textContent = '0';
                previousEventIsOperator = false;
                toggleNumberSign();
            } else toggleNumberSign();
        } else if (button.className === 'operator' ) {
            const operator = button.textContent;
            
            // handle input and assign to respective variables.
            if (a === null) {
                operating = true;
                a = +getDisplayValue();
                result = a;
                operation = getOperation(operator);
                previousEventIsOperator = true;
            } else b = +getDisplayValue();

            // follow up calculations after pressing equal
            if (operator !== EQUAL && finished) {
                finished = false;
                operating = true;
                a = result;
                b = null;
                operation = getOperation(operator);
            }
            
            if (operating) {
                
                // check for change of operator before taking in second input.
                if (previousEventIsOperator && operator !== EQUAL && b !== null) {
                    operation = getOperation(operator);
                    updateOperationDisplay(button);
                    return;
                } else if (previousEventIsOperator && operator === EQUAL) return;
                
                if (button.textContent === EQUAL && operating) {
                    result = operate(a, b, operation);             
                    operating = false;
                    finished = true;
                } else if (b !== null) { // the condition is to fix error in multiplication / division when b is not yet input.
                    operating = true;
                    result = operate(a, b, operation);
                    a = result;
                    operation = getOperation(operator);   
                }
                displayResult();
                updateOperationDisplay(button);
                previousEventIsOperator = button.textContent === EQUAL ? false : true;
                numIsDecimal = false;
                previousOperation = operation;
            }
        }
    }); 
    
});
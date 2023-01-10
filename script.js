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
    operationDisplay.textContent = mainDisplay.textContent + ' ' +
                                    button.textContent;
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

const ADD = '+';
const SUBTRACT = '-';
const MULTIPLY = 'x';
const DIVIDE = '÷';
const EQUAL = '='
const mainDisplay = document.getElementById('main-display');
const buttons = document.querySelectorAll('button');
let numIsDecimal = false;
let deleted = '';
let operator = '';
let operation = EQUAL;
let prevOperation = '';
let a = null;
let b = null;
let result = null;
let prevEventIsOperator = false;
let lastPressed = '';

buttons.forEach(button => {
    button.addEventListener('dragstart', (e) => { e.preventDefault() });

    button.addEventListener('mousedown', buttonPressed);

    window.addEventListener('mouseup', () => {
        buttonUnpressed(button);
    });

    button.addEventListener('click', () => {
        if (button.id === 'decimal-point' && numIsDecimal) return;
        if (prevEventIsOperator && operation === EQUAL) prevEventIsOperator = false;
        if (button.className === 'number') {
            if (prevEventIsOperator) {
                mainDisplay.textContent = '';
                prevEventIsOperator = false;
            }

            if (mainDisplay.textContent === '0' && button.textContent !== '.') {
                mainDisplay.textContent = '';
            } else if (mainDisplay.textContent === '-0' && button.textContent !== '.') {
                mainDisplay.textContent = '-';
            }

            if (button.id === 'decimal-point') {
                numIsDecimal = true;
            } 
            fillMainDisplay(button);
        } else if (button.id === 'clear') {
            clearMainDisplay();
            clearOperationDisplay();
            numIsDecimal = false;
            prevEventIsOperator = false;
            a = null;
            b = null;
            result = null;
            operation = EQUAL;
        } else if (button.id === 'delete') {
            deleted = deleteDigit();
            if (deleted === '.') numIsDecimal = false;
        } else if (button.id === 'plus-minus') {
            toggleNumberSign();
        } else if (button.className === 'operator' && !prevEventIsOperator) {
            operator = button.textContent;
            if (!a) {
                a = +getDisplayValue();
            } else {
                b = +getDisplayValue();
            }

            if (operator === EQUAL && operation !== EQUAL){
                result = operate(a, b, operation);
                operation = getOperation(operator);
            } else {
                if (b && operation === EQUAL) {
                    a = result;
                    b = 0;
                    console.log('coming off from an equal');
                } else if (b) {
                    a = operate(a, b, operation);
                    console.log('calculating');
                    b = 0;
                }
                console.log('second IF');
                operation = getOperation(operator);
                result = a;
                prevEventIsOperator = true;
            }
            // operation = getOperation(operator);
            // if (operation === EQUAL){
            //     result = operate(a, b, prevOperation);
            // } else {
            //     if (b && operation === EQUAL) {
            //         a = result;
            //         b = 0;
            //     } else if (b) {
            //         a = operate(a, b, operation);
            //         // b = 0;
            //     }
            //     result = a;
            //     prevOperation = operation;
            // }
            displayResult();
            updateOperationDisplay(button);
        }
        if (button.className !== 'number') {
            console.log(`a: ${a}`);
            console.log(`b: ${b}`);
            console.log(`result: ${result}`);
            console.log(`last operation: ${operation}`);
        }
        lastPressed = button.textContent;
    }); 

});
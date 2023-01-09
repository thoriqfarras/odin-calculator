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
    }
}

function getDisplayValue() {
    const mainDisplay = document.getElementById('main-display');
    return mainDisplay.textContent;
}

function displayResult() {
    const mainDisplay = document.getElementById('main-display');
    mainDisplay.textContent = result;
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
let operation = '';
let a = null;
let b = 0;
let result = 0;
let prevEventIsOperator = false;

buttons.forEach(button => {
    button.addEventListener('dragstart', (e) => { e.preventDefault() });

    button.addEventListener('mousedown', buttonPressed);

    window.addEventListener('mouseup', () => {
        buttonUnpressed(button);
    });

    button.addEventListener('click', () => {
        if (button.id === 'decimal-point' && numIsDecimal) return;
        if (button.className === 'number') {
            if (prevEventIsOperator) {
                mainDisplay.textContent = '';
                prevEventIsOperator = false;
            }
            if (mainDisplay.textContent === '0') {
                mainDisplay.textContent = '';
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
            a = 0;
            b = 0;
        } else if (button.id === 'delete') {
            deleted = deleteDigit();
            if (deleted === '.') numIsDecimal = false;
        } else if (button.id === 'plus-minus') {
            toggleNumberSign();
        } else if (button.className === 'operator') {
            operator = button.textContent;
            console.log(prevEventIsOperator);
            if (!a) {
                a = getDisplayValue();
            } else {
                b = getDisplayValue();
            }

            if (operator === EQUAL) {
                result = operate(+a, +b, operation);
                console.log(result);
                displayResult(result);
            } else {
                if (operator === ADD) {
                    operation = ADD;
                }
            }
            
            prevEventIsOperator = true;
            updateOperationDisplay(button);
            console.log(prevEventIsOperator);
        }

        if (button.className !== 'number') {
            console.log(`a: ${a}`);
            console.log(`b: ${b}`);
            console.log(`result: ${result}`);
        }
    }); 

});
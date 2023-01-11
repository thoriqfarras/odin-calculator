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
    if (button.textContent === EQUAL && previousOperation !== EQUAL) {
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
}

const ADD = '+';
const SUBTRACT = '-';
const MULTIPLY = 'x';
const DIVIDE = '÷';
const EQUAL = '='
const mainDisplay = document.getElementById('main-display');
const buttons = document.querySelectorAll('button');
let numIsDecimal = false;
let a = null;
let b = null;
let result = null;
let operation = EQUAL;
let previousOperation = null;
let previousEventIsOperator = false;

buttons.forEach(button => {
    button.addEventListener('dragstart', (e) => { e.preventDefault() });
    
    button.addEventListener('mousedown', buttonPressed);
    
    window.addEventListener('mouseup', () => {
        buttonUnpressed(button);
    });
    
    button.addEventListener('click', () => {
        if (button.id === 'decimal-point' && numIsDecimal) return;
        
        // doesn't reset display when equal button is pressed twice.
        // if (previousEventIsOperator && operation === EQUAL) previousEventIsOperator = false;

        if (button.className === 'number') {
            if (operation === EQUAL) { // reset whole calculator when typing in new number after pressing equal.
                reset();
            }
            if (previousEventIsOperator) {
                mainDisplay.textContent = '';
                previousEventIsOperator = false;
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
            reset();
        } else if (button.id === 'delete') {
            deleted = deleteDigit();
            if (deleted === '.') numIsDecimal = false;
        } else if (button.id === 'plus-minus') {
            toggleNumberSign();
        } else if (button.className === 'operator' ) {
            if (a === null) a = +getDisplayValue();
            else b = +getDisplayValue();
            
            const operator = button.textContent;
            if (previousEventIsOperator) { // allow changing of operators as long as second number is not input.
                operation = getOperation(operator);
            } else {        
                if (operator === EQUAL && operation !== EQUAL) {
                    result = operate(a, b, operation);
                    console.log('hola');
                } else if (operator === EQUAL && operation === EQUAL) {
                    // operation = null;
                } else {
                    if (b !== null && operation === EQUAL) {
                        a = result;
                        console.log('hello');
                    } else if (b) {
                        a = operate(a, b, operation);
                        console.log('hi');
                    }
                    console.log('hihi');
                    b = 0;
                    result = a;
                    previousEventIsOperator = true;
                }
                operation = getOperation(operator);
            }

            console.log(`a: ${a}`);
            console.log(`b: ${b}`);
            console.log(`result: ${result}`);
            console.log(`operator: ${operator}`);
            console.log(`operation: ${operation}`);
            console.log(`previous operation: ${previousOperation}`);
            console.log(`previous is operation: ${previousEventIsOperator}`);
    
            previousOperation = operation; // this is solely for operation display purpose.
            numIsDecimal = false;
            displayResult();
            updateOperationDisplay(button);
        }
    }); 
    
});

/* 
1. let displayValue = 0
2. user types in number
3. user presses an operator:
if operator is not equal:


*/
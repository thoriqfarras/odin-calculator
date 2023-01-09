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

function updateMainDisplay(button) {
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
    mainDisplay.textContent = '';
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

const mainDisplay = document.getElementById('main-display');
const buttons = document.querySelectorAll('button');
let numIsDecimal = false;
let deleted = '';
let a;
let b;

buttons.forEach(button => {
    button.addEventListener('dragstart', (e) => { e.preventDefault() });

    button.addEventListener('mousedown', buttonPressed);

    window.addEventListener('mouseup', () => {
        buttonUnpressed(button);
    });

    button.addEventListener('click', () => {
        if (button.id === 'decimal-point' && numIsDecimal) return;
        if (button.className === 'number') {
            if (button.id === 'decimal-point') {
                numIsDecimal = true;
            } 
            updateMainDisplay(button);
        } else if (button.id === 'clear') {
            clearMainDisplay();
            clearOperationDisplay();
            numIsDecimal = false;
        } else if (button.id === 'delete') {
            deleted = deleteDigit();
            if (deleted === '.') numIsDecimal = false;
        } else if (button.id === 'plus-minus') {
            toggleNumberSign();
        } else if (button.className === 'operator') {
            a = +mainDisplay.textContent;
            console.log(`${a} ${typeof(a)}`);
            updateOperationDisplay(button);
        }
    }); 

});
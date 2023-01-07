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
    if (button.id === 'equal') {
        button.style['background-color'] = 'rgb(196, 127, 0)';
    } else if (button.className === 'operator') {
        button.style['background-color'] = 'rgb(46, 46, 46)';
    } else {
        button.style['background-color'] = 'rgb(87, 87, 87)';
    }
    button.style.color = 'lightgray';
}

function updateMainDisplay() {
    const mainDisplay = document.getElementById('main-display');
    mainDisplay.textContent = this.textContent;
}

const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('dragstart', (e) => { e.preventDefault() });

    button.addEventListener('mousedown', buttonPressed);

    window.addEventListener('mouseup', () => {
        buttonUnpressed(button);
    });

    if (button.className === 'number') { 
        button.addEventListener('click', updateMainDisplay); 
    }
});
// Calculator JavaScript
let display = document.getElementById('display');
let currentInput = '';
let expression = '';

function appendToDisplay(value) {
    if (!display) return;
    
    if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput === '' && expression === '') return;
        if (expression.slice(-1).match(/[+\-*/]/)) {
            expression = expression.slice(0, -1) + value;
        } else {
            expression += currentInput + value;
            currentInput = '';
        }
    } else if (value === '.') {
        if (currentInput.includes('.')) return;
        currentInput += value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

function updateDisplay() {
    if (display) {
        display.value = expression + currentInput || '0';
    }
}

function clearDisplay() {
    if (display) {
        display.value = '0';
    }
    currentInput = '';
    expression = '';
}

function backspace() {
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
    } else if (expression.length > 0) {
        if (expression.slice(-1).match(/[+\-*/]/)) {
            expression = expression.slice(0, -1);
        } else {
            // Move last number back to currentInput
            let lastOpIndex = Math.max(
                expression.lastIndexOf('+'),
                expression.lastIndexOf('-'),
                expression.lastIndexOf('*'),
                expression.lastIndexOf('/')
            );
            if (lastOpIndex > -1) {
                currentInput = expression.slice(lastOpIndex + 1);
                expression = expression.slice(0, lastOpIndex + 1);
            } else {
                currentInput = expression;
                expression = '';
            }
            currentInput = currentInput.slice(0, -1);
        }
    }
    updateDisplay();
}

function calculate() {
    if (expression && currentInput) {
        expression += currentInput;
        try {
            let result = eval(expression.replace(/×/g, '*'));
            if (!isFinite(result)) {
                throw new Error('Division by zero');
            }
            // Animate result
            if (display) {
                display.style.animation = 'none';
                setTimeout(() => {
                    display.style.animation = 'result 0.3s ease';
                }, 10);
                display.value = result;
            }
            currentInput = result.toString();
            expression = '';
        } catch (e) {
            alert('خطأ في العملية!');
            clearDisplay();
        }
    }
}

// Handle keyboard input
if (document) {
    document.addEventListener('keydown', (event) => {
        if (!event) return;
        const key = event.key;

        if (key >= '0' && key <= '9') {
            appendToDisplay(key);
        } else if (key === '.') {
            appendToDisplay(key);
        } else if (['+', '-', '*', '/'].includes(key)) {
            appendToDisplay(key);
        } else if (key === 'Enter' || key === '=') {
            calculate();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            clearDisplay();
        } else if (key === 'Backspace') {
            backspace();
        }
    });

    // Prevent default behavior for calculator buttons
    document.querySelectorAll('.btn').forEach(button => {
        if (button) {
            button.addEventListener('click', (e) => {
                if (e) e.preventDefault();
                // Add click animation
                button.style.animation = 'none';
                setTimeout(() => {
                    button.style.animation = 'click 0.1s ease';
                }, 10);
            });
        }
    });
}

// Initialize display
updateDisplay();
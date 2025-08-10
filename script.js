// Calculator state variables
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Get display element
const display = document.getElementById('display');

/**
 * Update the calculator display
 * @param {string} value - The value to display
 */
function updateDisplay(value) {
    if (value.length > 12) {
        display.textContent = parseFloat(value).toExponential(6);
        display.classList.add('error');
    } else {
        display.textContent = value;
        display.classList.remove('error');
    }
}

/**
 * Handle number input
 * @param {string} num - The number to input
 */
function inputNumber(num) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    currentInput += num;
    updateDisplay(currentInput);
    addRipple(event.target);
}

/**
 * Handle operator input
 * @param {string} op - The operator to input (+, -, *, /)
 */
function inputOperator(op) {
    // Allow negative numbers
    if (currentInput === '' && op === '-') {
        currentInput = '-';
        updateDisplay(currentInput);
        return;
    }

    if (currentInput === '' || currentInput === '-') return;

    // Calculate if there's a pending operation
    if (previousInput !== '' && operator !== '' && !shouldResetDisplay) {
        calculate();
    }

    operator = op;
    previousInput = currentInput;
    shouldResetDisplay = true;
    addRipple(event.target);
}

/**
 * Handle decimal point input
 */
function inputDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0';
        shouldResetDisplay = false;
    }
    
    if (currentInput === '') {
        currentInput = '0';
    }
    
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay(currentInput);
    }
    addRipple(event.target);
}

/**
 * Perform calculation
 */
function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') return;

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;

    try {
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    throw new Error('Cannot divide by zero');
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Handle floating point precision
        result = Math.round((result + Number.EPSILON) * 1000000000) / 1000000000;
        
        currentInput = result.toString();
        operator = '';
        previousInput = '';
        shouldResetDisplay = true;
        updateDisplay(currentInput);
        
    } catch (error) {
        updateDisplay('Error');
        currentInput = '';
        operator = '';
        previousInput = '';
        shouldResetDisplay = true;
        display.classList.add('error');
        setTimeout(() => {
            clearAll();
        }, 2000);
    }
    
    if (event && event.target) {
        addRipple(event.target);
    }
}

/**
 * Clear all calculator data
 */
function clearAll() {
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
    updateDisplay('0');
    display.classList.remove('error');
    if (event && event.target) {
        addRipple(event.target);
    }
}

/**
 * Clear current entry
 */
function clearEntry() {
    currentInput = '';
    updateDisplay('0');
    if (event && event.target) {
        addRipple(event.target);
    }
}

/**
 * Add ripple effect to button
 * @param {HTMLElement} element - The button element
 */
function addRipple(element) {
    element.classList.add('ripple');
    setTimeout(() => {
        element.classList.remove('ripple');
    }, 600);
}

// Keyboard support
document.addEventListener('keydown', (e) => {
    e.preventDefault();
    
    if (e.key >= '0' && e.key <= '9') {
        inputNumber(e.key);
    } else if (e.key === '+') {
        inputOperator('+');
    } else if (e.key === '-') {
        inputOperator('-');
    } else if (e.key === '*') {
        inputOperator('*');
    } else if (e.key === '/') {
        inputOperator('/');
    } else if (e.key === '=' || e.key === 'Enter') {
        calculate();
    } else if (e.key === '.' || e.key === ',') {
        inputDecimal();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        clearAll();
    } else if (e.key === 'Backspace') {
        clearEntry();
    }
});

// Initialize display when page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay('0');
});
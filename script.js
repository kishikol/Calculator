let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

const display = document.getElementById('result');

function updateDisplay(value) {
    display.value = value;
}

function appendToDisplay(value) {
    if (display.classList.contains('lyrics-mode')) {
        display.classList.remove('lyrics-mode');
        updateDisplay('0');
        return;
    }
    
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    if (value === '.' && currentInput.includes('.')) {
        return; 
    }
    
    currentInput += value;
    updateDisplay(currentInput);
}

function clearDisplay() {

    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
    updateDisplay('0');
}

function deleteLast() {
    if (display.classList.contains('lyrics-mode')) {
        display.classList.remove('lyrics-mode');
        updateDisplay('0');
        return;
    }
    
    if (currentInput.length > 0) {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput || '0');
    }
}

function setOperator(op) {
    if (display.classList.contains('lyrics-mode')) {
        display.classList.remove('lyrics-mode');
        updateDisplay('0');
        return;
    }
    
    if (currentInput === '') return;
    
    if (operator !== '' && previousInput !== '') {
        calculate();
    }
    
    operator = op;
    previousInput = currentInput;
    currentInput = '';
    shouldResetDisplay = true;
}

function calculate() {
    if (display.classList.contains('lyrics-mode')) {
        display.classList.remove('lyrics-mode');
        updateDisplay('0');
        return;
    }
    
    if (operator === '' && previousInput === '' && currentInput === '') {
        triggerPrank();
        return;
    }
    
    if (operator === '' || previousInput === '' || currentInput === '') {
        return;
    }
    
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    let result;
    
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
                updateDisplay('Error');
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = result.toString();
    operator = '';
    previousInput = '';
    shouldResetDisplay = true;
    updateDisplay(currentInput);
}

function triggerPrank() {
    display.classList.add('lyrics-mode');
    
    playMusic();
    
    displayLyricsWithDelay();
    
    currentInput = '';
    operator = '';
    previousInput = '';
    shouldResetDisplay = false;
}

function playMusic() {
    const audio = new Audio();
    audio.src = 'audio.mp3'; 
    audio.volume = 0.7; 
    audio.loop = false; 
    
    audio.currentTime = 225; //dito nyo palitan yung time stamp ng music nyo
    
    audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = 225; 
    });
    
    audio.play().then(() => {
        console.log('Music started playing at 3:47 mark');
    }).catch(error => {
        console.log('Could not play music:', error);
        playFallbackTone();
    });
    
    window.currentAudio = audio;
}

function playFallbackTone() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const notes = [440, 523, 659, 523, 440, 523, 659, 523]; 
        let noteIndex = 0;
        
        function playNote() {
            if (noteIndex < notes.length) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(notes[noteIndex], audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                
                oscillator.start();
                oscillator.stop(audioContext.currentTime + 0.4);
                
                noteIndex++;
                setTimeout(playNote, 500);
            }
        }
        
        playNote();
    } catch (error) {
        console.log('Fallback audio not available:', error);
    }
}

function displayLyricsWithDelay() {
    const lyrics = [
        "OOooohhhhhhhhhhhh",
        "I'm gonna swallow",
        "My pride",
        "Say I'm Sorry",
        "Stop pointing",
        "Fingers",
        "The blame is on me",
        "I want a new life",
        "And I want it",
        "With you",
        "If you feel the same",
        "Don't ever let it go",
        "I gotta believe",
        "In the spririt of",
        "LOVEEEE",
        "It will heal all things",
        "It won't hurt anymore",
        "No, I don't believe",
        "Our Love's terminal",
        "I'm down my knees",
        "begging you please",
        ":(("
    ];

    const lineDelays = [
        500, 
        400, 
        400, 
        400, 
        400,
        400,
        400,
        400,
        400,
        400,
        400,
        400,
        400,
        200,
        300,
        300,
        300,
        300,
        300,
        300,
        300,
        9000
    ];

    let currentLine = 0;
    let currentChar = 0;
    let displayText = "";

    function displayNextChar() {
        if (currentLine < lyrics.length) {
            const currentLyric = lyrics[currentLine];

            if (currentChar < currentLyric.length) {
                displayText += currentLyric[currentChar];
                updateDisplay(displayText);
                currentChar++;
                setTimeout(displayNextChar, 70); // speed ng bawat letra
            } else {
                setTimeout(() => {
                    displayText = "";
                    updateDisplay(displayText);
                    currentLine++;
                    currentChar = 0;
                    setTimeout(displayNextChar, 30); // delay bago next line
                }, lineDelays[currentLine]); // dito na gagamitin ang per-line delay
            }
        } else {
            setTimeout(() => {
                display.classList.remove('lyrics-mode');
                updateDisplay('0');
            }, 1000);
        }
    }

    displayNextChar();
}
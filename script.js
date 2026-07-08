// ===== CONFIGURACIÓN PERSONALIZADA =====
const CONFIG = {
    userNames: {
        user: "Bambi",
        recipient: "Mi amor"
    },
    relationshipStartDate: new Date('2026-07-01'),
    acertijosIntento: 3,
};

// ===== ACERTIJOS PERSONALIZADOS CON TU HISTORIA REAL =====
const riddles = [
    {
        question: "¿En qué mes nos conocimos en el trabajo?",
        options: ["Febrero", "Marzo", "Abril", "Mayo"],
        correct: 1,
        hint: "Es el tercer mes del año"
    },
    {
        question: "¿En qué mes empezamos a convivir más y fue nuestro primer beso?",
        options: ["Marzo", "Abril", "Mayo", "Junio"],
        correct: 1,
        hint: "Fue después del mes de conocernos"
    },
    {
        question: "¿Cuál fue nuestro primer lugar especial fuera del trabajo?",
        options: ["Cafetería", "Cine", "Parque", "Bolos"],
        correct: 0,
        hint: "Un lugar para tomar algo y charlar"
    },
    {
        question: "¿En qué mes fuiste a mi casa por primera vez y empezamos a vernos más?",
        options: ["Marzo", "Abril", "Mayo", "Junio"],
        correct: 2,
        hint: "Fue el quinto mes del año, mes especial con salidas al cine, parque y bolos"
    },
    {
        question: "¿Cuál es mi color favorito?",
        options: ["Azul", "Negro", "Naranja", "Blanco"],
        correct: 2,
        hint: "Es un color cálido y vibrante que me gusta"
    }
];

// ===== MENSAJE SECRETO PERSONALIZADO =====
const secretMessage = `Para ti, mi amor:

Marzo: Te conocí en el trabajo.
Abril: Nuestro primer beso cambió mi vida.
Mayo: Descubrimos lugares especiales juntos.
Junio: Decidimos estar siempre juntos.
1 de Julio: Te pedí ser mi novia.

Cada día te amo más. Eres lo mejor que me pasó.

Te amo,
Bambi 💕`;

// ===== VARIABLES GLOBALES =====
let currentRiddleIndex = 0;
let score = 0;
let startTime = null;
let currentAttempts = CONFIG.acertijosIntento;
let gameState = {
    score: 0,
    riddleIndex: 0,
    attempts: CONFIG.acertijosIntento,
    startTime: null
};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    calculateDaysTogether();
    createFloatingHearts();
    
    const bottle = document.getElementById('bottle');
    if (bottle) {
        bottle.addEventListener('click', function() {
            playSound('click');
            showScreen('oceanScreen');
            setTimeout(() => {
                showScreen('riddleScreen');
                showRiddle();
                startTime = Date.now();
            }, 1500);
        });
    }
    
    playBackgroundMusic();
    checkSavedProgress();
});

// ===== CALCULAR DÍAS JUNTOS =====
function calculateDaysTogether() {
    const today = new Date();
    const startDate = CONFIG.relationshipStartDate;
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const dayCount = document.getElementById('dayCount');
    if (dayCount) {
        dayCount.textContent = diffDays;
    }
}

// ===== CREAR CORAZONES FLOTANTES =====
function createFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    if (!container) return;
    
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '💕';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 6 + 's';
        container.appendChild(heart);
    }
}

// ===== AUDIO =====
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const sounds = {
        click: () => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.frequency.value = 800;
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.1);
        },
        correct: () => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            osc.frequency.setValueAtTime(800, audioContext.currentTime);
            osc.frequency.linearRampToValueAtTime(1200, audioContext.currentTime + 0.15);
            
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.3);
        },
        incorrect: () => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.type = 'sine';
            osc.frequency.value = 400;
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + 0.3);
        }
    };
    
    if (sounds[type]) {
        sounds[type]();
    }
}

function playBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.volume = 0.3;
    }
}

// ===== MOSTRAR PANTALLA =====
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
    }
}

// ===== INICIAR VIAJE =====
function startJourney() {
    playSound('click');
    showScreen('oceanScreen');
    drawOcean();
}

// ===== DIBUJAR OCÉANO =====
function drawOcean() {
    const canvas = document.getElementById('oceanCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let time = 0;
    let particles = [];
    
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: Math.random() * 0.3 + 0.1,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    function animate() {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#E0F6FF');
        gradient.addColorStop(1, '#87CEEB');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 3;
        
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x += 15) {
                const y = Math.sin(x * 0.01 + time * 0.08 + i * 2) * 25 + 150 + i * 120;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        }
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        particles.forEach(p => {
            ctx.fillRect(p.x, p.y, p.size, p.size);
            p.x += p.speedX;
            p.y += p.speedY;
            
            if (p.y > canvas.height) {
                p.y = -5;
                p.x = Math.random() * canvas.width;
            }
        });
        
        time++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ===== MOSTRAR ACERTIJO =====
function showRiddle() {
    if (currentRiddleIndex >= riddles.length) {
        showScoreScreen();
        return;
    }
    
    const riddle = riddles[currentRiddleIndex];
    const progress = ((currentRiddleIndex) / riddles.length) * 100;
    
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Acertijo ${currentRiddleIndex + 1} de ${riddles.length}`;
    
    document.getElementById('riddleText').textContent = riddle.question;
    document.getElementById('hint').textContent = `💡 Pista: ${riddle.hint}`;
    document.getElementById('attempts').textContent = `Intentos restantes: ${currentAttempts}`;
    
    const optionsContainer = document.getElementById('riddleOptions');
    optionsContainer.innerHTML = '';
    
    riddle.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(index, riddle.correct);
        optionsContainer.appendChild(button);
    });
}

// ===== VERIFICAR RESPUESTA =====
function checkAnswer(selected, correct) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);
    
    buttons.forEach((btn, index) => {
        if (index === correct) {
            btn.classList.add('correct');
        } else if (index === selected && selected !== correct) {
            btn.classList.add('incorrect');
        }
    });
    
    if (selected === correct) {
        playSound('correct');
        score += 100 - (CONFIG.acertijosIntento - currentAttempts) * 20;
        currentAttempts = CONFIG.acertijosIntento;
        
        setTimeout(() => {
            currentRiddleIndex++;
            currentAttempts = CONFIG.acertijosIntento;
            showRiddle();
        }, 1500);
    } else {
        playSound('incorrect');
        currentAttempts--;
        
        if (currentAttempts <= 0) {
            setTimeout(() => {
                alert('❌ Se acabaron los intentos. Intenta con el siguiente acertijo.');
                currentRiddleIndex++;
                currentAttempts = CONFIG.acertijosIntento;
                showRiddle();
            }, 1000);
        } else {
            setTimeout(() => {
                alert(`❌ Respuesta incorrecta. ${currentAttempts} intentos restantes.`);
                showRiddle();
            }, 1000);
        }
    }
}

// ===== PANTALLA DE PUNTUACIÓN =====
function showScoreScreen() {
    const endTime = Date.now();
    const totalTime = Math.round((endTime - startTime) / 1000);
    
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalTime').textContent = `Tiempo: ${totalTime}s`;
    
    gameState = {
        score: score,
        riddleIndex: currentRiddleIndex,
        attempts: currentAttempts,
        time: totalTime
    };
    
    saveProgress(gameState);
    
    showScreen('scoreScreen');
}

// ===== IR AL MENSAJE =====
function goToMessage() {
    showScreen('messageScreen');
    document.getElementById('letterContent').textContent = secretMessage;
    createFloatingHeartsMessage();
    createConfetti();
}

// ===== CORAZONES EN MENSAJE =====
function createFloatingHeartsMessage() {
    const container = document.querySelector('.floating-hearts-message');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-icon';
        heart.textContent = ['💕', '💖', '💗', '💝', '💓'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 4 + 's';
        container.appendChild(heart);
    }
}

// ===== CONFETI =====
function createConfetti() {
    const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FFB6C1', '#87CEEB', '#FF1493', '#FFA500'];
    
    for (let i = 0; i < 80; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9998';
        
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 3 + 2.5;
        const xMove = (Math.random() - 0.5) * 300;
        const rotation = Math.random() * 720;
        
        confetti.animate([
            { transform: `translateY(0) translateX(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) translateX(${xMove}px) rotate(${rotation}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        setTimeout(() => confetti.remove(), duration * 1000);
    }
}

// ===== COMPARTIR MENSAJE =====
function shareMessage() {
    const text = `¡Acabo de abrir una botella virtual con un mensaje especial! 🍾💌 ¿Quieres intentarlo tú también?`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Cartas en una Botella Virtual',
            text: text,
            url: url
        }).catch(err => console.log('Error:', err));
    } else {
        const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    }
}

// ===== GENERAR QR =====
function generateQR() {
    const qrContainer = document.getElementById('qrContainer');
    qrContainer.innerHTML = '';
    
    const qr = new QRCode(qrContainer, {
        text: window.location.href,
        width: 250,
        height: 250,
        colorDark: '#FF8C00',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}

// ===== GUARDAR PROGRESO =====
function saveProgress(state) {
    localStorage.setItem('botella_progress', JSON.stringify({
        ...state,
        timestamp: Date.now()
    }));
}

// ===== VERIFICAR PROGRESO GUARDADO =====
function checkSavedProgress() {
    const saved = localStorage.getItem('botella_progress');
    if (saved) {
        const data = JSON.parse(saved);
        const elapsed = (Date.now() - data.timestamp) / (1000 * 60);
        
        if (elapsed < 60) {
            document.getElementById('loadModal').classList.add('active');
            document.getElementById('modalMessage').textContent = 
                `Tienes progreso guardado: Acertijo ${data.riddleIndex + 1} de ${riddles.length}. ¿Deseas continuar?`;
        }
    }
}

// ===== CARGAR PROGRESO =====
function loadProgress() {
    const saved = localStorage.getItem('botella_progress');
    if (saved) {
        const data = JSON.parse(saved);
        currentRiddleIndex = data.riddleIndex;
        score = data.score;
        currentAttempts = data.attempts;
        startTime = Date.now() - (data.time * 1000);
        
        document.getElementById('loadModal').classList.remove('active');
        showScreen('riddleScreen');
        showRiddle();
    }
}

// ===== INICIAR NUEVO JUEGO =====
function startNewGame() {
    localStorage.removeItem('botella_progress');
    document.getElementById('loadModal').classList.remove('active');
    currentRiddleIndex = 0;
    score = 0;
    currentAttempts = CONFIG.acertijosIntento;
    showScreen('startScreen');
}

// ===== REINICIAR JUEGO =====
function resetGame() {
    localStorage.removeItem('botella_progress');
    currentRiddleIndex = 0;
    score = 0;
    currentAttempts = CONFIG.acertijosIntento;
    startTime = null;
    location.reload();
}

// ===== RESPONSIVE =====
window.addEventListener('resize', () => {
    const canvas = document.getElementById('oceanCanvas');
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});
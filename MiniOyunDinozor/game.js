function dinoGame() {
    return {
        isGameRunning: false,
        isJumping: false,
        score: 0,
        highScore: localStorage.getItem('highScore') || 0,
        gameInterval: null,
        collisionInterval: null,
        selectedDifficulty: 'easy',
        difficulty: 'Kolay',
        speed: 2,
        audioContext: null,

        init() {
            this.updateDifficulty();
            this.initAudio();
        },

        initAudio() {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        },

        playSound(frequency, duration) {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            gainNode.gain.value = 0.1;
            
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            oscillator.stop(this.audioContext.currentTime + duration);
        },

        updateDifficulty() {
            switch(this.selectedDifficulty) {
                case 'easy':
                    this.difficulty = 'Kolay';
                    this.speed = 2;
                    break;
                case 'medium':
                    this.difficulty = 'Orta';
                    this.speed = 3;
                    break;
                case 'hard':
                    this.difficulty = 'Zor';
                    this.speed = 4;
                    break;
            }
        },

        handleKeyPress(event) {
            if (event.key === 'Enter' && !this.isGameRunning) {
                this.startGame();
                return;
            }
            
            if (!this.isGameRunning) return;
            
            if (event.key === 'w' || event.key === 'W' || 
                event.key === ' ' || event.key === 'ArrowUp' ||
                event.key === 'Enter') {
                this.jump();
            }
        },

        startGame() {
            this.isGameRunning = true;
            this.score = 0;
            this.updateDifficulty();
            
            // Skor artırma
            this.gameInterval = setInterval(() => {
                this.score++;
            }, 100);

            // Çarpışma kontrolü
            this.collisionInterval = setInterval(() => {
                const dino = document.querySelector('.dino');
                const cactus = document.querySelector('.cactus');
                
                if (this.checkCollision(dino, cactus)) {
                    this.gameOver();
                }
            }, 100);

            // Kaktüs hızını ayarla
            const cactus = document.querySelector('.cactus');
            cactus.style.animationDuration = `${this.speed}s`;
        },

        jump() {
            if (!this.isJumping) {
                this.isJumping = true;
                this.playSound(800, 0.1); // Zıplama sesi
                
                setTimeout(() => {
                    this.isJumping = false;
                }, 500);
            }
        },

        checkCollision(dino, cactus) {
            const dinoRect = dino.getBoundingClientRect();
            const cactusRect = cactus.getBoundingClientRect();

            return !(
                dinoRect.right < cactusRect.left ||
                dinoRect.left > cactusRect.right ||
                dinoRect.bottom < cactusRect.top ||
                dinoRect.top > cactusRect.bottom
            );
        },

        gameOver() {
            this.isGameRunning = false;
            clearInterval(this.gameInterval);
            clearInterval(this.collisionInterval);

            this.playSound(200, 0.5); // Oyun bitişi sesi

            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem('highScore', this.highScore);
            }

            setTimeout(() => {
                alert(`Oyun Bitti!\nSkorunuz: ${this.score}\nEn Yüksek Skor: ${this.highScore}`);
            }, 100);
        }
    }
} 
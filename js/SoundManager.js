class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.context = scene.sound.context;
        this.masterVolume = 0.3; // Keep sounds from being too loud
    }

    // Helper to create and play a tone
    playTone(frequency, duration, type = 'sine', volumeEnvelope = null) {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        const now = this.context.currentTime;

        // Apply volume envelope if provided, otherwise use simple envelope
        if (volumeEnvelope) {
            volumeEnvelope(gainNode, now);
        } else {
            gainNode.gain.setValueAtTime(this.masterVolume, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
        }

        oscillator.start(now);
        oscillator.stop(now + duration);
    }

    // Buggy destroyed - chirp sound (rising pitch)
    playBuggyDestroyed() {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = 'square';
        
        const now = this.context.currentTime;
        
        // Rising chirp
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.1);

        gainNode.gain.setValueAtTime(this.masterVolume * 0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    // Asteroid destroyed - boom sound (low to high)
    playAsteroidDestroyed() {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = 'sawtooth';
        
        const now = this.context.currentTime;
        
        // Boom effect - start low, quick rise, then decay
        oscillator.frequency.setValueAtTime(80, now);
        oscillator.frequency.exponentialRampToValueAtTime(40, now + 0.2);

        gainNode.gain.setValueAtTime(this.masterVolume * 0.6, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }

    // Atom collected - pulsing laser sound
    playAtomCollected() {
        if (!this.context) return;

        const now = this.context.currentTime;

        // Create multiple pulses
        for (let i = 0; i < 3; i++) {
            const delay = i * 0.08;
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.type = 'sine';
            
            // Descending tone for each pulse
            oscillator.frequency.setValueAtTime(800 - (i * 150), now + delay);
            oscillator.frequency.exponentialRampToValueAtTime(600 - (i * 150), now + delay + 0.08);

            gainNode.gain.setValueAtTime(this.masterVolume * 0.4, now + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.08);

            oscillator.start(now + delay);
            oscillator.stop(now + delay + 0.08);
        }
    }

    // Black hole - wooshing sound
    playBlackHole() {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = 'sawtooth';
        
        const now = this.context.currentTime;
        
        // Dramatic downward sweep
        oscillator.frequency.setValueAtTime(1200, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.5);

        gainNode.gain.setValueAtTime(this.masterVolume * 0.5, now);
        gainNode.gain.setValueAtTime(this.masterVolume * 0.5, now + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

        oscillator.start(now);
        oscillator.stop(now + 0.5);
    }

    // Bullet fire - quick blip
    playBulletFire() {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = 'square';
        
        const now = this.context.currentTime;
        
        oscillator.frequency.setValueAtTime(220, now);
        oscillator.frequency.exponentialRampToValueAtTime(180, now + 0.05);

        gainNode.gain.setValueAtTime(this.masterVolume * 0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        oscillator.start(now);
        oscillator.stop(now + 0.05);
    }

    // Power-up notification - pleasant chime
    playPowerUpNotification() {
        if (!this.context) return;

        const now = this.context.currentTime;

        // Two-tone chime
        [523.25, 659.25].forEach((freq, i) => {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.type = 'sine';
            oscillator.frequency.value = freq;

            const delay = i * 0.08;
            gainNode.gain.setValueAtTime(this.masterVolume * 0.3, now + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.2);

            oscillator.start(now + delay);
            oscillator.stop(now + delay + 0.2);
        });
    }

    // Player hit - quick negative sound
    playPlayerHit() {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        oscillator.type = 'sawtooth';
        
        const now = this.context.currentTime;
        
        // Harsh descending tone
        oscillator.frequency.setValueAtTime(300, now);
        oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.15);

        gainNode.gain.setValueAtTime(this.masterVolume * 0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        oscillator.start(now);
        oscillator.stop(now + 0.15);
    }

    // Game over - descending dramatic sound
    playGameOver() {
        if (!this.context) return;

        const now = this.context.currentTime;

        // Series of descending tones
        [400, 350, 300, 250, 200].forEach((freq, i) => {
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.context.destination);

            oscillator.type = 'triangle';
            oscillator.frequency.value = freq;

            const delay = i * 0.15;
            gainNode.gain.setValueAtTime(this.masterVolume * 0.4, now + delay);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.15);

            oscillator.start(now + delay);
            oscillator.stop(now + delay + 0.15);
        });
    }

    // Engine thrust - pulsed engine sound for player movement
    playEngineThrust() {
        if (!this.context) return;

        const oscillator = this.context.createOscillator();
        const gainNode = this.context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.context.destination);

        // Sawtooth wave creates a rough, engine-like quality
        oscillator.type = 'sawtooth';
        
        const now = this.context.currentTime;
        const duration = 0.08; // Short pulse so it can be called repeatedly
        
        // Slight frequency modulation to make it sound more organic
        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.linearRampToValueAtTime(135, now + duration);

        // Volume envelope - quick attack, quick decay
        gainNode.gain.setValueAtTime(this.masterVolume * 0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        oscillator.start(now);
        oscillator.stop(now + duration);
    }
}

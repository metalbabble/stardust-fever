class PowerUpManager {
    constructor(scene) {
        this.scene = scene;
        this.reset();
    }

    reset() {
        // Power-up multipliers and effects
        this.fireRateMultiplier = 1;
        this.bulletSpeedMultiplier = 1;
        this.bulletSizeMultiplier = 1;
        this.hasTripleShot = false;
        this.hasRearShot = false;
        this.turboLevel = 0;
    }

    grantRandomPowerUp() {
        const powerUps = [
            { name: 'Rapid-fire increase', frequency: 40, effect: () => this.rapidFireIncrease() },
            { name: 'Triple-shot', frequency: 10, effect: () => this.tripleShot() },
            { name: 'Bullet-size increase', frequency: 20, effect: () => this.bulletSizeIncrease() },
            { name: 'Rear shot', frequency: 20, effect: () => this.rearShot() },
            { name: 'Bullet speedup', frequency: 40, effect: () => this.bulletSpeedup() },
            { name: 'Black hole', frequency: 5, effect: () => this.blackHole() },
            { name: 'Turbo', frequency: 10, effect: () => this.turbo() },
            { name: 'Shield restore', frequency: 40, effect: () => this.shieldRestore() }
        ];

        // Calculate total weight
        const totalWeight = powerUps.reduce((sum, pu) => sum + pu.frequency, 0);
        
        // Random selection based on weight
        let random = Math.random() * totalWeight;
        let selectedPowerUp;
        
        for (const powerUp of powerUps) {
            random -= powerUp.frequency;
            if (random <= 0) {
                selectedPowerUp = powerUp;
                break;
            }
        }

        if (selectedPowerUp) {
            selectedPowerUp.effect();
            this.showPowerUpText(selectedPowerUp.name);
        }
    }

    rapidFireIncrease() {
        this.fireRateMultiplier *= 0.5//85; // Faster fire rate (lower delay)
    }

    tripleShot() {
        this.hasTripleShot = true;
    }

    bulletSizeIncrease() {
        this.bulletSizeMultiplier *= 1.15;
    }

    rearShot() {
        this.hasRearShot = true;
    }

    bulletSpeedup() {
        this.bulletSpeedMultiplier *= 1.15;
    }

    blackHole() {
        // Play wooshing sound
        this.scene.soundManager.playBlackHole();
        
        // Screen blink effect
        const overlay = this.scene.add.rectangle(
            0, 0,
            GameConfig.WIDTH, GameConfig.HEIGHT,
            0xffffff, 1
        );
        overlay.setOrigin(0);

        this.scene.tweens.add({
            targets: overlay,
            alpha: 0,
            duration: 300,
            repeat: 2,
            yoyo: true,
            onComplete: () => {
                overlay.destroy();
                // Destroy all enemies and asteroids
                this.scene.asteroids.children.entries.forEach(asteroid => {
                    if (asteroid.active) {
                        asteroid.destroy();
                        this.scene.addScore(10);
                    }
                });
                this.scene.buggies.children.entries.forEach(buggy => {
                    if (buggy.active) {
                        buggy.destroy();
                        this.scene.addScore(50);
                    }
                });
            }
        });
    }

    turbo() {
        this.turboLevel++;
        if (this.scene.player) {
            this.scene.player.increaseTurboSpeed();
        }
    }

    shieldRestore() {
        this.scene.restoreHealth(20);
    }

    showPowerUpText(powerUpName) {
        // Play notification sound
        this.scene.soundManager.playPowerUpNotification();
        
        const text = this.scene.add.text(
            GameConfig.WIDTH / 2,
            50,
            powerUpName,
            {
                font: 'bold 24px Courier New',
                fill: '#00ff00',
                stroke: '#000000',
                strokeThickness: 3
            }
        );
        text.setOrigin(0.5);

        this.scene.tweens.add({
            targets: text,
            alpha: 0,
            y: 30,
            duration: 2000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    getFireRate() {
        return GameConfig.BULLET_FIRE_RATE * this.fireRateMultiplier;
    }
}

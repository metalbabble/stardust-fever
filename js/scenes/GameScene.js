class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        // Load player sprite
        this.load.image('player', 'assets/player.gif');
        // Load buggy sprite
        this.load.image('buggy', 'assets/buggy.gif');
        

        //TODO: make less repetative
        // Load background music
        this.load.audio('bgm1', 'assets/bgm/m1.mp3');
        this.load.audio('bgm2', 'assets/bgm/m2.mp3');
        this.load.audio('bgm3', 'assets/bgm/m3.mp3');
        this.load.audio('bgm4', 'assets/bgm/m4.mp3');
        this.load.audio('bgm5', 'assets/bgm/m5.mp3');
        this.load.audio('bgm6', 'assets/bgm/m6.mp3');
        this.load.audio('bgm7', 'assets/bgm/m7.mp3');
        this.load.audio('bgm8', 'assets/bgm/m8.mp3');
        this.load.audio('bgm9', 'assets/bgm/m9.mp3');
        this.load.audio('bgm10', 'assets/bgm/m10.mp3');
    }

    create() {
        // Create starfield background
        this.createStarfield();

        // Start background music
        const bgmTracks = GameConfig.MUSIC_LIST; 
        const randomTrack = Phaser.Utils.Array.GetRandom(bgmTracks);
        this.bgMusic = this.sound.add(randomTrack, { loop: true, volume: 0.33 });
        this.bgMusic.play();

        // Initialize game state
        this.isGameOver = false;
        this.gameStartTime = this.time.now; // Track when game started

        // Initialize invincibility state
        this.isInvincible = false;
        this.invincibilityTimer = null;

        // Initialize health
        this.health = 100;
        this.maxHealth = 100;

        // Create health bar
        this.createHealthBar();

        // Initialize score
        this.score = 0;
        this.scoreText = this.add.text(
            GameConfig.WIDTH - 10,
            10,
            'SCORE: 0',
            {
                font: 'bold 16px Courier New',
                fill: '#00ff00'
            }
        );
        this.scoreText.setOrigin(1, 0);

        // Create player
        this.player = new Player(this, GameConfig.WIDTH / 2, GameConfig.HEIGHT / 2);

        // Create groups for game objects
        this.bullets = this.physics.add.group({
            classType: Bullet,
            maxSize: 50,
            runChildUpdate: true
        });

        this.asteroids = this.physics.add.group({
            runChildUpdate: true
        });

        this.buggies = this.physics.add.group({
            runChildUpdate: true
        });

        this.atoms = this.physics.add.group();

        // Setup collisions
        this.physics.add.overlap(this.bullets, this.asteroids, this.bulletHitAsteroid, null, this);
        this.physics.add.overlap(this.bullets, this.buggies, this.bulletHitBuggy, null, this);
        this.physics.add.overlap(this.player, this.atoms, this.playerCollectAtom, null, this);
        this.physics.add.overlap(this.player, this.asteroids, this.playerHitEnemy, null, this);
        this.physics.add.overlap(this.player, this.buggies, this.playerHitEnemy, null, this);

        // Setup controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Power-up manager
        this.powerUpManager = new PowerUpManager(this);

        // Sound manager
        this.soundManager = new SoundManager(this);

        // Shooting timer
        this.lastFireTime = 0;

        // Spawn timer
        this.spawnRate = GameConfig.SPAWN_RATE_INITIAL;
        this.lastSpawnTime = 0;

        // Atom spawn timer
        this.scheduleNextAtom();

        // Setup Enter key for game over
        this.input.keyboard.on('keydown-ENTER', () => {
            if (this.isGameOver) {
                this.scene.start('TitleScene');
            }
        });
    }

    update(time, delta) {
        // Don't update if game over
        if (this.isGameOver) {
            return;
        }

        // Update player
        this.player.update(this.cursors);

        // Auto-fire bullets
        if (time > this.lastFireTime + this.powerUpManager.getFireRate()) {
            this.fireBullets();
            this.lastFireTime = time;
        }

        // Spawn enemies
        if (time > this.lastSpawnTime + this.spawnRate) {
            this.spawnEnemy();
            this.lastSpawnTime = time;
            
            // Gradually increase difficulty
            if (this.spawnRate > GameConfig.SPAWN_RATE_MIN) {
                this.spawnRate -= GameConfig.SPAWN_RATE_DECREASE;
            }
        }
    }

    fireBullets() {
        const pm = this.powerUpManager;
        
        // Play bullet fire sound
        this.soundManager.playBulletFire();
        
        // Forward shots
        const angles = [0];
        if (pm.hasTripleShot) {
            angles.push(-20 * Math.PI / 180, 20 * Math.PI / 180);
        }

        angles.forEach(angleOffset => {
            const bullet = this.bullets.get();
            if (bullet) {
                bullet.fire(
                    this.player.x,
                    this.player.y,
                    this.player.rotation + angleOffset,
                    pm.bulletSpeedMultiplier,
                    pm.bulletSizeMultiplier
                );
            }
        });

        // Rear shot
        if (pm.hasRearShot) {
            const bullet = this.bullets.get();
            if (bullet) {
                bullet.fire(
                    this.player.x,
                    this.player.y,
                    this.player.rotation + Math.PI,
                    pm.bulletSpeedMultiplier,
                    pm.bulletSizeMultiplier
                );
            }
        }
    }

    spawnEnemy() {
        // Random edge position
        const edge = Math.floor(Math.random() * 4);
        let x, y;

        switch (edge) {
            case 0: // Top
                x = Math.random() * GameConfig.WIDTH;
                y = -20;
                break;
            case 1: // Right
                x = GameConfig.WIDTH + 20;
                y = Math.random() * GameConfig.HEIGHT;
                break;
            case 2: // Bottom
                x = Math.random() * GameConfig.WIDTH;
                y = GameConfig.HEIGHT + 20;
                break;
            case 3: // Left
                x = -20;
                y = Math.random() * GameConfig.HEIGHT;
                break;
        }

        // Check if game has been running for at least 15 seconds
        const gameTime = this.time.now - this.gameStartTime;
        const canSpawnXL = gameTime >= 15000;

        // 70% chance asteroid, 30% buggy
        if (Math.random() < GameConfig.ASTEROID_SPAWN_WEIGHT) {
            // 20% chance for XL asteroid if enough time has passed
            if (canSpawnXL && Math.random() < 0.2) {
                const asteroidXL = new AsteroidXL(this, x, y);
                this.asteroids.add(asteroidXL);
                asteroidXL.init();
            } else {
                const asteroid = new Asteroid(this, x, y);
                this.asteroids.add(asteroid);
                asteroid.init();
            }
        } else {
            const buggy = new Buggy(this, x, y, this.player);
            this.buggies.add(buggy);
        }
    }

    scheduleNextAtom() {
        const delay = Phaser.Math.Between(
            GameConfig.ATOM_SPAWN_INTERVAL_MIN,
            GameConfig.ATOM_SPAWN_INTERVAL_MAX
        );

        this.time.delayedCall(delay, () => {
            this.spawnAtom();
            this.scheduleNextAtom();
        });
    }

    spawnAtom() {
        const x = Phaser.Math.Between(50, GameConfig.WIDTH - 50);
        const y = Phaser.Math.Between(50, GameConfig.HEIGHT - 50);
        const atom = new Atom(this, x, y);
        this.atoms.add(atom);
    }

    bulletHitAsteroid(bullet, asteroid) {
        bullet.setActive(false);
        bullet.setVisible(false);
        
        // Check if this is an XL asteroid
        if (asteroid.isXL) {
            // Spawn 2 regular asteroids at the XL's position
            for (let i = 0; i < 2; i++) {
                const newAsteroid = new Asteroid(this, asteroid.x, asteroid.y);
                this.asteroids.add(newAsteroid);
                newAsteroid.init();
            }
            this.addScore(5);
        } else {
            this.addScore(10);
        }
        
        asteroid.destroy();
        this.soundManager.playAsteroidDestroyed();
    }

    bulletHitBuggy(bullet, buggy) {
        bullet.setActive(false);
        bullet.setVisible(false);
        buggy.destroy();
        this.soundManager.playBuggyDestroyed();
        this.addScore(50);
    }

    playerCollectAtom(player, atom) {
        atom.collect();
        this.soundManager.playAtomCollected();
        this.addScore(100);
        this.powerUpManager.grantRandomPowerUp();
    }

    playerHitEnemy(player, enemy) {
        // Check if player is invincible
        if (this.isInvincible) {
            return;
        }

        // Reduce health
        this.health -= 10;
        this.updateHealthBar();
        this.soundManager.playPlayerHit();

        // Set player as invincible
        this.isInvincible = true;
        player.setAlpha(0.5);

        // Clear any existing invincibility timer
        if (this.invincibilityTimer) {
            this.invincibilityTimer.remove();
        }

        // Set timer to end invincibility
        this.invincibilityTimer = this.time.delayedCall(GameConfig.INVINCIBILITY_DURATION, () => {
            this.isInvincible = false;
            if (player.active) {
                player.setAlpha(1);
            }
            this.invincibilityTimer = null;
        });

        // Check for game over
        if (this.health <= 0) {
            this.gameOver();
        }
    }

    addScore(points) {
        this.score += points;
        this.scoreText.setText('SCORE: ' + this.score);
    }

    createParticles(x, y, color) {
        // Create simple particle effect
        for (let i = 0; i < 10; i++) {
            const particle = this.add.rectangle(x, y, 3, 3, color);
            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 100;
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                duration: 500,
                onComplete: () => particle.destroy()
            });
        }
    }

    createHealthBar() {
        // Health bar label
        this.healthLabel = this.add.text(
            10,
            10,
            'SHIELD %',
            {
                font: 'bold 16px Courier New',
                fill: '#00ff00'
            }
        );

        // Health bar background
        this.healthBarBg = this.add.rectangle(
            100,
            18,
            200,
            20,
            0x333333
        );
        this.healthBarBg.setOrigin(0, 0.5);

        // Health bar fill
        this.healthBarFill = this.add.rectangle(
            100,
            18,
            200,
            20,
            0x00ff00
        );
        this.healthBarFill.setOrigin(0, 0.5);

        // Health bar border
        this.healthBarBorder = this.add.rectangle(
            100,
            18,
            200,
            20
        );
        this.healthBarBorder.setOrigin(0, 0.5);
        this.healthBarBorder.setStrokeStyle(2, 0xffffff);
    }

    updateHealthBar() {
        const healthPercent = Math.max(0, this.health / this.maxHealth);
        this.healthBarFill.width = 200 * healthPercent;

        // Change color based on health
        if (healthPercent > 0.5) {
            this.healthBarFill.setFillStyle(0x00ff00);
        } else if (healthPercent > 0.25) {
            this.healthBarFill.setFillStyle(0xffff00);
        } else {
            this.healthBarFill.setFillStyle(0xff0000);
        }
    }

    restoreHealth(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.updateHealthBar();
    }

    gameOver() {
        this.isGameOver = true;
        this.soundManager.playGameOver();
        
        // Stop background music
        if (this.bgMusic) {
            this.bgMusic.stop();
        }

        // Stop all moving objects
        this.asteroids.children.entries.forEach(asteroid => {
            if (asteroid.body) {
                asteroid.body.setVelocity(0, 0);
            }
        });
        this.buggies.children.entries.forEach(buggy => {
            if (buggy.body) {
                buggy.body.setVelocity(0, 0);
            }
        });
        this.bullets.children.entries.forEach(bullet => {
            if (bullet.body) {
                bullet.body.setVelocity(0, 0);
            }
        });

        // Hide player
        this.player.setVisible(false);

        // Hide HUD elements (health and score)
        if (this.healthLabel) this.healthLabel.setVisible(false);
        if (this.healthBarBg) this.healthBarBg.setVisible(false);
        if (this.healthBarFill) this.healthBarFill.setVisible(false);
        if (this.healthBarBorder) this.healthBarBorder.setVisible(false);
        if (this.scoreText) this.scoreText.setVisible(false);

        // Create semi-transparent overlay
        const overlay = this.add.rectangle(
            0,
            0,
            GameConfig.WIDTH,
            GameConfig.HEIGHT,
            0x000000,
            0.7
        );
        overlay.setOrigin(0);

        // Game Over text
        const gameOverText = this.add.text(
            GameConfig.WIDTH / 2,
            GameConfig.HEIGHT / 2 - 50,
            'GAME OVER',
            {
                font: 'bold 72px Courier New',
                fill: '#ff0000',
                stroke: '#ffffff',
                strokeThickness: 4
            }
        );
        gameOverText.setOrigin(0.5);

        // Final score text
        const finalScoreText = this.add.text(
            GameConfig.WIDTH / 2,
            GameConfig.HEIGHT / 2 + 30,
            'Final Score: ' + this.score,
            {
                font: 'bold 32px Courier New',
                fill: '#ffffff'
            }
        );
        finalScoreText.setOrigin(0.5);

        // Continue prompt
        const continueText = this.add.text(
            GameConfig.WIDTH / 2,
            GameConfig.HEIGHT / 2 + 80,
            'Press ENTER to continue',
            {
                font: '24px Courier New',
                fill: '#00ff00'
            }
        );
        continueText.setOrigin(0.5);

        // Make continue text blink
        this.tweens.add({
            targets: continueText,
            alpha: 0,
            duration: 600,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    createStarfield() {
        const graphics = this.add.graphics();
        graphics.fillStyle(0x001144, 1);
        graphics.fillRect(0, 0, GameConfig.WIDTH, GameConfig.HEIGHT);

        // Add stars
        for (let i = 0; i < 200; i++) {
            const x = Phaser.Math.Between(0, GameConfig.WIDTH);
            const y = Phaser.Math.Between(0, GameConfig.HEIGHT);
            const brightness = Phaser.Math.FloatBetween(0.3, 1);
            graphics.fillStyle(Phaser.Display.Color.GetColor(
                Math.floor(192 * brightness),
                Math.floor(192 * brightness),
                Math.floor(192 * brightness)
            ), 1);
            graphics.fillRect(x, y, 1, 1);
        }
    }
}

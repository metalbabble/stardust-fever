class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Use the preloaded player.gif image
        super(scene, x, y, 'player');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setDamping(true);
        this.setDrag(0.99);
        this.setMaxVelocity(300);
        this.setCollideWorldBounds(false);

        this.rotationSpeed = GameConfig.PLAYER_ROTATION_SPEED;
        this.moveSpeed = GameConfig.PLAYER_MOVE_SPEED;
        
        // Store reference to scene
        this.gameScene = scene;

        // trail throttle counter (spawn every couple frames)
        this.trailFrameCounter = 0;
    }

    update(cursors) {
        // Rotation
        if (cursors.left.isDown) {
            this.rotation -= this.rotationSpeed;
        } else if (cursors.right.isDown) {
            this.rotation += this.rotationSpeed;
        }

        // Forward movement
        const isThrustingNow = cursors.up.isDown;
        if (isThrustingNow) {
            this.scene.physics.velocityFromRotation(
                this.rotation,
                this.moveSpeed,
                this.body.acceleration
            );
            
            // engine sound while thrusting
            if (this.gameScene.soundManager) {
                this.gameScene.soundManager.playEngineThrust();
            }

            // spawn a little rainbow trail particle behind the ship (throttled)
            if (this.gameScene && typeof this.gameScene.createTrail === 'function') {
                this.trailFrameCounter = (this.trailFrameCounter + 1) % 2;
                if (this.trailFrameCounter === 0) {
                    this.gameScene.createTrail(this.x, this.y);
                }
            }
        } else {
            this.setAcceleration(0);
        }

        // Wrap around screen edges
        this.wrapAround();
    }

    wrapAround() {
        if (this.x < 0) {
            this.x = GameConfig.WIDTH;
        } else if (this.x > GameConfig.WIDTH) {
            this.x = 0;
        }

        if (this.y < 0) {
            this.y = GameConfig.HEIGHT;
        } else if (this.y > GameConfig.HEIGHT) {
            this.y = 0;
        }
    }

    increaseTurboSpeed() {
        this.rotationSpeed *= 1.1;
        this.moveSpeed *= 1.1;
    }
}

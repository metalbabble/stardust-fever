class AsteroidXL extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Generate a random asteroid texture
        const textureKey = 'asteroidXL_' + Math.random();
        const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
        
        // Random pastel color
        const colors = [0xffb3ba, 0xffdfba, 0xffffba, 0xbaffc9, 0xbae1ff, 0xe0bbff];
        const color = colors[Math.floor(Math.random() * colors.length)];
        graphics.fillStyle(color);
        graphics.lineStyle(3, 0x888888);

        // Create jagged polygon - larger than regular asteroid
        const points = [];
        const numPoints = 10;
        const radius = 40; // Larger radius (regular is 20)
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const r = radius + Phaser.Math.Between(-8, 8);
            points.push({
                x: Math.cos(angle) * r + 50,
                y: Math.sin(angle) * r + 50
            });
        }
        
        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        graphics.fillPath();
        graphics.strokePath();
        
        graphics.generateTexture(textureKey, 100, 100);
        graphics.destroy();

        super(scene, x, y, textureKey);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(false);
        
        // Slow rotation
        this.rotationSpeed = Phaser.Math.FloatBetween(-0.02, 0.02);
        
        // Flag to identify this as an XL asteroid
        this.isXL = true;
    }

    init() {
        // Set velocity towards center with some randomness
        const centerX = GameConfig.WIDTH / 2;
        const centerY = GameConfig.HEIGHT / 2;
        const angleToCenter = Math.atan2(centerY - this.y, centerX - this.x);
        // Add some randomness to the angle (-30 to +30 degrees)
        const randomOffset = (Math.random() - 0.5) * Math.PI / 3;
        const finalAngle = angleToCenter + randomOffset;
        const speed = GameConfig.ASTEROID_SPEED * 0.8; // Slightly slower than regular
        
        this.scene.physics.velocityFromRotation(
            finalAngle,
            speed,
            this.body.velocity
        );
    }

    update() {
        this.rotation += this.rotationSpeed;
    
        // Wrap around screen edges (larger bounds due to larger size)
        if (this.x < -50) {
            this.x = GameConfig.WIDTH + 50;
        } else if (this.x > GameConfig.WIDTH + 50) {
            this.x = -50;
        }

        if (this.y < -50) {
            this.y = GameConfig.HEIGHT + 50;
        } else if (this.y > GameConfig.HEIGHT + 50) {
            this.y = -50;
        }
    }

    destroy() {
        // Create particle effect (only if scene is still active)
        if (this.scene && this.scene.createParticles) {
            this.scene.createParticles(this.x, this.y, 0xffaa00);
        }
        
        super.destroy();
    }
}

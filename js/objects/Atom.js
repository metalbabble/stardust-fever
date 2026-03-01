class Atom extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        // Create atom texture if it doesn't exist
        if (!scene.textures.exists('atom')) {
            const graphics = scene.make.graphics({ x: 0, y: 0, add: false });
            
            // Draw atom symbol
            graphics.lineStyle(2, 0x00ffff);
            
            // Nucleus
            graphics.fillStyle(0x00ffff);
            graphics.fillCircle(15, 15, 4);
            
            // Electron orbits
            graphics.strokeEllipse(15, 15, 20, 10);
            graphics.save();
            graphics.translateCanvas(15, 15);
            graphics.rotateCanvas(Math.PI / 3);
            graphics.strokeEllipse(0, 0, 20, 10);
            graphics.restore();
            graphics.save();
            graphics.translateCanvas(15, 15);
            graphics.rotateCanvas(-Math.PI / 3);
            graphics.strokeEllipse(0, 0, 20, 10);
            graphics.restore();
            
            graphics.generateTexture('atom', 30, 30);
            graphics.destroy();
        }

        super(scene, x, y, 'atom');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(false);
        
        // Make it pulse/glow
        scene.tweens.add({
            targets: this,
            scale: 1.3,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    collect() {
        this.destroy();
    }
}

import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        // Lấy điểm số từ dữ liệu toàn cục
        const score = this.registry.get("score");

        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(512, 384, "background").setAlpha(0.5);

        this.add
            .text(380, 200, "Game Over: " + score, {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.add
            .text(380, 300, "Play again", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setDepth(100)
            .setOrigin(0.5)
            .setInteractive()
            .on("pointerup", () => {
                //đổi scene
                    this.scene.start("Game");
            });

        // Tạo hiệu ứng làm sáng dần khi vào cảnh
        this.fadeIn();
        EventBus.emit("current-scene-ready", this);
    }
    fadeIn() {
        this.cameras.main.setAlpha(0.8);
        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 1000,
            ease: "Linear",
        });
    }

  
}


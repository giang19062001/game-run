import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        // Lấy điểm số từ dữ liệu toàn cục
        const score = this.registry.get("score");

        this.add
            .text(520, 300, "Game Over: " + score, {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.cameras.main.setBackgroundColor("#ffffff");
        this.add
            .image(405, 355, "play_btn")
            .setOrigin(0, 0)
            .setInteractive()
            .on("pointerup", () => {
                //đổi scene
                this.scene.start("Game");
            });
        EventBus.emit("current-scene-ready", this);
        // Tạo hiệu ứng làm sáng dần khi vào cảnh
        this.fadeIn();
        EventBus.emit("current-scene-ready", this);
    }
    fadeIn() {
        this.cameras.main.setAlpha(0.7);
        this.tweens.add({
            targets: this.cameras.main,
            alpha: 1,
            duration: 1000,
            ease: "Linear",
        });
    }
}


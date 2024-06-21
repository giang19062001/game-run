import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    logoTween;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.cameras.main.setBackgroundColor('#ffffff')
        this.add
        .image(405, 335, "play_btn")
        .setOrigin(0, 0)
        .setInteractive()
        .on("pointerup", () => {
            //đổi scene
            this.scene.start("Game");
        });
        EventBus.emit("current-scene-ready", this);
    }
}


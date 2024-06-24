import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    logoTween;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.add.image(550, 385, "bg_game");
        this.add.image(145, 65, "mix").setDisplaySize(280,120)
        // this.cameras.main.setBackgroundColor('#ffffff')
        this.add
        .image(390, 335, "play_btn")
        .setOrigin(0, 0)
        .setInteractive()
        .on("pointerup", () => {
            //đổi scene
            this.scene.start("Game");
        });
        EventBus.emit("current-scene-ready", this);
    }
}


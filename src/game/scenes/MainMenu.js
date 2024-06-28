import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    logoTween;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.add.image(512, 385, "bg_game")

        this.add.image(120, 65, "vhu_be").setDisplaySize(200,80)
        // this.cameras.main.setBackgroundColor('#ffffff')
        this.add
        .image(370, 260, "play_btn")
        .setOrigin(0, 0)
        .setInteractive()
        .on("pointerup", () => {
            //đổi scene
            this.scene.start("Game");
        });
        this.add
        .image(370, 370, "option_btn")
        .setOrigin(0, 0)
        .setInteractive()
        .on("pointerup", () => {
            //đổi scene
            this.scene.start("OptionScene");
        });
        EventBus.emit("current-scene-ready", this);
    }
}


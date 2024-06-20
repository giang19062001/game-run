import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class MainMenu extends Scene {
    logoTween;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.add.image(512, 384, "background");
        this.logo = this.add.image(380, 200, "logo").setDepth(100);

        this.add
            .text(380, 300, "Play game", {
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

        EventBus.emit("current-scene-ready", this);
    }


}


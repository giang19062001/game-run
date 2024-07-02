import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class OptionScene extends Scene {
    logoTween;

    constructor() {
        super("OptionScene");
    }

    create() {
        this.add.image(512, 385, "background");
        this.add.image(65, 50, "right").setScale(0.7).setDepth(4);
        this.add.text(150, 30, "Tiến lên phía trước  ", {
            fontFamily: "Arial Black",
            fontSize: 24,
            color: "#ffffff",
            align: "center",
            stroke: "#000000",
            strokeThickness: 5,
        });
        this.add.image(65, 120, "left").setScale(0.7).setDepth(4);
        this.add.text(150, 100, "Lùi về sau  ", {
            fontFamily: "Arial Black",
            fontSize: 24,
            color: "#ffffff",
            align: "center",
            stroke: "#000000",
            strokeThickness: 5,
        });
        this.add.image(65, 190, "up").setScale(0.7).setDepth(4);
        this.add.text(150, 170, "Di chuyển lên làn đường trên  ", {
            fontFamily: "Arial Black",
            fontSize: 24,
            color: "#ffffff",
            align: "center",
            stroke: "#000000",
            strokeThickness: 5,
        });
        this.add.image(65, 260, "down").setScale(0.7).setDepth(4);
        this.add.text(150, 250, "Di chuyển lên làn đường dưới  ", {
            fontFamily: "Arial Black",
            fontSize: 24,
            color: "#ffffff",
            align: "center",
            stroke: "#000000",
            strokeThickness: 5,
        });
        this.add.image(630, 50, "space").setScale(0.9).setDepth(4);
        this.add.text(700, 35, "Nhảy qua vỏ chuối ", {
            fontFamily: "Arial Black",
            fontSize: 24,
            color: "#ffffff",
            align: "center",
            stroke: "#000000",
            strokeThickness: 5,
        });
        this.add.image(630, 110, "shift").setScale(0.9).setDepth(4);
        this.add.text(700, 90, "Lướt qua thanh rào chắn", {
            fontFamily: "Arial Black",
            fontSize: 24,
            color: "#ffffff",
            align: "center",
            stroke: "#000000",
            strokeThickness: 5,
        });

        this.add.image(65, 380, "headache").setScale(1.2).setDepth(4);
        this.add.text(
            150,
            350,
            "Thua nếu vấp vỏ chuối hoặc đụng thanh rào chắn",
            {
                fontFamily: "Arial Black",
                fontSize: 24,
                color: "#ffffff",
                align: "center",
                stroke: "#000000",
                strokeThickness: 5,
            }
        );
        this.add.image(65, 480, "fall").setScale(1.2).setDepth(4);
        this.add.text(150, 450, "Thua nếu bị mưa đá rơi vào đầu", {
            fontFamily: "Arial Black",
            fontSize: 24,
            color: "#ffffff",
            align: "center",
            stroke: "#000000",
            strokeThickness: 5,
        });
        this.add.image(65, 590, "gift").setScale(0.4).setDepth(4);
        this.add.text(150, 570, "Trở nên bất tử trong thời gian ngắn", {
            fontFamily: "Arial Black",
            fontSize: 24,
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 5,
            align: "center",
        });
        this.add
            .image(830, 680, "back_btn")
            .setDisplaySize(200, 100)
            .setOrigin(0, 0)
            .setInteractive()
            .on("pointerup", () => {
                //đổi scene
                this.scene.start("MainMenu");
            });
        EventBus.emit("current-scene-ready", this);
    }
}

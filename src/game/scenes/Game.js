import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    constructor() {
        super("Game");
        this.countStart = 3;
        this.countStartText = null;
        this.countStartTextEvent = null;
        this.isCar = false;
        this.carText = "";
        this.player = null;
        this.street = null;
        this.city = null;
        this.cursors = null;
        this.obstacles = null;
        this.gifts = null;
        this.score = 0;
        this.scoreText = 5;
        this.pressKey = false;
        this.top = false;
        this.bottom = true;
        this.obstacleTimer = null;
        this.GameOver = false;
    }

    preload() {
        this.add.image(512, 0, "background").setAlpha(0.5);
        // this.add
        //     .text(65, 740, "Quay về", {
        //         fontFamily: "Arial Black",
        //         fontSize: 20,
        //         color: "#ffffff",
        //         stroke: "#000000",
        //         strokeThickness: 8,
        //         align: "center",
        //     })
        //     .setOrigin(0.5)
        //     .setDepth(100)
        //     .setInteractive()
        //     .on("pointerup", () => {
        //         //đổi scene
        //         this.scene.start("MainMenu");
        //     });
        this.load.image("street", "assets/street.jpg");
        this.load.image("city", "assets/city.jpg");
        this.load.image("gift", "assets/gift.png");

        this.load.image("obstacle", "assets/bomb.png").sets;

        this.load.atlas(
            "player",
            "assets/dute_spritesheet.png",
            "assets/dute_sprites.json"
        );
        this.load.atlas(
            "car",
            "assets/car_spritesheet.png",
            "assets/car_sprites.json"
        );
    }

    countStartGame() {
        this.countStartTextEvent.delay = 1000; //set lại deplay

        if (this.countStart == -1) {
            this.countStartTextEvent.remove(false); // ngưng loop đếm bắt đầu game
            this.countStartText.destroy();
            return;
        }

        if (!this.countStartText) {
            this.countStartText = this.add
                .text(500, 330, this.countStart, {
                    fontFamily: "Arial Black",
                    fontSize: 72,
                    color: "#ffffff",
                    stroke: "#000000",
                    strokeThickness: 8,
                    align: "center",
                })
                .setDepth(1);
        } else {
            this.countStartText.destroy();

            if (this.countStart != 0) {
                this.countStartText = this.add
                    .text(500, 330, this.countStart, {
                        fontFamily: "Arial Black",
                        fontSize: 72,
                        color: "#ffffff",
                        stroke: "#000000",
                        strokeThickness: 8,
                        align: "center",
                    })
                    .setDepth(1);
            }

            this.countStartText._text = this.countStart;
        }

        this.countStart -= 1;
    }
    create() {
        // tạo bộ đếm bắt đầu chơi

        this.countStartTextEvent = this.time.addEvent({
            delay: 100, // cho bắt đầu ngay
            callback: this.countStartGame,
            callbackScope: this,
            loop: true,
        });

        // tạo nhân vật
        this.player = this.physics.add.sprite(50, 700, "player");
        this.player.setScale(0.3);
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: "run",
            frames: [
                { key: "player", frame: "run1" },
                { key: "player", frame: "run2" },
                { key: "player", frame: "run3" },
            ],
            frameRate: 10,
            repeat: -1,
        });
        this.player.setDepth(1); // Đặt depth cao hơn (ví dụ: 1)
        this.player.anims.play("run");
        this.player.setVisible(false);

        // thêm nút di chuyển lên xuống cho nhân vật
        this.cursors = this.input.keyboard.createCursorKeys();

        //tạo chướng ngại vật
        this.obstacles = this.physics.add.group();

        // tạo hàm xử  lí khi nhân vật dụng chướng ngại vật
        this.physics.add.collider(
            this.player,
            this.obstacles,
            this.hitObstacle,
            null,
            this
        );
        // bộ lặp tạo chướng ngại vật
        this.obstacleTimer = this.time.addEvent({
            delay: 2000,
            callback: this.addObstacle,
            callbackScope: this,
            loop: true,
        });

        //tạo vật phẩm bí ẩn
        this.gifts = this.physics.add.group();

        // tạo hàm xử  lí khi nhân vật dụng  vật phẩm bí ẩn
        this.physics.add.overlap(
            this.player,
            this.gifts,
            this.hitGift,
            null,
            this
        );
        // bộ lặp tạo  vật phẩm bí ẩn
        this.obstacleTimer = this.time.addEvent({
            delay: 10000,
            callback: this.addGift,
            callbackScope: this,
            loop: true,
        });

        //điểm
        this.scoreText = this.add
            .text(0, 0, "score: 0", {
                fontSize: "32px",
                fill: "#000",
                padding: {
                    x: 5,
                    y: 5,
                },
                backgroundColor: "#ffffff", // Màu nền, ở đây là màu trắng
            })
            .setDepth(1);

        //tạo mây
        this.city = this.add.tileSprite(512, 415, 1500, 305, "city");
        this.city.setOrigin(0.5, 0.5);
        this.city.setDepth(0);

        //tạo đường
        this.street = this.add.tileSprite(512, 665, 1500, 205, "street");
        this.street.setOrigin(0.5, 0.5);

        // Đặt vật lý cho street
        this.physics.add.existing(this.street, true);
        // Thiết lập va chạm giữa nhân vật và street
        this.physics.add.collider(this.player, this.street);
        this.street.setDepth(0); // Đặt depth thấp hơn (ví dụ: 0)

        this.input.keyboard.on("keydown-UP", () => {
            console.log("UP1");
            this.pressKey = true;
        });
        this.input.keyboard.on("keydown-DOWN", () => {
            console.log("DOWN1");
            this.pressKey = true;
        });
    }

    update() {
        if (this.GameOver) {
            return; // thua thì dừng
        }
        if (this.countStart == -1) {
            this.player.setVisible(true);
            // Di chuyển background để tạo cảm giác đang chạy
            this.street.tilePositionX += 2;
            // Di chuyển background để tạo cảm giác đang chạy
            this.city.tilePositionX += 2;
            if (this.cursors.up.isDown && this.pressKey) {
                console.log("UP2");
                this.pressKey = false;
                //đi lên
                if (this.bottom) {
                    this.top = true;
                    this.bottom = false;
                    this.player.setVelocityY(-5100);
                }
            } else if (this.cursors.down.isDown && this.pressKey) {
                console.log("DOWN2");
                this.pressKey = false;
                // đi xuống
                if (this.top) {
                    this.top = false;
                    this.bottom = true;
                    this.player.setVelocityY(5100);
                }
            } else {
                this.player.setVelocityY(0);
            }

            // Update score
            this.score += 1;
            this.scoreText.setText("score: " + this.score);
        }
    }

    addObstacle() {
        if (this.countStart == -1) {
            const obstacleY = Phaser.Math.RND.pick([605, 705]);
            const obstacle = this.obstacles.create(750, obstacleY, "obstacle");
            obstacle.setVelocityX(-200);
            obstacle.setScale(0.2);

            // Automatically destroy obstacle when it goes out of bounds
            obstacle.setCollideWorldBounds(true); // bật kiểm tra xem nó có va chạm với ranh giới của thế giới hay không
            obstacle.body.onWorldBounds = true; //Kích hoạt sự kiện khi đối tượng đi ra ngoài ranh giới của thế giới.
            obstacle.body.world.on("worldbounds", (body) => {
                if (body.gameObject === obstacle) {
                    obstacle.destroy();
                }
            });
        }
    }

    addGift() {
        if (this.countStart == -1) {
            const giftY = Phaser.Math.RND.pick([605, 705]);
            const gift = this.gifts.create(950, giftY, "gift");
            gift.setVelocityX(-200);
            gift.setScale(0.2);

            gift.setCollideWorldBounds(true); // bật kiểm tra xem nó có va chạm với ranh giới của thế giới hay không
            gift.body.onWorldBounds = true; //Kích hoạt sự kiện khi đối tượng đi ra ngoài ranh giới của thế giới.
            gift.body.world.on("worldbounds", (body) => {
                if (body.gameObject === gift) {
                    gift.destroy();
                }
            });
        }
    }

    hitObstacle(player, obstacle) {
        if (!this.isCar) {
            this.physics.pause();
            this.player.anims.destroy();
            this.GameOver = true;
            this.obstacleTimer.remove(); // những function được gọi trước (addObstacle) đó sẽ bị remove
            player.setTint(0xff0000);
            this.scoreText.setText("Score: " + this.score);
        } else {
            obstacle.disableBody(true, true); // ẩn gift đụng trúng
            this.obstacleTimer.remove(); // những function được gọi trước (addObstacle) đó sẽ bị remove
        }
    }

    hitGift(player, gift) {
        gift.disableBody(true, true); // ẩn gift đụng trúng
        this.player.setTexture("car", "car1"); //car1 tên frame trong JSON
        this.player.setScale(0.15);
        this.isCar = true; // biến thành xe
        this.player.anims.stop(); // Dừng animation hiện tại nếu đang chạy
        this.player.anims.remove("run"); // Xóa animation 'run' của player
        //thời gian xe
        this.carText = this.add
            .text(860, 0, "Time: " +  5, {
                fontSize: "32px",
                fill: "#000",
                padding: {
                    x: 5,
                    y: 5,
                },
                backgroundColor: "#ffffff", // Màu nền, ở đây là màu trắng
            })
            .setDepth(1);
        this.time.delayedCall(
            1000,
            () => {
                this.carText.setText("Time: " + 4);
            },
            [],
            this
        );
        this.time.delayedCall(
            2000,
            () => {
                this.carText.setText("Time: " + 3);
            },
            [],
            this
        );
        this.time.delayedCall(
            3000,
            () => {
                this.carText.setText("Time: " + 2);
            },
            [],
            this
        );
        this.time.delayedCall(
            4000,
            () => {
                this.carText.setText("Time: " + 1);
            },
            [],
            this
        );
        this.time.delayedCall(
            5000,
            () => {
                this.carText.destroy();
                this.player.setTexture("player", "player"); // Chuyển lại sử dụng player1 và frame 'run'
                this.isCar = false; // biến thành  người lại
                this.player.anims.stop(); // Dừng animation hiện tại nếu đang chạy
                this.player.setScale(0.3);
                this.anims.create({
                    key: "run",
                    frames: [
                        { key: "player", frame: "run1" },
                        { key: "player", frame: "run2" },
                        { key: "player", frame: "run3" },
                    ],
                    frameRate: 10,
                    repeat: -1,
                });
                this.player.anims.play("run");
            },
            [],
            this
        );
    }
}


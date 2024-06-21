import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class Game extends Scene {
    constructor() {
        super("Game");
        this.countStart = 3;
        this.countStartText = null;
        this.countStartTextEvent = null;
        this.unDied = false
        this.isCar = false;
        this.isSki = false;
        this.isJump = false;
        this.carText = null;
        this.graphicCarText = null;
        this.player = null;
        this.street = null;
        this.city = null;
        this.weather = null;
        this.river = null;
        this.cursors = null;
        this.obstacles = null;
        this.obstaclesSky = null;
        this.obstaclesRoad = null;
        this.gifts = null;
        this.score = 0;
        this.scoreText = 5;
        this.pressKey = false;
        this.top = false;
        this.bottom = true;
        this.obstacleTimer = null;
        this.obstacleTimerSky = null;
        this.obstaclesTimerRoad = null;
        this.objectSpeed = 200; // Vận tốc ban đầu của chướng ngại vật, gift
        this.giftTimer = null;
        this.GameOver = false;
    }

    preload() {
        this.load.video("rain", "assets/rain.mp4", "loadeddata", false, true);

        this.load.image("background", "assets/bg.png");
        this.load.image("street", "assets/street.jpg");
        this.load.image("city", "assets/city-empty.png");
        this.load.image("gift", "assets/gift.png");
        this.load.image("obstacle", "assets/banana.png");
        this.load.image("obstacleSky", "assets/water.png");
        this.load.image("obstaclesRoad", "assets/road.png");
        this.load.audio("skiMusic", "assets/ski.mp3");
        this.load.audio("stunnedMusic", "assets/stunned.mp3");
        this.load.audio("jumpMusic", "assets/jump.mp3");
        this.load.audio("fallMusic", "assets/fall.mp3");
        this.load.audio("backgroundMusic", "assets/background.mp3");
        this.load.atlas(
            "river",
            "assets/river_spritesheet.png",
            "assets/river_sprites.json"
        );
        this.load.atlas(
            "player",
            "assets/player_spritesheet.png",
            "assets/player_sprites.json"
        );
        this.load.atlas(
            "car",
            "assets/car_spritesheet.png",
            "assets/car_sprites.json"
        );
    }

    create() {
        //reset lại nếu play again
        this.countStart = 3;
        this.countStartText = null;
        this.countStartTextEvent = null;
        this.unDied = false
        this.isCar = false;
        this.isSki = false;
        this.isJump = false;
        this.carText = null;
        this.graphicCarText = null;
        this.player = null;
        this.street = null;
        this.city = null;
        this.weather = null;
        this.river = null;
        this.cursors = null;
        this.obstacles = null;
        this.obstaclesSky = null;
        this.obstaclesRoad = null;
        this.gifts = null;
        this.score = 0;
        this.scoreText = 5;
        this.pressKey = false;
        this.top = false;
        this.bottom = true;
        this.obstacleTimer = null;
        this.obstacleTimerSky = null;
        this.obstaclesTimerRoad = null;
        this.objectSpeed = 200; // Vận tốc ban đầu của chướng ngại vật, gift
        this.giftTimer = null;
        this.GameOver = false;

        this.add.image(0, 0, "background").setOrigin(0, 0);
        this.backgroundMusic = this.sound.add("backgroundMusic", {
            loop: true,
            volume: 0.5,
        });
        this.skiMusic = this.sound.add("skiMusic");
        this.stunnedMusic = this.sound.add("stunnedMusic");
        this.fallMusic = this.sound.add("fallMusic");
        this.jumpMusic = this.sound.add("jumpMusic");

        // tạo bộ đếm bắt đầu chơi

        this.countStartTextEvent = this.time.addEvent({
            delay: 100, // cho bắt đầu ngay
            callback: this.countStartGame,
            callbackScope: this,
            loop: true,
        });

        // tạo nhân vật
        this.player = this.physics.add.sprite(50, 500, "player");
        this.player.setScale(0.7);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        this.anims.create({
            key: "run",
            frames: [
                { key: "player", frame: "run1" },
                { key: "player", frame: "run2" },
                { key: "player", frame: "run3" },
                { key: "player", frame: "run4" },
                { key: "player", frame: "run5" },
                { key: "player", frame: "run6" },
            ],
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "fall",
            frames: [
                { key: "player", frame: "fall1" },
                { key: "player", frame: "fall2" },
                { key: "player", frame: "fall3" },
            ],
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "headache",
            frames: [
                { key: "player", frame: "headache1" },
                { key: "player", frame: "headache2" },
                { key: "player", frame: "headache3" },
            ],
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "jump",
            frames: [
                { key: "player", frame: "jump1" },
                { key: "player", frame: "jump1" },
                { key: "player", frame: "jump2" },
                { key: "player", frame: "jump2" },
                { key: "player", frame: "jump3" },
                { key: "player", frame: "jump3" },
                { key: "player", frame: "jump4" },
                { key: "player", frame: "jump4" },
            ],
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "ski",
            frames: [
                { key: "player", frame: "ski1" },
                { key: "player", frame: "ski2" },
                { key: "player", frame: "ski3" },
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
        this.obstaclesSky = this.physics.add.group();
        this.obstaclesRoad = this.physics.add.group();

        // this.physics.add.collider( );
        // tạo hàm xử  lí khi nhân vật dụng chướng ngại vật
        this.physics.add.overlap(
            this.player,
            this.obstacles,
            this.hitObstacle,
            null,
            this
        );
        // tạo hàm xử  lí khi nhân vật dụng chướng ngại vật trên trời
        this.physics.add.overlap(
            this.player,
            this.obstaclesSky,
            this.hitObstacleSky,
            null,
            this
        );
        // tạo hàm xử  lí khi nhân vật dụng chướng ngại vật thanh chắn
        this.physics.add.overlap(
            this.player,
            this.obstaclesRoad,
            this.hitObstacleRoad,
            null,
            this
        );
        // // bộ lặp tạo chướng ngại vật thanh chắn
        this.obstaclesTimerRoad = this.time.addEvent({
            delay: 5500,
            callback: this.addObstacleRoad,
            callbackScope: this,
            loop: true,
        });
        // // bộ lặp tạo chướng ngại vật
        this.obstacleTimer = this.time.addEvent({
            delay: 2000,
            callback: this.addObstacle,
            callbackScope: this,
            loop: true,
        });

        // // bộ lặp tạo chướng ngại vật trên trời
        this.obstacleTimerSky = this.time.addEvent({
            delay: 3000,
            callback: this.addObstacleSky,
            callbackScope: this,
            loop: true,
        });

        //tạo vật phẩm bí ẩn
        this.gifts = this.physics.add.group();

        // tạo hàm xử  lí khi obstacles xuất hiện cùng chỗ  obstacles road
        this.physics.add.overlap(
            this.obstaclesRoad,
            this.obstacles,
            this.hintConflict,
            null,
            this
        );
        // tạo hàm xử  lí khi obstacles xuất hiện cùng chỗ  vật phẩm bí ẩn
        this.physics.add.overlap(
            this.obstacles,
            this.gifts,
            this.hintConflict,
            null,
            this
        );
        // tạo hàm xử  lí khi obstacles xuất hiện cùng chỗ  vật phẩm bí ẩn
        this.physics.add.overlap(
            this.obstaclesRoad,
            this.gifts,
            this.hintConflict,
            null,
            this
        );

        // bộ lặp tạo  vật phẩm bí ẩn
        this.giftTimer = this.time.addEvent({
            delay: 15000,
            callback: this.addGift,
            callbackScope: this,
            loop: true,
        });

        // tạo hàm xử  lí khi nhân vật dụng  vật phẩm bí ẩn
        this.physics.add.overlap(
            this.player,
            this.gifts,
            this.hitGift,
            null,
            this
        );

        //điểm
        this.scoreText = this.add
            .text(10, 0, "0", {
                font: "bold 28px Arial", // Set the font weight, size, and family
                fill: "#000",
            })
            .setDepth(1);

        //tạo river
        this.river = this.physics.add.sprite(510, 680, "river");
        this.river.setDisplaySize(1100, 200);
        this.river.setDepth(1);

        this.anims.create({
            key: "animated_river",
            frames: [
                { key: "river", frame: "sprite1" },
                { key: "river", frame: "sprite2" },
                { key: "river", frame: "sprite3" },
                { key: "river", frame: "sprite4" },
                { key: "river", frame: "sprite5" },
                { key: "river", frame: "sprite6" },
                { key: "river", frame: "sprite7" },
                { key: "river", frame: "sprite8" },
                { key: "river", frame: "sprite9" },
                { key: "river", frame: "sprite10" },
            ],
            frameRate: 10,
            repeat: -1,
        });
        this.river.anims.play("animated_river");

        //tạo thời tiết

        this.weather = this.add.video(0, 0, "rain");
        this.weather.setDepth(0);
        this.weather.setDisplaySize(300, 140);
        this.weather.play(true);
        this.weather.setLoop(true);
        this.weather.setPaused(false);

        //tạo city
        this.city = this.add.tileSprite(100, 255, 1900, 305, "city");
        this.city.setOrigin(0.5, 0.5);
        this.city.setDepth(0);

        //tạo đường

        this.street = this.add.tileSprite(380, 485, 1500, 210, "street");
        this.street.setOrigin(0.5, 0.5);

        this.street.setDepth(0); // Đặt depth thấp hơn (ví dụ: 0)

        this.input.keyboard.on("keydown-UP", () => {
            if (!this.isCar) {
                console.log("UP1");
                this.pressKey = true;
            }
        });
        this.input.keyboard.on("keydown-DOWN", () => {
            if (!this.isCar) {
                console.log("DOWN1");
                this.pressKey = true;
            }
        });
        this.input.keyboard.on("keydown-SHIFT", () => {
            if (!this.isCar) {
                //người mới lướt được
                console.log("SHIFT1");
                this.pressKey = true;
            }
        });
        this.input.keyboard.on("keydown-SPACE", () => {
            if (!this.isCar) {
                //người mới lướt được
                console.log("SPACE1");
                this.pressKey = true;
            }
        });
    }

    update() {
        if (this.GameOver) {
            return; // thua thì dừng
        }
        if (this.countStart == 0) {
            this.backgroundMusic.play(); // bật nhạc nền
        }

        if (this.countStart == -1) {
            if (this.isCar) {
                this.street.tilePositionX += 40;
                this.city.tilePositionX += 40;
            }
            this.player.setVisible(true);
            // Di chuyển background để tạo cảm giác đang chạy
            this.street.tilePositionX += 2;
            this.city.tilePositionX += 2;
            if (this.cursors.shift.isDown && this.pressKey) {
                if (!this.isCar) {
                    //người mới lướt được
                    console.log("SHIFT2");
                    this.pressKey = false;
                    this.player.anims.remove("run");
                    this.player.anims.play("ski");
                    this.isSki = true;
                    this.skiMusic.play();
                    setTimeout(() => {
                        this.player.anims.stop();
                        this.player.anims.remove("ski");
                        if (!this.GameOver) {
                            if (!this.isCar) {
                                this.player.anims.play("run");
                            }
                        }
                        this.isSki = false;
                    }, 1000);
                }
            }
            if (this.cursors.space.isDown && this.pressKey) {
                if (!this.isCar) {
                    const currentY = parseInt(Math.round(this.player.y));
                    //500 bot
                    //392 top
                    console.log("currentY", currentY);
                    if (
                        parseInt(Math.round(this.player.y)) == 500 ||
                        parseInt(Math.round(this.player.y)) == 392
                    ) {
                        //người mới lướt được
                        console.log("SPACE2");
                        this.pressKey = false;
                        this.player.anims.remove("run");
                        this.player.setGravityY(800); // Set trọng lực
                        this.player.setVelocityY(-325);
                        this.player.anims.play("jump");
                        this.isJump = true;
                        this.jumpMusic.play();
                        setTimeout(() => {
                            this.player.anims.stop();
                            this.player.anims.remove("jump");
                            if (!this.GameOver) {
                                if (!this.isCar) {
                                    this.player.anims.play("run");
                                }
                            }
                            this.isJump = false;
                        }, 500);
                        setTimeout(() => {
                            if (!this.GameOver) {
                                if (!this.isCar) {
                                    this.player.setGravityY(0); // Set trọng lực
                                    this.player.setY(currentY); // về vị trí cũ
                                    this.player.setX(
                                        parseInt(this.player.x) + 30
                                    );
                                }
                            }
                        }, 600);
                    }
                }
            }

            if (this.cursors.up.isDown && this.pressKey && !this.isJump) {
                if (!this.isCar) {
                    console.log("UP2");
                    this.pressKey = false;
                    //đi lên
                    if (this.bottom) {
                        this.top = true;
                        this.bottom = false;
                        this.player.setVelocityY(-6500);
                    }
                }
            } else if (this.cursors.down.isDown && this.pressKey) {
                if (!this.isCar) {
                    console.log("DOWN2");
                    this.pressKey = false;
                    // đi xuống
                    if (this.top) {
                        this.top = false;
                        this.bottom = true;
                        this.player.setVelocityY(6501);
                    }
                }
            } else {
                if (!this.isJump) {
                    this.player.setVelocityY(0);
                }
            }
            if (this.cursors.left.isDown) {
                if (!this.isCar) {
                    this.player.setVelocityX(-400);
                }
            } else if (this.cursors.right.isDown) {
                if (!this.isCar) {
                    this.player.setVelocityX(400);
                }
            } else {
                this.player.setVelocityX(0);
            }

            // Update score
            this.score += 1;
            this.scoreText.setText(this.score);
        }
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
                .text(470, 350, this.countStart, {
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
                    .text(470, 350, this.countStart, {
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
    addObstacle() {
        if (this.countStart == -1) {
            const positionY = Phaser.Math.RND.pick([525, 425]);
            const obstacle = this.obstacles.create(1000, positionY, "obstacle");
            obstacle.setVelocityX(-this.objectSpeed); // Đặt vận tốc ban đầu cho chướng ngại vật
            obstacle.setScale(0.2);
            obstacle.setCollideWorldBounds(true); // bật kiểm tra xem nó có va chạm với ranh giới của thế giới hay không
            obstacle.body.onWorldBounds = true; //Kích hoạt sự kiện khi đối tượng đi ra ngoài ranh giới của thế giới.
            obstacle.body.world.on("worldbounds", (body) => {
                if (body.gameObject === obstacle) {
                    obstacle.destroy();
                }
            });
        }
    }
    addObstacleRoad() {
        if (this.countStart == -1) {
            const positionY = Phaser.Math.RND.pick([500, 395]);
            const obstaclesRoad = this.obstaclesRoad.create(
                980,
                positionY,
                "obstaclesRoad"
            );
            obstaclesRoad.setVelocityX(-this.objectSpeed); // Đặt vận tốc ban đầu cho chướng ngại vật
            obstaclesRoad.setScale(0.2);
            obstaclesRoad.setDepth(2);
            obstaclesRoad.setCollideWorldBounds(true); // bật kiểm tra xem nó có va chạm với ranh giới của thế giới hay không
            obstaclesRoad.body.onWorldBounds = true; //Kích hoạt sự kiện khi đối tượng đi ra ngoài ranh giới của thế giới.
            obstaclesRoad.body.world.on("worldbounds", (body) => {
                if (body.gameObject === obstaclesRoad) {
                    obstaclesRoad.destroy();
                }
            });
        }
    }
    addObstacleSky() {
        if (this.countStart == -1) {
            // Tạo chướng ngại vật rơi từ trên trời xuống ngẫu nhiên
            const positionX = Phaser.Math.Between(100, 900);
            const obstacleSky = this.obstaclesSky.create(
                positionX,
                30,
                "obstacleSky"
            ); // Vị trí Y âm để rơi từ trên xuống
            obstacleSky.setVelocityY(100); // Đặt vận tốc ban đầu cho chướng ngại vật
            obstacleSky.setScale(0.2);
            obstacleSky.setDepth(2);
            // Automatically destroy obstacle when it goes out of bounds
            obstacleSky.setCollideWorldBounds(true); // bật kiểm tra xem nó có va chạm với ranh giới của thế giới hay không
            obstacleSky.body.onWorldBounds = true; //Kích hoạt sự kiện khi đối tượng đi ra ngoài ranh giới của thế giới.
            obstacleSky.body.world.on("worldbounds", (body) => {
                if (body.gameObject === obstacleSky) {
                    obstacleSky.destroy();
                }
            });
        }
    }

    addGift() {
        if (this.countStart == -1) {
            const positionY = Phaser.Math.RND.pick([525, 415]);
            const gift = this.gifts.create(900, positionY, "gift");
            gift.setVelocityX(-this.objectSpeed); // Đặt vận tốc ban đầu cho gift
            gift.setScale(0.15);
            gift.setCollideWorldBounds(true); // bật kiểm tra xem nó có va chạm với ranh giới của thế giới hay không
            gift.body.onWorldBounds = true; //Kích hoạt sự kiện khi đối tượng đi ra ngoài ranh giới của thế giới.
            gift.body.world.on("worldbounds", (body) => {
                if (body.gameObject === gift) {
                    gift.destroy();
                }
            });
        }
    }

    hintConflict(object1, object2) {
        object1.disableBody(true, true); // ẩn obstacle đụng trúng
    }
    hitObstacle(player, obstacle) {
        if (!this.isCar) {
            if (
                !this.isJump &&
                (parseInt(Math.round(this.player.y)) == 500 ||
                    parseInt(Math.round(this.player.y)) == 392)
            ) {
                this.GameOver = true;

                this.player.anims.remove("run");
                this.player.anims.remove("ski");
                this.player.anims.play("fall");
                this.fallMusic.play();
                obstacle.setTint(0xff0000);
                setTimeout(() => {
                    this.player.anims.stop();
                    this.player.anims.remove("fall");
                }, 250);
                this.physics.pause();
                this.obstacleTimer.remove(); // những function được gọi trước (addObstacle) đó sẽ bị remove
                this.obstacleTimerSky.remove(); // những function được gọi trước (addObstacleSky) đó sẽ bị remove
                this.obstaclesTimerRoad.remove(); // những function được gọi trước (addObstacleSky) đó sẽ bị remove
                this.giftTimer.remove(); // những function được gọi trước (addGift) đó sẽ bị remove

                // Lưu điểm số vào dữ liệu toàn cục
                this.registry.set("score", this.score);

                setTimeout(() => {
                    //đổi scene
                    this.sound.stopAll();
                    this.scene.start("GameOver");
                }, 1500);
            }
        } else {
            obstacle.disableBody(true, true); // ẩn obstacle đụng trúng
        }
    }
    hitObstacleRoad(player, obstacleRoad) {
        if (!this.isCar && !this.isSki) {
            if (obstacleRoad.y - parseInt(Math.round(this.player.y)) > 0) {
                this.GameOver = true;
                this.player.anims.remove("run");
                this.player.anims.remove("ski");
                this.player.anims.play("headache");
                this.stunnedMusic.play();
                obstacleRoad.setTint(0xff0000);
                setTimeout(() => {
                    this.player.anims.stop();
                    this.player.anims.remove("headache");
                }, 250);
                this.physics.pause();
                this.GameOver = true;
                this.obstacleTimer.remove(); // những function được gọi trước (addObstacle) đó sẽ bị remove
                this.obstacleTimerSky.remove(); // những function được gọi trước (addObstacleSky) đó sẽ bị remove
                this.obstaclesTimerRoad.remove(); // những function được gọi trước (addObstacleSky) đó sẽ bị remove
                this.giftTimer.remove(); // những function được gọi trước (addGift) đó sẽ bị remove

                // Lưu điểm số vào dữ liệu toàn cục
                this.registry.set("score", this.score);

                setTimeout(() => {
                    //đổi scene
                    this.sound.stopAll();
                    this.scene.start("GameOver");
                }, 1500);
            }
        } else if (this.isCar) {
            obstacleRoad.disableBody(true, true); // ẩn obstacleRoad đụng trúng
        }
    }

    hitObstacleSky(player, obstacleSky) {
        if (!this.isCar) {
            this.GameOver = true;

            this.player.anims.remove("run");
            this.player.anims.remove("ski");
            this.player.anims.play("headache");
            this.stunnedMusic.play();
            obstacleSky.setTint(0xff0000);
            setTimeout(() => {
                this.player.anims.stop();
                this.player.anims.remove("headache");
            }, 250);
            this.physics.pause();
            this.GameOver = true;
            this.obstacleTimer.remove(); // những function được gọi trước (addObstacle) đó sẽ bị remove
            this.obstacleTimerSky.remove(); // những function được gọi trước (addObstacleSky) đó sẽ bị remove
            this.obstaclesTimerRoad.remove(); // những function được gọi trước (addObstacleSky) đó sẽ bị remove
            this.giftTimer.remove(); // những function được gọi trước (addGift) đó sẽ bị remove

            // Lưu điểm số vào dữ liệu toàn cục
            this.registry.set("score", this.score);

            setTimeout(() => {
                //đổi scene
                this.sound.stopAll();
                this.scene.start("GameOver");
            }, 1500);
        } else {
            obstacleSky.disableBody(true, true); // ẩn gift đụng trúng
        }
    }

    hitGift(player, gift) {
        if (!this.isJump) {
            gift.disableBody(true, true); // ẩn gift đụng trúng
            this.isCar = true; // biến thành xe
            this.player.anims.stop(); // Dừng animation hiện tại nếu đang chạy
            this.player.anims.remove("run"); // Xóa animation 'run' của player
            this.player.anims.remove("ski"); // Xóa animation 'ski' của player
            this.player.setTexture("car", "carrun1"); //car1 tên frame trong JSON
            this.player.setScale(0.5);
            this.player.setDepth(3);
            //thời gian xe
            // Create the rounded rectangle background
            this.graphicCarText = this.add.graphics();
            const x = 980;
            const y = 5;
            const width = 40;
            const height = 40;
            const radius = 20;
            const color = "#000000"; // Blue background
            this.graphicCarText.fillStyle(color, 1);
            this.graphicCarText.fillRoundedRect(x, y, width, height, radius);

            // Add the text
            const textStyle = {
                font: "24px Arial",
                fill: "#ffffff", // White text
                align: "center",
            };
            this.carText = this.add.text(
                x + width / 2,
                y + height / 2,
                "5",
                textStyle
            );
            this.carText.setOrigin(0.5, 0.5);
            this.carText.setDepth(1);

            this.time.delayedCall(
                1000,
                () => {
                    this.carText.setText(4);
                },
                [],
                this
            );
            this.time.delayedCall(
                2000,
                () => {
                    this.carText.setText(3);
                },
                [],
                this
            );
            this.time.delayedCall(
                3000,
                () => {
                    this.carText.setText(2);
                },
                [],
                this
            );
            this.time.delayedCall(
                4000,
                () => {
                    this.carText.setText(1);
                },
                [],
                this
            );
            this.time.delayedCall(
                5000,
                () => {
                    this.graphicCarText.destroy();
                    this.carText.destroy(); // xóa bộ đếm biến thành xe
                    this.player.setTexture("player", "player"); // Chuyển lại sử dụng player1 và frame 'run'
                    this.player.setDepth(1);
                    this.player.anims.remove("carrun1"); // Dừng animation hiện tại nếu đang chạy
                    this.player.setScale(0.7);
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
                    // Làm mờ và nhấp nháy nhân vật
                    this.isCar = false; // trở lại để đụng boom sẽ thua
                    this.unDied = true // bất tử tạm thời
                    this.tweens.add({
                        targets: player,
                        alpha: 0,
                        ease: "Linear",
                        duration: 100,
                        repeat: 10,
                        yoyo: true,
                        onComplete: () => {
                            player.setAlpha(1); // Đảm bảo nhân vật không còn mờ sau khi nhấp nháy
                        },
                    });
                },
                [],
                this
            );

            this.time.delayedCall(
                7000,
                () => {
                    this.unDied = false; // trở lại để đụng boom sẽ thua
                },
                [],
                this
            );
        }
    }
}


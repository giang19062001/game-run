import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        this.load.image('play_btn', 'assets/play.png');
        this.load.image('option_btn', 'assets/option.png');
        this.load.image('replay_btn', 'assets/replay.png');
        this.load.image('back_btn', 'assets/back.png');
        this.load.image('right', 'assets/btn1.png');
        this.load.image('left', 'assets/btn2.png');
        this.load.image('up', 'assets/btn3.png');
        this.load.image('down', 'assets/btn4.png');
        this.load.image('space', 'assets/btn5.png');
        this.load.image('shift', 'assets/btn6.png');
        this.load.image('headache', 'assets/headache.png');
        this.load.image('fall', 'assets/fall.png');
        this.load.image('gift', 'assets/be.png');

        this.load.image('background', 'assets/bg.png');
        this.load.image('bg_game', 'assets/bg-game.png');
        this.load.image('bg_lose', 'assets/bg-lose.png');
        this.load.image('vhu_be', 'assets/be_vhu_rm.png');
        this.load.image('vhu', 'assets/vhu.png');

    }

    create ()
    {
        this.scene.start('Preloader');
    }
}

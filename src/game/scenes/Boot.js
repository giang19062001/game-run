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
        this.load.image('play_btn', 'assets/play_btn.png');
        this.load.image('background', 'assets/bg.png');
        this.load.image('bg_game', 'assets/bg-game.png');
        this.load.image('bg_lose', 'assets/bg-lose.png');
        this.load.image('mix', 'assets/be_vhu_rm.png');
        this.load.image('vhu', 'assets/vhu.png');

    }

    create ()
    {
        this.scene.start('Preloader');
    }
}

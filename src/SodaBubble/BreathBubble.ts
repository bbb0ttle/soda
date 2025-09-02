import type { BBBubble, BubbleBehavior } from "@bbb0ttle/bbbubble";

export class BreathBubble implements BubbleBehavior {
    public constructor(bubble: BBBubble) {
        this.actor = bubble;
    }

    actor: BBBubble;

    onBorn: () => Promise<void> = async () => {
        this.actor.display(false);

        const initPos = this.actor.randomInitPos();
        await this.actor.moveTo(initPos);
        this.actor.display(true);
        await this.actor.scaleTo(50);
        this.actor.fade(1);
        this.actor.moveTo(this.actor.idlePos());

        this.actor.animationCtrl.animate('breath', [{
            opacity: 0.8,
        }, {
            opacity: 0.4
        }], {
            iterations: Infinity,
            easing: 'ease-in-out',
            direction: 'alternate',
            duration: 1500
        })
    };

    onGlassReady: () => Promise<void> = async () => {
        return this.onBorn();
    };

    isReadyToGrow: () => boolean = () => false;
    onGrown: () => Promise<void> = async () => {

    };

    isReadyToDie: () => boolean = () => {
        return false;
    };
    onDeath: () => Promise<void> = async () => {

    };
    onTouch: (another: BBBubble) => Promise<void> = async (_another) => {

    };
    onClick: () => Promise<void> = async () => {

    };
}
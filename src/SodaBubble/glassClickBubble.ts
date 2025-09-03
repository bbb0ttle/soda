import {type BubbleBehavior, BBBubble, Stage} from "@bbb0ttle/bbbubble";

export class GlassClickBubble implements BubbleBehavior {
    public constructor(bubble: BBBubble) {
        this.actor = bubble;
    }

    onForgot: () => Promise<void> = async () => {
    };

    onLongPress?: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined;
    onShortPress?: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined;
    onDrag?: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined;
    onPointEvtCancel?: (() => void) | undefined;

    actor!: BBBubble;

    onBorn: () => Promise<void> = async () => {
        const size = this.actor.randomInitSize();

        this.actor.position.x -= size / 2;
        this.actor.position.y -= size / 2;

        this.actor.moveTo(this.actor.position);
        this.actor.display(true);
        this.actor.fade(this.actor.randomInitOpacity());

        await this.actor.bounce(size)

        const normalBehavior = this.actor.behaviorRegistry.get('default');
        await this.actor.learn(normalBehavior, Stage.DIED);
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
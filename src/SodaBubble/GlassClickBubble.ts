import {type BubbleBehavior, BBBubble, Stage} from "@bbb0ttle/bbbubble";

export class GlassClickBubble implements BubbleBehavior {
    public constructor(bubble: BBBubble) {
        this.actor = bubble;
    }

    onForgot: () => Promise<void> = async () => {
    };

    onLearned: () => Promise<void> = async () => {
        return this.onBorn()
    };
    onSick: () => Promise<void> = async () => {
    };
    after?: ((stage: Stage) => Promise<void>) | undefined;

    onLongPress: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined = async () => {

    };
    onShortPress?: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined = async (pos) => {
        const finalSize = 250;

        pos.x -= finalSize / 2;
        pos.y -= finalSize / 2;

        this.actor.goto(pos);

        await this.actor.bounce(finalSize);

        const becomeIntoContainer = this.actor.behaviorRegistry.get('container');

        await this.actor.learn(becomeIntoContainer)

    };
    onDrag?: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined;
    onPointEvtCancel?: (() => void) | undefined;

    actor!: BBBubble;

    alive: boolean = false;

    onBorn: () => Promise<void> = async () => {
        if (this.alive) {
            return;
        }

        this.alive = true;

        const size = this.actor.randomInitSize();

        this.actor.position.x -= size / 2;
        this.actor.position.y -= size / 2;

        this.actor.goto(this.actor.position);
        this.actor.display(true);
        this.actor.fade(this.actor.randomInitOpacity());

        await this.actor.bounce(size)
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
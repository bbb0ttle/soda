import type {BubbleBehavior, Stage} from "@bbb0ttle/bbbubble";
import type { BBBubble } from "@bbb0ttle/bbbubble";
import { createLiquidGlass } from '../liquidGlass'

export class ContainerBubble implements BubbleBehavior {
    public constructor(bubble: BBBubble) {
        this.actor = bubble;
    }

    onForgot: () => Promise<void> = async () => {
    };

    img!: HTMLImageElement;

    onLearned: () => Promise<void> = async () => {

        const image = new Image();
        image.src = 'img/soda.png';
        image.style.setProperty('opacity', '0');
        image.style.setProperty('width', 'calc(100% - 150px)');
        image.style.setProperty('transition', 'opacity 1s ease-in-out');

        this.img = image;

        this.img.onload = () => {
            console.log('ContainerBubble image loaded')
        };
    };

    onSick: () => Promise<void> = async () => {
    };

    after?: ((stage: Stage) => Promise<void>) | undefined;

    onLongPress?: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined;
    onShortPress?: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined;
    onDrag?: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined;
    onPointEvtCancel?: (() => void) | undefined;

    actor!: BBBubble;

    alive: boolean = false;

    onBorn: () => Promise<void> = async () => {
        if (this.alive) {
            return;
        }

        this.alive = true;

        const { width, height } = this.actor.spaceRect ?? { width: 50, height: 50 };

        const size = Math.sqrt(width * width + height * height) / 4;

        const centerX = width / 2;
        const centerY = height / 2;
        this.actor.fade(1);
        this.actor.scaleTo(160, 160)
        this.actor.goto({ x: centerX, y: centerY });
        await this.actor.scaleTo(size, 200, true);
        this.img.style.setProperty('opacity', '0');
        this.actor.appendChild(this.img);
        this.img.style.setProperty('opacity', '1');
        // const { height: rHeight } = this.actor.spaceRect ?? { width: 50, height: 50 };
        // this.img.style.setProperty('height', `${rHeight}px`)

        await this.actor.goto({
            x: centerX - size / 2,
            y: centerY - size / 2,
        }, 200, true)

        createLiquidGlass(this.actor.element!, 250);

        this.actor.element!.style.setProperty('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)');


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
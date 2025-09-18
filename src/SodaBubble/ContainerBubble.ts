import type {BubbleBehavior, Stage} from "@bbb0ttle/bbbubble";
import type { BBBubble } from "@bbb0ttle/bbbubble";
import {createLiquidGlass, type Shader} from '../liquidGlass'

export class ContainerBubble implements BubbleBehavior {
    public constructor(bubble: BBBubble) {
        this.actor = bubble;
    }

    onForgot: () => Promise<void> = async () => {
    };

    img!: HTMLImageElement | null;

    imgStyle!: CSSStyleSheet;

    onLearned: () => Promise<void> = async () => {
        await this.onBorn()
    };

    onSick: () => Promise<void> = async () => {
    };

    after?: ((stage: Stage) => Promise<void>) | undefined;

    onLongPress?: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined;
    onShortPress?: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined;
    onDrag?: ((pos: { x: number; y: number; }, originEvent: Event) => Promise<void>) | undefined;
    onPointEvtCancel?: (() => void) | undefined;

    actor!: BBBubble;

    shd!: Shader;

    onBorn: () => Promise<void> = async () => {
        this.actor.display(true);

        const size = this.actor.size;

        this.actor.fade(1);

        this.shd = createLiquidGlass(this.actor.element!, size);

        this.actor.element!.style.setProperty('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)');

        this.imgStyle = new CSSStyleSheet();

        // this.imgStyle.replaceSync(`
        //     .soda {
        //         position: relative;
        //         animation: idle 3s linear infinite alternate;
        //     }
        //
        //     @keyframes idle {
        //         0% { transform: translateX(-${size * 1 / 3}px); }
        //         100% { transform: translateX(${size * 1 / 3}px); }
        //     }
        // `)

        this.actor.root.adoptedStyleSheets = [...this.actor.root.adoptedStyleSheets, this.imgStyle];

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

    private async recycle() {
        this.actor.fade(0, this.actor.moveDuration() + this.actor.configuration.defaultAnimationDuration);
        await this.actor.goto(this.actor.topPos(), this.actor.moveDuration());

        this.shd.destroy();
        this.actor.element!.style.removeProperty('box-shadow');
        this.actor.root.adoptedStyleSheets = this.actor.root.adoptedStyleSheets.filter(s => s !== this.imgStyle);
        await this.actor.recycle();
    }

    onClick: () => Promise<void> = async () => {
        await this.recycle();
    };
}
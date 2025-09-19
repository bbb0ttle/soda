import type {BBBubble, BubbleBehavior, Position} from "@bbb0ttle/bbbubble"
import { Stage } from "@bbb0ttle/bbbubble";
import {CircularText} from "../elements";

export class TextTestBubble implements BubbleBehavior {
    public constructor(b: BBBubble) {
        this.actor = b;
    }

    actor: BBBubble;

    onLearned: () => Promise<void> = async () => {
        return this.onBorn()
    };

    onForgot: () => Promise<void> = async () => {
    };

    // flag to indicate if the bubble is generated manually
    manMade: boolean = false;

    alive: boolean = false;
    onBorn: () => Promise<void> = async () => {
        if (this.alive) {
            return;
        }
        this.alive = true;

        await this.actor.scaleTo(300, 0, true);
        const centerX = window.innerWidth / 2 - 150;
        await this.actor.goto({
            x: centerX,
            y: 200
        }, 0);

        this.actor.display(true);
        await this.actor.fade(1, 0);

        this.lastExceed = await this.loadContent(this.lastExceed);

        this.text?.show();
    };

    private text: CircularText | undefined;

    private lastExceed: string = "";

    private isInCircle({ x, y }: Position) {
        const rect = this.actor.element?.getBoundingClientRect();
        if (!rect) {
            return false;
        }
        const radius = rect.width / 2;
        const centerX = rect.left + radius;
        const centerY = rect.top + radius;
        const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        return dist <= radius;
    }

    async loadContent(text: string) {
        const textHtml = text.split("").map(c => `<span>${c}</span>`).join("");
        const circularElement = document.createElement("circular-text");
        const paragraph = document.createElement("span");
        paragraph.innerHTML = textHtml;
        circularElement.append(paragraph)
        circularElement.setAttribute("size", "300")

        this.text = circularElement;

        this.actor.append(circularElement);

        await new Promise(requestAnimationFrame);

        const spans = Array.from(circularElement.querySelectorAll("span"));
        // find span not in circle
        const firstExceededChar = spans.findIndex((s, index) => {
            const rect = s.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            return !this.isInCircle({ x, y }) && index > 5;
        });

        if (firstExceededChar === -1) {
            return "";
        }

        const sliceIdx = Math.max(firstExceededChar - 1, 0);

        return text.slice(sliceIdx);
    }

    onGrown: () => Promise<void> = async () => {};
    onSick: () => Promise<void> = async () => {};
    onDeath: () => Promise<void> = async () => {};
    after?: ((stage: Stage) => Promise<void>) | undefined = async () => {
    };
    onClick: () => Promise<void> = async () => {
    };
    onLongPress?: ((pos: Position, originEvent: Event) => Promise<void>) | undefined;
    onShortPress?: ((pos: Position, originEvent: Event) => Promise<void>) | undefined = async (_p) => {
        const newBubble = await this.actor.space.getRandomDiedBubble();
        if (!newBubble) {
            return;
        }

        if (this.lastExceed == "") {
            await this.recycle();
            return;
        }


        const toBecameTextBehavior = newBubble.behaviorRegistry.get<TextTestBubble>("textTest");
        if (!toBecameTextBehavior) {
            return;
        }

        toBecameTextBehavior.lastExceed = this.lastExceed;

        await Promise.all([
            this.recycle(),
            newBubble.learn(toBecameTextBehavior)
        ]);

    };

    private async recycle() {
        this.text?.remove();

        await Promise.all([
            this.actor.goto(this.actor.topPos(), 300),
            this.actor.scaleTo(this.actor.randomInitSize())
        ])
        await Promise.all([
            this.actor.fade(0),
        ]);

        await Promise.all([
            this.actor.assignedSlot?.childNodes?.forEach(c => c.remove()),
            this.actor.recycle()
        ]);

    }

    onDrag?: ((pos: Position, originEvent: Event) => Promise<void>) | undefined;
    onPointEvtCancel?: (() => void) | undefined;

}
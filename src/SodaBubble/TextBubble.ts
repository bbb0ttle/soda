import type {BBBubble, BubbleBehavior, Position} from "@bbb0ttle/bbbubble"
import { Stage } from "@bbb0ttle/bbbubble";
import {CircularText} from "../elements";

export class TextBubble implements BubbleBehavior {
    public constructor(b: BBBubble) {
        this.actor = b;
    }

    actor: BBBubble;

    onLearned: () => Promise<void> = async () => {
        this.actor.styleInfo.replaceSync(`
            .bubble {
                background: rgba(255, 255, 255, 0.8);
                z-index: 2;
            }
        `)

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
        await this.actor.fade(.9, 0);

        this.text = await this.loadContent(this.text);


        this.textEle?.show();
    };

    private textEle: CircularText | undefined;

    text: string = "晋人归楚公子榖臣，与连尹襄老之尸于楚，以求知罃。于是荀首佐中军矣，故楚人许之。\n" +
        "\n" +
        "　　王送知罃，曰：“子其怨我乎？”对曰：“二国治戎，臣不才，不胜其任，以为俘馘。执事不以衅鼓，使归即戮，君之惠也。臣实不才，又谁敢怨？”\n" +
        "\n" +
        "　　王曰：“然则德我乎？”对曰：“二国图其社稷，而求纾其民，各惩其忿，以相宥也，两释累囚，以成其好。二国有好，臣不与及，其谁敢德？”\n" +
        "\n" +
        "　　王曰：“子归何以报我？”对曰：“臣不任受怨，君亦不任受德。无怨无德，不知所报。”\n" +
        "\n" +
        "　　王曰：“虽然，必告不谷。”对曰：“以君之灵，累臣得归骨于晋，寡君之以为戮，死且不朽。若从君之惠而免之，以赐君之外臣首；首其请于寡君，而以戮于宗，亦死且不朽。若不获命，而使嗣宗职，次及于事，而帅偏师以脩封疆，虽遇执事，其弗敢违。其竭力致死，无有二心，以尽臣礼。所以报也。\n" +
        "\n" +
        "　　王曰：“晋未可与争。”重为之礼而归之。";

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
        const textHtml = text.split("").map(c => {
            if (c === "\n") {
                return `<br/>`;
            }
            return `<span>${c}</span>`;
        }).join("");
        const circularElement = document.createElement("circular-text");
        const paragraph = document.createElement("span");
        paragraph.innerHTML = textHtml;
        circularElement.append(paragraph)
        circularElement.setAttribute("size", "300")

        this.textEle = circularElement;

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
    onClick: (evt?: MouseEvent) => Promise<void> = async () => {
        await this.nextPage();
    };
    onLongPress?: ((pos: Position, originEvent: Event) => Promise<void>) | undefined;
    onShortPress?: ((pos: Position, originEvent: Event) => Promise<void>) | undefined = async (_p) => {
        await this.nextPage()
    };

    private async nextPage() {
        const newBubble = await this.actor.space.getRandomDiedBubble();
        if (!newBubble) {
            return;
        }

        if (this.text == "") {
            await this.recycle();
            return;
        }


        const toBecameTextBehavior = newBubble.behaviorRegistry.get<TextBubble>("textTest");
        if (!toBecameTextBehavior) {
            return;
        }

        toBecameTextBehavior.text = this.text;

        await Promise.all([
            this.recycle(),
            newBubble.learn(toBecameTextBehavior)
        ]);
    }

    private async recycle() {
        this.textEle?.remove();

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
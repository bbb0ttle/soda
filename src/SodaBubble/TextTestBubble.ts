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
        await this.actor.fade(1);

        this.lastExceed = await this.loadContent(this.lastExceed);

        this.text?.show();
    };

    private text: CircularText | undefined;

    private lastExceed: string = "小乌鸦一挨批评，就用手指把两只耳朵堵起来。机场接到小乌鸦，地铁上一直让她穿外套，她说不，我们先叙叙旧。每天都在捣鼓网站代码，小乌鸦让我往里边加点爱情故事。小乌鸦说她去年是情绪稳定的一年，证据是微博显示她已经一年没拉黑我。 小乌鸦要在我鼻孔里插花。每当我坐着躺着腰或者脖子不舒服的时候，就随手抓过一个小乌鸦买的毛绒玩具，塞到脑袋或者腰后边，整个世界就安稳下来。小乌鸦管充电宝叫充电北鼻。小乌鸦拿着手机过来，指着衣服效果图问，红的好看还是黄的好看？得到答复后说，我都买回来尝尝。小时候陪伴我最久的私人空间，是学校的课桌。不同的年级，换了不同的教室，但课桌相同。都是木制的、带四条腿的、能翻盖的盒子。盒子新旧不一，无漆，表面被一茬又一茬的孩子们盘成了镜面，会反光。翻开光亮平滑或许还刻着「早」字的盖子，课桌里边的空间就都是我的了。左边放什么课本，右边放什么文具，隐秘的空隙藏什么东西，全由自己做主。在某个傍晚，吃过饭后，晚自习前，腾出时间把课桌里的物件全挪出来，重新归置一番，便又能让那个厌倦课堂的我，多保持一阵新鲜感。有时候无聊到趴在翻开盖的课桌上，盯着里边的小世界，脑海里能想象出各种小人，导演一部部影片。也许某次换教室、换座位遇到一个被上届主人「个性化定制」过的课桌，能取下靠胸前的一块木板，上课时的小动作便又多了可施展的空间。";

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

    private async loadContent(text: string) {
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
        if (this.lastExceed == "") {
            await this.recycle();
            return;
        }

        const newBubble = await this.actor.space.getRandomDiedBubble();
        if (!newBubble) {
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
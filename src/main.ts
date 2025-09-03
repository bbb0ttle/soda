import {type BBBubble, Glass} from "@bbb0ttle/bbbubble";
import { BreathBubble } from "./SodaBubble/BreathBubble";
import {GlassClickBubble} from "./SodaBubble/glassClickBubble.ts";

addEventListener('bubble-connected', (event) => {
    const bubble = event.target as BBBubble;
    bubble.behaviorRegistry.register('breath', BreathBubble)
    bubble.behaviorRegistry.register('glassClick', GlassClickBubble)
});

addEventListener('DOMContentLoaded', (_event) => {
    const glassEle = document.getElementsByTagName('bb-glass');
    if (glassEle.length === 0) {
        return;
    }

    const glass = glassEle[0] as Glass;
    if (!glass) {
        return;
    }

    const getEventCoords = (event: MouseEvent | TouchEvent): { x: number; y: number } => {
        if (event instanceof TouchEvent) {
            const touch = event.touches[0] || event.changedTouches[0];
            return { x: touch.clientX, y: touch.clientY };
        }
        return { x: event.clientX, y: event.clientY };
    }

    glass.addEventListener('click', async (event) => {
        if (!(event.target instanceof Glass)) {
            return;
        }

        const pos =  getEventCoords(event);
        const bubble = await glass.getRandomDiedBubble() as BBBubble;
        if (!bubble) {
            return;
        }

        bubble.display(false)

        await bubble.moveTo(pos, 1);
        await bubble.scaleTo(20, 1);

        const clickBehavior = bubble.behaviorRegistry.get('glassClick');

        await bubble.learn(clickBehavior);
    });





})
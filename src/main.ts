import type { BBBubble } from "@bbb0ttle/bbbubble";
import { BreathBubble } from "./SodaBubble/BreathBubble";

addEventListener('bubble-connected', (event) => {
    const bubble = event.target as BBBubble;
    bubble.behaviorRegistry.register('breath', BreathBubble)
});
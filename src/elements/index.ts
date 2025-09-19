import { CircularText } from "./circular-text";

if (!window.customElements.get("circular-text")) {
    window.customElements.define("circular-text", CircularText);
}

declare global {
    interface HTMLElementTagNameMap {
        "circular-text": CircularText;
    }
}

export {
    CircularText
}
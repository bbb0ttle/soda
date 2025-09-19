export class CircularText extends HTMLElement {
    root: ShadowRoot;

    constructor() {
        super();
        this.root = this.attachShadow({mode: 'open'});
        this.root.innerHTML = `
            <div class="box">
              <i></i> 
              <slot>
              </slot>
            </div> 
        `
    }

    static get observedAttributes() {
        return ["size"];
    }

    toggleShow() {
        this.root.querySelector(".box")?.classList.toggle("show");
    }

    hide() {
        this.root.querySelector(".box")?.classList.remove("show");
    }

    show() {
        this.root.querySelector(".box")?.classList.toggle("show");
    }

    attributeChangedCallback() {
        const size = this.getAttribute("size") || "450";
        const padding = this.getAttribute("padding") || "5";
        const box: HTMLDivElement = this.shadowRoot!.querySelector(".box")!;

        if (!box) {
            return;
        }

        box.style.setProperty("--s", `${size}px`);
        box.style.setProperty("--p", `${padding}px`);
    }

    connectedCallback() {
        const stylesheet = new CSSStyleSheet();

        stylesheet.replaceSync(`
            div.box {
              --s:450px;  /*Size of the circle */
              
              --p:15px;   /* padding */

              height: var(--s);
              width: var(--s);
              border-radius: 50%;
              margin:30px auto;
              text-align:justify;
              line-height: 1.65;
              
              opacity: 0;
              
              transition: opacity .6s ease-in-out;
            }
            
            div.box.show {
              opacity: 1;
            }
            
            div.text-wrapper {
              height:100%;
              width:100%;
              overflow: auto;
            }

            .box i,
            .box::before {
              content: '';
              float: left;
              height:100%;
              width: 50%;
              shape-outside: radial-gradient(farthest-side at right, transparent calc(100% - var(--p)), #fff 0);
            }

            .box i {
              float: right;
              shape-outside: radial-gradient(farthest-side at left,  transparent calc(100% - var(--p)), #fff 0);
            }
        `);

        this.root.adoptedStyleSheets = [stylesheet];
    }
}
class TogglePassword extends HTMLInputElement {
    constructor() {
        super();
        if(!this.getAttribute('id')) {
            this.setAttribute('id', this.generateId())
        }
    }

    connectedCallback() {
        if (this.getAttribute('is')) {
            // Suppress is attribut in order to preserve custom element from infinite loop
            this.removeAttribute('is');

            this.toggleState = true;
            this.buildOptions();

            this.buildWrapperElement().then(wrapperElement => {
                this.replaceWith(wrapperElement);
            })
        }
    }

    buildOptions() {
        this.options = {
            showText: this.dataset.showText ? this.dataset.showText : 'Show',
            hideText: this.dataset.hideText ? this.dataset.hideText : 'Hide',
            displayIcon: this.dataset.displayIcon === 'true',
            showIcon: this.dataset.iconShow ? this.dataset.iconShow : null,
            hideIcon: this.dataset.iconHide ? this.dataset.iconHide : null,
        };
    }

    /**
     * Build clone of password input
     * @return {Node} passwordInputClone
     */
    buildClone() {
        const passwordInputClone = this.cloneNode(false);
        passwordInputClone.classList.add('toggle-password-input');
        return passwordInputClone;
    }

    /**
     * Build wrapper element
     * @return {HTMLDivElement}
     */
    async buildWrapperElement() {
        const clone = this.buildClone();
        const toggleElement = await this.buildToggleElement(clone);

        const wrapperElement = document.createElement('div');
        wrapperElement.classList.add('toggle-password-container');
        wrapperElement.appendChild(clone);

        const root = wrapperElement.attachShadow({mode: 'open'});
        root.appendChild(toggleElement);
        root.appendChild(this.buildStyles());
        root.innerHTML += '<slot></slot>';

        this.attachEvent(root, clone);

        return wrapperElement;
    }

    /**
     * Build toggle html element
     * @param {Node} clone
     * @return {Node} toggleElement
     */
    async buildToggleElement(clone) {
        const toggleElement = document.createElement('span');
        toggleElement.classList.add('toggle-password');
        toggleElement.classList.add('is-password-hidden');

        const show = document.createElement('span');
        const hide = document.createElement('span');
        hide.classList.add('toggle-password-hide');

        if(!this.options.displayIcon) {
            show.innerHTML = this.options.showText;
            hide.innerHTML = this.options.hideText;
            toggleElement.appendChild(show);
            toggleElement.appendChild(hide);

            return toggleElement;
        } else {
            show.innerHTML = await this.renderVisibleIcon();
            hide.innerHTML = await this.renderHideIcon();
        }

        toggleElement.appendChild(show);
        toggleElement.appendChild(hide);

        return toggleElement;
    }

    /**
     * Build css style
     * @return {HTMLElement}
     */
    buildStyles() {
        let style = `
            :host {
                position: relative;
                display: inline-block;
                --toggle-password-background-color: transparent;
                --toggle-password-color: #000;
                --toggle-password-width: 40px;
                --toggle-password-padding: 5px;
                --toggle-password-icon-width: 24px;
                --toggle-password-icon-height: 24px;
            }
 
            .toggle-password {
                z-index: 2;
                position: absolute;
                top: 0;
                right: 0;
                
                display: flex;
                align-items: center;
                justify-content: flex-end;
                
                width: var(--toggle-password-width);
                height: 100%;
                background-color: var(--toggle-password-background-color);
                color: var(--toggle-password-color);
                padding: 0 var(--toggle-password-padding);
            }
            
            .toggle-password span {
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
            
            .toggle-password span svg {
                width: var(--toggle-password-icon-width);
                height: var(--toggle-password-icon-height);
            }
                
            .toggle-password-hide {
                display:none !important;
            }
            
            .toggle-password-input {
                padding-right: 50px;
            }`;

        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        return styleElement;
    }

    /**
     *
     * @param {Node} root
     * @param {Node} clone
     */
    attachEvent(root, clone) {
        root.querySelector('.toggle-password').addEventListener('click', (e) => {
            e.preventDefault();

            this.toggleState = !this.toggleState;

            if(clone.getAttribute('type') === 'password') {
                clone.setAttribute('type', 'text');
            } else {
                clone.setAttribute('type', 'password');
            }

            root.querySelector('.toggle-password').querySelectorAll('span').forEach((element) => {
                if(element.classList.contains('toggle-password-hide')) {
                    element.classList.remove('toggle-password-hide');
                } else {
                    element.classList.add('toggle-password-hide');
                }
            })
        });
    }
    /**
     * Generate random ID
     * @return {string}
     */
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Render default show icon
     * @return {string}
     */
    async renderVisibleIcon() {
        if (!this.options.showIcon) {
            return `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' style='stroke: currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>`;
        } else {
            const response = await fetch(this.options.showIcon);
            return await response.text();
        }
    }

    /**
     * Render default hide icon
     * @return {string}
     */
    async renderHideIcon() {
        if (!this.options.hideIcon) {
            return `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' style='stroke: currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22'/></svg>`;
        } else {
            const response = await fetch(this.options.hideIcon);
            return await response.text();
        }
    }

    disconnectedCallback() {}
}

window.customElements.define('toggle-password', TogglePassword, {extends: 'input'});

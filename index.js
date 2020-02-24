/**
 * Render default show icon
 * @return {string}
 */
function renderVisibleIcon() {
    return `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' style='stroke: currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>`;
}

/**
 * Render default hide icon
 * @return {string}
 */
function renderHideIcon() {
    return `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' style='stroke: currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22'/></svg>`;
}

/**
 * Generate random ID
 * @return {string}
 */
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

class TogglePassword extends HTMLInputElement {
    constructor() {
        super();
        if(!this.getAttribute('id')) {
            this.setAttribute('id', generateId())
        }
    }

    connectedCallback() {
        if (this.getAttribute('is')) {
            // Suppress is attribut in order to preserve custom element from infinite loop
            this.removeAttribute('is');

            this.toggleState = true;
            this.buildOptions();

            const wrapperElement = this.buildWrapperElement();
            this.replaceWith(wrapperElement);
        }
    }

    buildOptions() {
        this.options = {
            showText: this.dataset.showText ? this.dataset.showText : 'Show',
            hideText: this.dataset.hideText ? this.dataset.hideText : 'Hide',
            displayIcon: this.dataset.displayIcon === 'true',
            //iconColor: this.dataset.iconColor ? this.dataset.iconColor : '#000',
        };
       // this.options.showIcon = this.dataset.iconShow ? this.dataset.iconShow : `data:image/svg+xml,${renderVisibleIcon(this.options.iconColor)}`;
       // this.options.hideIcon = this.dataset.iconHide ? this.dataset.iconHide : `data:image/svg+xml,${renderHideIcon(this.options.iconColor)}`;
    }

    /**
     * Build wrapper element
     * @return {HTMLDivElement}
     */
    buildWrapperElement() {
        const clone = this.buildClone();
        const toggleElement = this.buildToggleElement(clone);

        const wrapperElement = document.createElement('div');
        wrapperElement.classList.add('toggle-password-container');
        wrapperElement.appendChild(clone);

        const root = wrapperElement.attachShadow({mode: 'open'});
        root.appendChild(toggleElement);
        root.appendChild(this.buildStyles());
        root.innerHTML += '<slot></slot>';

        root.querySelector('.toggle-password').addEventListener('click', (e) => {
            e.preventDefault();
            this.togglePassword(clone, toggleElement);
        });

        return wrapperElement;
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
     * Build toggle html element
     * @param {Node} clone
     * @return {Node} toggleElement
     */
    buildToggleElement(clone) {
        const toggleElement = document.createElement('span');
        toggleElement.classList.add('toggle-password');
        toggleElement.classList.add('is-password-hidden');

        const show = document.createElement('span');
        const hide = document.createElement('span');
        hide.classList.add('toggle-password-hide');
        if(!this.options.displayIcon) {
            show.innerHTML = this.options.showText;
            hide.innerHTML = this.options.hideText;
        } else {
            show.innerHTML = renderVisibleIcon();
            hide.innerHTML = renderHideIcon();
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
                --toggle-padding: 5px;
                --toggle-password-icon-width: 24px;
                --toggle-password-icon-height: 24px;
            }
 
            .toggle-password {
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
                padding: 0 var(--toggle-padding);
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
     * Toggle input state
     * @param {Node} clone
     * @param {Node} toggleElement
     */
    togglePassword(clone, toggleElement) {
        if (this.toggleState) {
            this.showPassword(clone, toggleElement);
        } else {
            this.hidePassword(clone, toggleElement);
        }
    }

    /**
     * Display password in text input and toggle css classes
     * @param {Node} clone
     * @param {Node} toggleElement
     */
    showPassword(clone, toggleElement) {
        this.toggleState = false;
        clone.setAttribute('type', 'text');
        toggleElement.classList.remove('is-password-hidden');
        toggleElement.classList.add('is-password-visible');
    }

    /**
     * Hide passwond in password input and toggle css classes
     * @param {Node} clone
     * @param {Node} toggleElement
     */
    hidePassword(clone,toggleElement) {
        this.toggleState = true;
        clone.setAttribute('type', 'password');
        toggleElement.classList.remove('is-password-visible');
        toggleElement.classList.add('is-password-hidden');
    }

    disconnectedCallback() {}
}

window.customElements.define('toggle-password', TogglePassword, {extends: 'input'});

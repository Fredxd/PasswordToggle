/**
 * Render default show icon
 * @param {string} color
 * @return {string}
 */
function renderVisibleIcon(color) {
    return `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' style='stroke: ${hexToRgba(color)};' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/><circle cx='12' cy='12' r='3'/></svg>`;
}

/**
 * Render default hide icon
 * @param {string} color
 * @return {string}
 */
function renderHideIcon(color) {
    return `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' style='stroke: ${hexToRgba(color)};' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22'/></svg>`;
}

/**
 * Convert hex value to rgba
 * @param {string} hex
 * @param {int} alpha
 * @return {string}
 */
function hexToRgba(hex, alpha = 1) {
    let regex = RegExp('#([\\dA-Fa-f]{3,6})', 'g');
    if(regex.test(hex)) {
        let [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
        r = (r) ? r : 0;
        g = (g) ? g : 0;
        b = (b) ? b : 0;
        return `rgba(${r},${g},${b},${alpha})`;
    }

    regex = RegExp('rgba\\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3}),?([0-1]?\\.[0-9])?\\)|rgb\\(([0-9]{1,3}),([0-9]{1,3}),([0-9]{1,3})\\)', 'g');
    if(regex.test(hex)) {
        return hex;
    }

    return 'rgba(0,0,0)';
}

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
            const clone = this.cloneNode(false);
            clone.classList.add('toggle-password-input');

            this.toggleState = true;

            this.options = {
                showText: this.dataset.showText ? this.dataset.showText : 'Show',
                hideText: this.dataset.hideText ? this.dataset.hideText : 'Hide',
                displayIcon: this.dataset.displayIcon === 'true',
                iconColor: this.dataset.iconColor ? this.dataset.iconColor : '#000',
            };
            this.options.showIcon = this.dataset.iconShow ? this.dataset.iconShow : `data:image/svg+xml,${renderVisibleIcon(this.options.iconColor)}`;
            this.options.hideIcon = this.dataset.iconHide ? this.dataset.iconHide : `data:image/svg+xml,${renderHideIcon(this.options.iconColor)}`;

            this.buildToggleElement(clone);
            const wrapperElement = this.buildWrapperElement(clone);
            this.replaceWith(wrapperElement);
        }
    }

    /**
     * Build wrapper element
     * @param {Node} clone
     * @return {HTMLDivElement}
     */
    buildWrapperElement(clone) {
        const wrapperElement = document.createElement('div');
        wrapperElement.style = 'position:relative; display: inline-block;';
        wrapperElement.append(clone);
        wrapperElement.append(this.toggleElement);
        return wrapperElement;
    }

    /**
     * Build toggle html element
     * @param {Node} clone
     */
    buildToggleElement(clone) {
        this.toggleElement = document.createElement('span');
        this.toggleElement.classList.add('toggle-password');
        this.toggleElement.classList.add('is-password-hidden');
        this.toggleElement.attachShadow({mode: 'open'});
        this.toggleElement.innerHTML = this.buildStyles();

        this.toggleElement.addEventListener('click', (e) => {
            e.preventDefault();
            this.togglePassword(clone);
        });
    }

    /**
     * Build css style
     * @return {string}
     */
    buildStyles() {
        let style = `
            .toggle-password::after {
                content: '';
                font-size: 12px;
                padding-right: 5px;
            }
            .toggle-password {
                max-width: 50px;
                position: absolute;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
            }
           
            .toggle-password-input {
                padding-right: 50px;
            }`;

        if (this.options.displayIcon) {
            style += `
                #${this.getAttribute('id')} + .toggle-password.is-password-hidden::after {
                    background-image: url("${this.options.showIcon}");
                    background-size: contain;
                    background-repeat: no-repeat;
                    padding-right: 16px;
                }
                #${this.getAttribute('id')} + .toggle-password.is-password-visible::after {
                    background-image: url("${this.options.hideIcon}");
                    background-size: contain;
                    background-repeat: no-repeat;
                    padding-right: 16px;
                }
            `;
        } else {
            style += `
                #${this.getAttribute('id')} + .toggle-password.is-password-hidden::after {
                     content: '${this.options.showText}';
                }
                #${this.getAttribute('id')} + .toggle-password.is-password-visible::after {
                     content: '${this.options.hideText}';
                }
            `;
        }

        return `<style>${style}</style>`;
    }

    /**
     * Toggle input state
     * @param {Node} clone
     */
    togglePassword(clone) {
        if (this.toggleState) {
            this.showPassword(clone);
        } else {
            this.hidePassword(clone);
        }
    }

    /**
     * Display password in text input and toggle css classes
     * @param {Node} clone
     */
    showPassword(clone) {
        this.toggleState = false;
        clone.setAttribute('type', 'text');
        this.toggleElement.classList.remove('is-password-hidden');
        this.toggleElement.classList.add('is-password-visible');
    }

    /**
     * Hide passwond in password input and toggle css classes
     * @param {Node} clone
     */
    hidePassword(clone) {
        this.toggleState = true;
        clone.setAttribute('type', 'password');
        this.toggleElement.classList.remove('is-password-visible');
        this.toggleElement.classList.add('is-password-hidden');
    }

    disconnectedCallback() {
    }
}

window.customElements.define('toggle-password', TogglePassword, {extends: 'input'});

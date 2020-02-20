function renderVisibleIcon() {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'/%3E%3Ccircle cx='12' cy='12' r='3'/%3E%3C/svg%3E`;
}

function renderHideIcon() {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22'/%3E%3C/svg%3E`;
}

class TogglePassword extends HTMLInputElement {
    connectedCallback() {
        if (this.getAttribute('is')) {
            // Suppress is attribut in order to preserve custom element from infinite loop
            this.removeAttribute('is');
            const clone = this.cloneNode(false);
            clone.classList.add('toggle-password-input');

            this.options = {
                showText: this.dataset.showText ? this.dataset.showText : 'Show',
                hideText: this.dataset.hideText ? this.dataset.hideText : 'Hide',
                displayIcon: this.dataset.displayIcon === 'true',
            };

            this.toggleState = true;

            this.toggleElement = document.createElement('span');
            this.toggleElement.classList.add('toggle-password');
            this.toggleElement.classList.add('is-password-hidden');
            this.toggleElement.attachShadow({mode: 'open'});
            this.toggleElement.innerHTML = this.buildStyles();

            const wrapperElement = document.createElement('div');
            wrapperElement.style = 'position:relative; display: inline-block;';
            wrapperElement.append(clone);
            wrapperElement.append(this.toggleElement);

            this.replaceWith(wrapperElement);
            this.toggleElement.addEventListener('click', (e) => {
                e.preventDefault();
                this.togglePassword(clone);
            })
        }
    }

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
                    background-image: url("${renderVisibleIcon()}");
                    background-size: contain;
                    background-repeat: no-repeat;
                    padding-right: 16px;
                }
                #${this.getAttribute('id')} + .toggle-password.is-password-visible::after {
                    background-image: url("${renderHideIcon()}");
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
     * @param {HTMLInputElement} clone
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
     * @param {HTMLInputElement} clone
     */
    showPassword(clone) {
        this.toggleState = false;
        clone.setAttribute('type', 'text');
        this.toggleElement.classList.remove('is-password-hidden');
        this.toggleElement.classList.add('is-password-visible');
    }

    /**
     * Hide passwond in password input and toggle css classes
     * @param {HTMLInputElement} clone
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

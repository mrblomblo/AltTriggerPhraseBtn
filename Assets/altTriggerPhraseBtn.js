class TriggerPhraseCopyHelper {
    static DRAG_THRESHOLD_PX = 6;
    static DRAG_RESET_TIMEOUT = 50;
    static CONTEXT_MENU_RESET_TIMEOUT = 500;

    state = {
        recentDrag: false,
        recentContextMenu: false
    };

    pointerDownPosition = null;

    constructor() {
        if (window.__triggerPhraseCopyHelper) {
            return window.__triggerPhraseCopyHelper;
        }

        window.__triggerPhraseCopyHelper = this;
        this.setupEventListeners();
        this.setupMutationObserver();
        this.exposeGlobalHandler();
    }

    setupEventListeners() {
        document.addEventListener('pointerdown', e => this.handlePointerDown(e), true);
        document.addEventListener('pointermove', e => this.handlePointerMove(e), true);
        document.addEventListener('pointerup', () => this.handlePointerUp(), true);
        document.addEventListener('contextmenu', () => this.handleContextMenu(), true);
    }

    handlePointerDown(event) {
        this.pointerDownPosition = { x: event.clientX, y: event.clientY };
    }

    handlePointerMove(event) {
        if (!this.pointerDownPosition) return;

        const dx = event.clientX - this.pointerDownPosition.x;
        const dy = event.clientY - this.pointerDownPosition.y;

        if (Math.hypot(dx, dy) > TriggerPhraseCopyHelper.DRAG_THRESHOLD_PX) {
            this.state.recentDrag = true;
        }
    }

    handlePointerUp() {
        // Delay reset to prevent clicks immediately after a drag from firing
        setTimeout(() => { this.state.recentDrag = false; }, TriggerPhraseCopyHelper.DRAG_RESET_TIMEOUT);
        this.pointerDownPosition = null;
    }

    handleContextMenu() {
        this.state.recentContextMenu = true;
        setTimeout(() => { this.state.recentContextMenu = false; }, TriggerPhraseCopyHelper.CONTEXT_MENU_RESET_TIMEOUT);
    }

    exposeGlobalHandler() {
        window.handleCopyTriggerButtonClick = (event, copyTextString) => {
            return this.handleCopyButtonClick(event, copyTextString);
        };
    }

    handleCopyButtonClick(event, copyTextString) {
        try {
            if (!this.shouldHandleClick(event)) return true;

            // Yield to the browser to ensure UI updates aren't blocked
            setTimeout(() => this.performCopy(copyTextString), 0);
        }
        catch (error) {
            console.error('Copy button click error:', error);
            return true;
        }

        return false;
    }

    shouldHandleClick(event) {
        if (event?.button && event.button !== 0) return false;
        if (event?.detail > 1) return false; // Ignore double/triple clicks
        if (this.state.recentDrag) return false;
        if (this.state.recentContextMenu) return false;

        return true;
    }

    performCopy(copyTextString) {
        try {
            this.copyToClipboard(copyTextString);
            this.showNotification();
        }
        catch (error) {
            console.error('Copy handler error:', error);
        }
    }

    copyToClipboard(text) {
        if (typeof window.copyText === 'function') {
            window.copyText(text);
        }
        else if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).catch(() => { });
        }
        else {
            this.fallbackCopy(text);
        }
    }

    fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
        }
        catch {
            /* Silently fail */
        }

        textarea.remove();
    }

    showNotification() {
        if (typeof window.doNoticePopover === 'function') {
            window.doNoticePopover('Copied!', 'notice-pop-green');
        }
    }

    setupMutationObserver() {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue;

                    // Check if the added node is a trigger button, or contains one
                    if (node.matches('button.trigger-phrase-copy-button')) {
                        this.transformButton(node);
                    }
                    node.querySelectorAll('button.trigger-phrase-copy-button').forEach(btn => {
                        this.transformButton(btn);
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    transformButton(button) {
        if (button.dataset.transformed) return; // Prevent double-processing
        button.dataset.transformed = "true";

        let phrase = button.previousSibling?.nodeType === Node.TEXT_NODE ? button.previousSibling.textContent.trim() : button.textContent.trim();

        const match = (button.getAttribute('onclick') || '').match(/copyText\('([^']+)'\)/);
        let copyPhrase = match ? match[1] : phrase;

        if (this.shouldAddTrailingComma() && !copyPhrase.endsWith(',')) {
            copyPhrase += ', ';
        }

        const safePhrase = escapeHtmlNoBr(phrase);
        const safeCopy = escapeJsString(copyPhrase);

        button.innerHTML = `
        <span class="trigger-phrase-text">${safePhrase}</span>
        <span class="copy-icon" aria-hidden="true">\u29C9</span>
        `;

        button.setAttribute('title', 'Click to copy');
        button.className = 'basic-button trigger-phrase-copy-button';
        button.setAttribute('onclick', `return handleCopyTriggerButtonClick(event, '${safeCopy}')`);

        if (button.previousSibling?.nodeType === Node.TEXT_NODE) {
            button.previousSibling.remove();
        }
    }

    shouldAddTrailingComma() {
        return typeof getUserSetting === 'function' && getUserSetting('ui.copytriggerphrasewithtrailingcomma', false);
    }
}

// Initialize
new TriggerPhraseCopyHelper();

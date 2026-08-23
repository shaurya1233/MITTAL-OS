/**
 * MITTAL OS Window Manager Engine
 * Dynamic window positioning, focus stacking, resizing, and dragging.
 */

export class WindowManager {
    constructor() {
        this.container = document.getElementById('window-container');
        this.windows = new Map();
        this.activeWindowId = null;
        this.highestZ = 100;
    }

    createWindow(config) {
        const { id, title, icon = '🗔', content, width = 640, height = 400 } = config;

        if (this.windows.has(id)) {
            this.focusWindow(id);
            return;
        }

        const winEl = document.createElement('div');
        winEl.className = 'os-window';
        winEl.id = `win-${id}`;
        winEl.style.width = `${width}px`;
        winEl.style.height = `${height}px`;
        winEl.style.left = `${Math.max(40, 100 + this.windows.size * 30)}px`;
        winEl.style.top = `${Math.max(40, 50 + this.windows.size * 30)}px`;

        winEl.innerHTML = `
            <div class="window-header">
                <div class="window-title"><span>${icon}</span> <span>${title}</span></div>
                <div class="window-controls">
                    <button class="control-btn min-btn">—</button>
                    <button class="control-btn max-btn">☐</button>
                    <button class="control-btn close-btn">✕</button>
                </div>
            </div>
            <div class="window-body">${content}</div>
        `;

        this.container.appendChild(winEl);
        this.windows.set(id, { element: winEl, config });

        this._setupDrag(winEl);
        this.focusWindow(id);

        winEl.querySelector('.close-btn').onclick = () => this.closeWindow(id);
        winEl.addEventListener('mousedown', () => this.focusWindow(id));
    }

    focusWindow(id) {
        const win = this.windows.get(id);
        if (!win) return;

        this.windows.forEach(w => w.element.classList.remove('active-window'));
        this.highestZ += 1;
        win.element.style.zIndex = this.highestZ;
        win.element.classList.add('active-window');
        this.activeWindowId = id;
    }

    closeWindow(id) {
        const win = this.windows.get(id);
        if (win) {
            win.element.remove();
            this.windows.delete(id);
        }
    }

    _setupDrag(winEl) {
        const header = winEl.querySelector('.window-header');
        let isDragging = false, startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = winEl.offsetLeft;
            initialTop = winEl.offsetTop;

            const onMouseMove = (moveEvent) => {
                if (!isDragging) return;
                winEl.style.left = `${initialLeft + (moveEvent.clientX - startX)}px`;
                winEl.style.top = `${initialTop + (moveEvent.clientY - startY)}px`;
            };

            const onMouseUp = () => {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
}

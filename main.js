/**
 * MITTAL OS Main Entry Point & Boot Sequence Controller
 */

import { VFS } from './storage.js';
import { WindowManager } from './window-manager.js';

class MittalOS {
    constructor() {
        this.wm = new WindowManager();
        this.currentUser = 'shaurya';
    }

    async boot() {
        console.log('MITTAL OS Kernel Initializing...');
        
        try {
            await VFS.init();
            this._setupClock();
            this._setupEventListeners();
            
            // Hide boot screen after 1.5 seconds
            setTimeout(() => {
                const bootScreen = document.getElementById('boot-screen');
                if (bootScreen) {
                    bootScreen.style.opacity = '0';
                    setTimeout(() => bootScreen.classList.add('hidden'), 300);
                }
            }, 1500);

        } catch (err) {
            console.error('OS Boot Failure:', err);
        }
    }

    _setupClock() {
        const updateClock = () => {
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const dateStr = now.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' });

            document.getElementById('taskbar-time').textContent = timeStr;
            document.getElementById('taskbar-date').textContent = dateStr;
            document.getElementById('lock-time').textContent = timeStr;
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    _setupEventListeners() {
        // Skip boot button
        document.getElementById('skip-boot-btn')?.addEventListener('click', () => {
            document.getElementById('boot-screen').classList.add('hidden');
        });

        // Start Menu Toggle
        const startBtn = document.getElementById('start-menu-btn');
        const startMenu = document.getElementById('start-menu');
        
        startBtn?.addEventListener('click', () => {
            startMenu.classList.toggle('hidden');
        });

        // Quick Settings Toggle
        const actionBtn = document.getElementById('action-center-btn');
        const quickSettings = document.getElementById('quick-settings-panel');

        actionBtn?.addEventListener('click', () => {
            quickSettings.classList.toggle('hidden');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const os = new MittalOS();
    os.boot();
});

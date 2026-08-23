/**
 * MITTAL OS Core Kernel Entry Point
 * C99 Architecture Foundation
 */

#include "../include/kernel.h"

void kernel_main(void) {
    terminal_initialize();
    terminal_writestring("MITTAL OS Kernel v1.0.0 (x86_64)\n");
    terminal_writestring("Copyright (c) 2026 Shaurya Mittal. All rights reserved.\n");

    // Initialize Memory Management & Scheduler
    init_memory_manager();
    init_scheduler();

    terminal_writestring("[SUCCESS] Kernel Architecture Services Live.\n");

    while (1) {
        __asm__ __volatile__("hlt");
    }
}

static uint16_t* const VGA_MEMORY = (uint16_t*) 0xB8000;
static size_t terminal_row = 0;
static size_t terminal_column = 0;

void terminal_initialize(void) {
    for (size_t y = 0; y < 25; y++) {
        for (size_t x = 0; x < 80; x++) {
            const size_t index = y * 80 + x;
            VGA_MEMORY[index] = (uint16_t) ' ' | (uint16_t) 0x0F << 8;
        }
    }
}

void terminal_writestring(const char* data) {
    for (size_t i = 0; data[i] != '\0'; i++) {
        if (data[i] == '\n') {
            terminal_row++;
            terminal_column = 0;
            continue;
        }
        const size_t index = terminal_row * 80 + terminal_column;
        VGA_MEMORY[index] = (uint16_t) data[i] | (uint16_t) 0x0F << 8;
        terminal_column++;
    }
}

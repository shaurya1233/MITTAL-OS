#ifndef MITTAL_KERNEL_H
#define MITTAL_KERNEL_H

#include <stddef.h>
#include <stdint.h>

void kernel_main(void);
void terminal_initialize(void);
void terminal_writestring(const char* data);

void init_memory_manager(void);
void init_scheduler(void);

#endif

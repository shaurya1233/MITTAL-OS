# MITTAL OS Master Native Build System

CC = gcc
CFLAGS = -m64 -ffreestanding -O2 -Wall -Wextra -std=c99
NASM = nasm

BUILD_DIR = build

all: setup bootloader kernel

setup:
	mkdir -p $(BUILD_DIR)

bootloader: boot/boot.asm
	$(NASM) -f bin boot/boot.asm -o $(BUILD_DIR)/boot.bin

kernel: kernel/src/kernel.c
	$(CC) $(CFLAGS) -c kernel/src/kernel.c -o $(BUILD_DIR)/kernel.o

clean:
	rm -rf $(BUILD_DIR)

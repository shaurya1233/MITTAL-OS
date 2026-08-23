; MITTAL OS Low-Level Bootloader Core
; Target: x86_64 Real-to-Protected Mode Initialization

[BITS 16]
[ORG 0x7C00]

boot_entry:
    cli                         ; Clear interrupts
    xor ax, ax
    mov ds, ax
    mov es, ax
    mov ss, ax
    mov sp, 0x7C00

    mov si, boot_msg
    call print_string_16

    ; Transition to Protected Mode
    lgdt [gdt_descriptor]
    mov eax, cr0
    or eax, 1
    mov cr0, eax

    jmp 0x08:init_32bit

print_string_16:
    lodsb
    or al, al
    jz .done
    mov ah, 0x0E
    int 0x10
    jmp print_string_16
.done:
    ret

boot_msg db 'MITTAL OS Native Bootloader Initialized.', 0x0D, 0x0A, 0

; Global Descriptor Table
gdt_start:
    dq 0x0
gdt_code:
    dw 0xFFFF, 0x0000, 0x9A00, 0x00CF
gdt_data:
    dw 0xFFFF, 0x0000, 0x9200, 0x00CF
gdt_end:

gdt_descriptor:
    dw gdt_end - gdt_start - 1
    dd gdt_start

[BITS 32]
init_32bit:
    mov ax, 0x10
    mov ds, ax
    mov ss, ax
    mov esp, 0x90000
    
    ; Kernel Jump Placeholder
    hlt

times 510 - ($ - $$) db 0
dw 0xAA55

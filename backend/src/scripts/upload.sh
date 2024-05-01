#!/bin/bash

if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <VM_ID> <VM_USERNAME> <file1> [file2] [...]"
    exit 1
fi

VM_ID=$1
VM_USERNAME=$2

guest_os=$(VBoxManage showvminfo $VM_ID | grep "Guest OS" | awk -F': ' '{print $2}' | sed 's/^[ \t]*//;s/[ \t]*$//' | awk -F' ' '{print $1}')

if [[ "$guest_os" == *"Windows"* ]]; then
    VM_DESKTOP_PATH="C:\\Users\\$VM_USERNAME\\Desktop"
else
    VM_DESKTOP_PATH="/home/$VM_USERNAME/Desktop"
fi

# Shift the first three arguments to leave only the file paths in $@
shift 2

for file_path in "$@"; do
    if [ -f "$file_path" ]; then
        filename=$(basename "$file_path")

        VBoxManage guestcontrol "$VM_ID" copyto "$file_path" "$VM_DESKTOP_PATH/$filename" --username "$VM_USERNAME"

        if [ $? -eq 0 ]; then
            echo "File $file_path uploaded successfully to the desktop of VM $VM_ID."
        else
            echo "Failed to upload file $file_path to the desktop of VM $VM_ID."
        fi
    else
        echo "File $file_path not found."
    fi
done

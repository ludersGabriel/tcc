#!/bin/bash

# Check if the number of arguments is at least 3
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <VM_ID> <VM_USERNAME> <file1> [file2] [...]"
    exit 1
fi

VM_ID=$1
VM_USERNAME=$2

# Desktop path for Windows VMs, adjust if you're targeting a different OS
# For Linux VM, it might be something like: /home/$VM_USERNAME/Desktop
VM_DESKTOP_PATH="C:\\Users\\$VM_USERNAME\\Desktop"

# Shift the first three arguments to leave only the file paths in $@
shift 2

# Iterate over the remaining arguments, which are file paths
for file_path in "$@"; do
    if [ -f "$file_path" ]; then
        # Extract filename from path
        filename=$(basename "$file_path")

        # Use VBoxManage to copy the file to the VM's desktop
        VBoxManage guestcontrol "$VM_ID" copyto "$file_path" "$VM_DESKTOP_PATH\\$filename" --username "$VM_USERNAME"

        if [ $? -eq 0 ]; then
            echo "File $file_path uploaded successfully to the desktop of VM $VM_ID."
        else
            echo "Failed to upload file $file_path to the desktop of VM $VM_ID."
        fi
    else
        echo "File $file_path not found."
    fi
done

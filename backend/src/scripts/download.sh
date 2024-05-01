#!/bin/bash

if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <VM_ID> <VM_USERNAME>"
    exit 1
fi

VM_ID=$1
VM_USERNAME=$2

guest_os=$(VBoxManage showvminfo "$VM_ID" | grep "Guest OS" | awk -F': ' '{print $2}' | sed 's/^[ \t]*//;s/[ \t]*$//' | awk -F' ' '{print $1}')

if [[ "$guest_os" == *"Windows"* ]]; then
    VM_OUTPUT_PATH="C:\\Users\\$VM_USERNAME\\Desktop\\output"
    LIST_CMD="cmd.exe"
    LIST_ARGS="/c dir /b $VM_OUTPUT_PATH"
else
    VM_OUTPUT_PATH="/home/$VM_USERNAME/Desktop/output"
    LIST_CMD="/bin/ls"
    LIST_ARGS=$VM_OUTPUT_PATH
fi

LOCAL_DOWNLOAD_DIR="src/outputs/$VM_ID-output"

mkdir -p "$LOCAL_DOWNLOAD_DIR"

VBoxManage guestcontrol "$VM_ID" copyfrom --target-directory "$LOCAL_DOWNLOAD_DIR" "$VM_OUTPUT_PATH" --recursive --username "$VM_USERNAME"
        
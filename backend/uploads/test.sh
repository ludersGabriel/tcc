#!/bin/bash

# Check if the number of arguments is correct
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <VM_ID>"
    exit 1
fi

# Variables
VM_ID=$1

# Power off the VM immediately
VBoxManage controlvm "$VM_ID" poweroff

# Unregister the VM and delete all associated files
VBoxManage unregistervm "$VM_ID" --delete

echo "VM $VM_ID has been deleted successfully."


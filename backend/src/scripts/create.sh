
#!/bin/bash
# Check if the number of arguments is correct
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <OVA_PATH> <RDP_PORT>"
    exit 1
fi

# Variables
OVA_PATH=$1
IMAGE_NAME=$(basename "$OVA_PATH" | cut -d. -f1)  # Extract the base name without the extension
TIMESTAMP=$(date +"%Y%m%d%H%M%S")  # Current timestamp
VM_NAME="${IMAGE_NAME}_${TIMESTAMP}"
RDP_PORT=$2
MEMORY_SIZE=4096

# Import OVA
VBoxManage import "$OVA_PATH" --vsys 0 --vmname "$VM_NAME"

# Set vrdp parameters
VBoxManage modifyvm "$VM_NAME" --vrde on
VBoxManage modifyvm "$VM_NAME" --vrdeport "$RDP_PORT"
VBoxManage modifyvm "$VM_NAME" --vrdeauthtype null
VBoxManage modifyvm "$VM_NAME" --vrdemulticon on

# Find the name of the default network interface
DEFAULT_NET_NAME=$(VBoxManage list bridgedifs | grep "Name:" | head -n 1 | awk '{ print $2 }')

# Set Network parameters
VBoxManage modifyvm "$VM_NAME" --nic1 bridged
VBoxManage modifyvm "$VM_NAME" --bridgeadapter1 "$DEFAULT_NET_NAME"
VBoxManage modifyvm "$VM_NAME" --nicpromisc1 allow-all

# Set Memory parameters
VBoxManage modifyvm "$VM_NAME" --memory "$MEMORY_SIZE"

# set cpu parameters
VBoxManage modifyvm "$VM_NAME" --cpus 4

# Start the VM
VBoxManage startvm "$VM_NAME" --type headless

# Get the VM ID
VM_ID=$(VBoxManage list vms | grep "\"${VM_NAME}\"" | awk '{ print $2 }' | tr -d '{}')

# Output the VM name and ID
echo "VM Name: $VM_NAME"
echo "VM ID: $VM_ID"
#!/bin/bash

VM_ID=$1

VBoxManage showvminfo $VM_ID --machinereadable | grep "VMState=" | cut -d '=' -f2 | tr -d '"' | tr -d '\n'
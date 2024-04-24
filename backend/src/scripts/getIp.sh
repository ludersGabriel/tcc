#!/bin/bash

VM_ID=$1

VBoxManage guestproperty enumerate $VM_ID | grep "IP" | awk '{print $3}' | tr -d "'" | tr -d '\n'

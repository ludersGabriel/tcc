#!/bin/bash

VM_COUNT=$(VBoxManage list vms | wc -l)

echo "Total: $VM_COUNT"
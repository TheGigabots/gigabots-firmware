#!/usr/bin/python

## Quick and dirty way to disply mac address
import subprocess;
import time
raw = subprocess.check_output(['/sbin/ifconfig', 'wlan0'], stderr=subprocess.STDOUT)
lines = raw.split('\n');
line = lines[0]
split = line.split(' ')
print("\n\n\n\n\n\n\n")
print("Will exit after 30 seconds") 
print("######### MAC ########")
print(split[9])
time.sleep(30)

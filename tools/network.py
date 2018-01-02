#!/usr/bin/python
import subprocess;
import os;
import sys;
import ConfigParser;

SSID = ""
PSK  = ""

def execc( cmds ):
  return subprocess.check_output(cmds, stderr=subprocess.STDOUT)

def findAP( name, list ):
  theLine = None

  for line in list.split("\n"):
    if name in line:
      theLine = line.strip()
      break

  if theLine == None:
    return theLine
  else:
    split = theLine.split(" ")
    return split[len(split)-1]

def createConfig(cmSSID):

  split = cmSSID.split("_");
  ssid = split[2]

  file ="""[{0}]
Name={1}
SSID={2}
Passphrase={3}
AutoConnect=true
IPv4.method=dhcp
"""
  cmPrefix = "/var/lib/connman"
  #cmPrefix = "/tmp"
  path = "{0}/{1}".format(cmPrefix,cmSSID)

  try:
    os.mkdir(path)
  except OSError:
    print("{0} exists. continuing".format(path))

  configFile = open("{0}/settings".format(path), "w")
  configFile.write(file.format(cmSSID,SSID,ssid,PSK))
  configFile.close()



### Try to read the config
try:
  config = ConfigParser.ConfigParser()
  config.readfp(open('/boot/flash/network.cfg'))
  SSID = config.get("default", "SSID")
  PSK  = config.get("default", "PSK")
except IOError:
  print("No /boot/flash/network.cfg. Ignoring")
  sys.exit(0)

### Scan wifi
print("Scanning wifi");
execc(['connmanctl','scan','wifi'])
output = execc(['connmanctl','services'])
print("Locating SSID");
cmSSID = findAP(SSID, output)

if cmSSID == None:
  print("Unable to locate SSID.  Could not configure")
  sys.exit(0)

createConfig(cmSSID)
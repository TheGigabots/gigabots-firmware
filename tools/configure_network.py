#!/usr/bin/python
import subprocess;
import os;
import sys;
import time;
import ConfigParser;

def started_as_root():
    if subprocess.check_output('whoami').strip() == 'root':
        return True
    return False

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

def createConfig(cmSSID, SSID, PSK):

  split = cmSSID.split("_");
  ssid = split[2]

  file ="""[service_{1}]
Type = wifi
Name = {1}
Passphrase = {2}
"""
  cmPrefix = "/var/lib/connman"
  path = "{0}/{1}.config".format(cmPrefix, SSID)
  configFile = open(path, "w")
  configFile.write(file.format(cmSSID,SSID,PSK))
  configFile.close()
  print("SSID {0} configured.".format(SSID));
  time.sleep(2);

def configureWifi():

  ### Try to read the config
  try:
    config = ConfigParser.ConfigParser()
    config.readfp(open('/boot/flash/network.cfg'))
    SSID = config.get("default", "SSID")
    PSK  = config.get("default", "PSK")
  except IOError:
    print("No /boot/flash/network.cfg. Ignoring")
    time.sleep(2)
    sys.exit(0)

  ### Scan wifi
  print("");
  print("");
  print("##############");
  print("Scanning wifi");
  execc(['connmanctl','scan','wifi'])
  output = execc(['connmanctl','services'])

  print("Locating SSID {0}".format(SSID));

  cmSSID = findAP(SSID, output)

  if cmSSID == None:
    print("Unable to locate SSID {0}. Could not configure".format(SSID))
    time.sleep(2)
    sys.exit(0)

  createConfig(cmSSID, SSID, PSK)

def main():
    if started_as_root():
        configureWifi()
    else:
        current_script = os.path.realpath(__file__)
        os.system('sudo -S /usr/bin/python %s' % (current_script))

if __name__ == '__main__':
    main()

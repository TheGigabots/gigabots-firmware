FROM ev3dev/ev3dev-jessie-ev3-generic:2017-12-13
## Rsync is used for firmware development
RUN apt-get update && apt-get install rsync

# Add assets to image
ADD fonts                       /
ADD tools/rc.local              /etc/rc.local
ADD tools/connman.settings      /var/lib/connman/settings
ADD dist                        /home/robot/dist
ADD assets                      /home/robot/assets
ADD script                      /home/robot/script
ADD gigabot.sh                  /home/robot
ADD tools/configure_network.py  /home/robot/tools/configure_network.py
ADD tools/show_wifi_mac.py      /home/robot/tools/show_wifi_mac.py

RUN chmod +x                    /etc/rc.local
RUN chmod +x                    /home/robot/gigabot.sh
RUN chmod +x                    /home/robot/tools/configure_network.py
RUN chmod +x                    /home/robot/tools/show_wifi_mac.py

RUN chown -R robot /home/robot/script

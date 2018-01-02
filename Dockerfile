FROM ev3dev/ev3dev-jessie-ev3-generic:2017-12-13
## Rsync is used for firmware development
RUN apt-get update && apt-get install rsync

ADD fonts /
ADD dist /home/robot/dist
ADD assets /home/robot/assets
ADD script /home/robot/script
ADD gigabot.sh /home/robot
ADD tools/network.py /home/robot/tools/network.py
ADD util/show_wifi_mac.py /home/robot/util/show_wifi_mac.py

RUN chown -R robot /home/robot/script

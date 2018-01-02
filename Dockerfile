FROM ev3dev/ev3dev-jessie-ev3-generic:2017-05-08
ADD fonts /

ADD dist /home/robot/dist
ADD assets /home/robot/assets
ADD script /home/robot/script
ADD gigabot.sh /home/robot
ADD tools/network.py /home/robot/tools/network.py


RUN chown -R robot /home/robot/script

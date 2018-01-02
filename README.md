
# The Gigabots Hardware

The Gigabots are [LEGO Mindstorm EV3](https://www.lego.com/en-us/mindstorms/about-ev3) kits with special software that turns them into Internet of Things (IoT) devices.
They are compatible with the [retail](https://www.lego.com/en-us/mindstorms/products/mindstorms-ev3-31313) and [Education Core](https://education.lego.com/en-us/products/lego-mindstorms-education-ev3-core-set-/5003400) sets and sensors.

In addition you need:
 
 * A [SPECIFIC](https://www.amazon.com/Edimax-EW-7811Un-150Mbps-Raspberry-Supports/dp/B003MTTJOY/ref=sr_1_3?ie=UTF8&qid=1508603846&sr=8-3&keywords=edimax+wifi+adapter) WiFi dongle (Edimax EW-7811Un)
 * A microSD or microSDHC card 4GB or larger. microSDXC is not supported. All cards larger than 32GB *will not work*

# The Gigabots EV3 Firmware (Brain)


* Download [Etcher](https://etcher.io/)
* Download [Latest Firmware](https://github.com/TheGigabots/gigabots-firmware/releases)


## Preparing the SD card

* In Etcher, select the firmware file and burn to your SD card.
* Thats it.

_Optional_:  You can disable image verification in options.  This makes the 'burning' process a lot faster.  Click the gear in the top right corner and unselect 'Validate write on success'


## Prepare Gigabot

* Insert SD Card
* Insert USB WiFi Dongle
* Don't forget the batteries :)
* Press center button on EV3 to boot


## WiFI Setup

You *MUST* have a WiFi network with a visible *SSID* that accepts a *password*. 
 
Many WiFi access points implement a scheme called 'captive portal' which requires you to accept terms or otherwise interact with a web page to get access.  This is internet [kryptonite](https://en.wikipedia.org/wiki/Kryptonite) for things like internet connected robots. 

This may be your biggest barrier to creating a Gigabot so make sure to check this out in advance.


* Select `Wireless and Networks`
* Select `Wifi`
* Select `Powered` to enable Wifi
* Select your WiFi network from the list of networks displayed
* Select `Connect`
* You will be prompted for a password, hit center button.
* Use Up/Down/Left/Right buttons to select password.  Note these are case sensitive and available case options
* When finished select `Ok` the select `Accept`

If everything went well you should see `Status: Online`. Use the back button to navigate up to main menu.


## Connect The Gigabot

* Select `File Browser`
* Navigate to `gigabot.sh` and select.

It make take 30 seconds or so to see any output.  The text is currently exceptionally tiny.

You should eventually see text like the following:

      ____   _  _  __ __   _____ 
     |  _ \ / || |/ // /_ |___ / 
     | | | || || ' /| '_ \  |_ \ 
     | |_| || || . \| (_) |___) |
     |____/ |_||_|\_\\___/|____/ 
                                 
                             v0.0.7
    [brain] Brain -> configured as D1K63
    [brain] Network init()
    
Note that your Gigabot will have a unique short code.  Congratulations.  It works.    

## Disconnecting

Use the back button to disconnect.



## Advanced WiFi Credentials and Networking

### Config file

It may be preferable to supply the network credentials via a configuration file.  After you burn your firmware
create a file called `network.cfg` and place it in the root directory of the firmware image.

The format of the configuration file is:


    SSID=<your network SSID>
    PSK=<your network password>


Note that this will override any configuration you perform using the menu and will be applied after every restart of the bot.

### Display WifI MAC


Some networks require a whitelisted MAC.

* Select `Wireless and Networks`
* Select `Wifi`
* Select `Powered` to enable Wifi
* `Back` button to main menu
* Select `File Browser`
* Select `tools`
* Select `show_wifi_mac.py*`













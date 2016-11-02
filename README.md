** NEEDS SOME REWORK **


# fillEPG
**fillEPG** is an Widget/App for Samsung Smart Hub TVs.

After startup, fillEPG will dime your TVs audio, switches to 
the next channel in your favourites list, every five seconds,
by simply calling 'tuneUP()', when it reaches it starting 
channel again, it will restore the previous volume level and
exit.

After that your EGP should be filled with information about 
running programs.

Only tested on **UE55H6770** with Firmware T-GFSDEUC-1300.2,BT-S/G,
but should work with any Samsung TV up to 2014 models, not sure 
about later models


## Remote Control Keys
To **Control** the Widget you can use the following Keys on your Remote.

**Left/Right** to lower/raise seconds to wait. Can't go under 1 Second.

**UP** Enable/Disable Debug Output -- see Debug below

**Down** Hide/Unhide Lower Panel

**Volume Up/Down** to change the Volume.

**Mute** Mute/Unmute Volume

**OK/Enter** to pause/resume channel switching

**Info** to hide/unhide info screen


## Install
To install you need an SmartTV with **'develop'-Account** enabled.

#### USB or Webserver App Sync
I used Webserversync, because USB-install is deactivated in my 
TVs firmware, so i cant help out with this.

If you sync through webserver you will need **'widgetlist.xml'**
in your webserver-root.

#### Install with JS/CSS packaged into zipfile
If you want packed everything in an zipfile just follow this:
Put everything in an zipfile, index.html and config.xml
must reside in the **root**-dir of the zipfile, not in an
subfolder.

Copy the zipfile to your webserver, **into the right path**, 
or change widgetlist.xml according too.
Enter IP of your webserver on TV and start syncing.

#### Install with JS/CSS loaded from external server
Better way to handle things is to load js/css from an external
webserver. This wil prevent a caching problem with Samsung TVs.

In order to do this, uncomment in **'index.html'** the external
request for js and css, change path and ip according your needs.

**Don't forget, comment the entrys for the locale js/css files**

Pack **'index.html'** and at least **'config.xml'** into the root 
of the zipfile. 

Put your css and js into your webservers path
which is used in **'index.html'**. 

Sync once with TV, and after that you will be able to change the 
scripts as you like, you just have to restart the app to see your changes.

## Debug Smart TV App
To debug your app with either 'alert' or 'console.log' after your 
uploaded it, 

you should use this little thing: [Debug Monitor](https://gist.github.com/janmonschke/4992216 "Debug Monitor")

or use Google Chrome Remote Web Inspector

## ToDo
'getChannelList()' doesnt seem to work, needs mor investigation.

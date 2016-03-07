# fillEPG
fillEPG is an Widget/App for Samsung Smart Hub TVs.

After startup, fillEPG will switch to every channel
in your favourites list, every three seconds, by simply calling
'tuneUP()', when it reaches it starting channel again, it will
exit.
After that your EGP should be filled with information about 
running programs.

Only tested on UE55H6770 with Firmware T-GFSDEUC-1300.2,BT-S/G,
but should work with any Samsung TV up to 2014 models, not sure 
about later models

# ToDo
'getChannelList()' doesnt seem to work, need some investigation,
thats the reason why i hardcoded my 44 channels.

set 'fullscreen' to 'yes' in config.xml, to prevent channellist
on the right side of screen to pop up after each channel switch.

investigate why 'fullscreen=y' and 'audiomute=y' doesn't
mute the audio while the widget is running. According to the
documentation it should mute like this, when set in 
config.xml

if above wont work, try to use 'audiocontrol' to mute it 

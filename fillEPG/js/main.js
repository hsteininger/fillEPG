"use strict";
//Interfaces
var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var audioControlObject = webapis.audiocontrol;

var tuneIt;
var holdIt;
var successCB;
var errorCB;
var remoteControlEvent;

//Variables
var savedChannelName;
var curChannelName;
//var myContent;
var myCounter = 0;
var waitSeconds = 5;
var oldVolume;
var shouldRun = true;
var myDebug = false;

//main
window.onload = function () {

    if (myDebug) {alert("--- entered onload ---");}

    //get volume
    oldVolume = audioControlObject.getVolume();

    //dime volume
    audioControlObject.setVolume(oldVolume-2);

    //mute audio
    //audioControlObject.setMute(true);

    //this.enableKeys();
    //addEventlistener for keydown
    top.document.documentElement.addEventListener('keydown', remoteControlEvent);
    //document.getElementById("content1").addEventListener('keydown', remoteControlEvent);

    //get my content pane
    //myContent = document.getElementById("status");
    //myContent.style.textAlign = "left";
    //myContent.style.color = "white";

    //channelname and info
    var startChannel = webapis.tv.channel.getCurrentChannel();
    savedChannelName = startChannel.channelName;

    //how much channels do we have - need further investigation
    //look up here: http://www.samsungdforum.com/SamsungDForum/ForumView/df3455b529adf7c4?forumID=12aa9c2241f919a9
    //webapis.tv.channel.getChannelList(successListCB, null, webapis.tv.channel.NAVIGATOR_MODE_FAVORITE, 0);
    //webapis.tv.channel.getChannelList(successListCB, errorCB, webapis.tv.channel.NAVIGATOR_MODE_FAVORITE, 0);

    //Widget ready
    widgetAPI.sendReadyEvent();

    //better start with holdIT() to give some time to the widget
    if (shouldRun) {
    holdIt();
    }
};

// Event handling function.
function remoteControlEvent(e) {
    //var keyCode = event.keyCode;
    var keyCode = e.keyCode;

    alert("--- KeyHandling --- " + e.keyCode + " + " + keyCode);

    switch (keyCode) {
        case tvKey.KEY_LEFT:
        if (myDebug) {alert("--- LEFT ---");}
        waitSeconds -=1;
            break;
        case tvKey.KEY_RIGHT:
        if (myDebug) {alert("--- RIGHT ---");}
        waitSeconds +=1;
            break;
        case tvKey.KEY_UP:
        if (myDebug) {alert("--- UP ---");}
            break;
        case tvKey.KEY_DOWN:
        if (myDebug) {alert("--- DOWN ---");}
            break;
        case tvKey.KEY_ENTER:
        if (myDebug) {alert("--- ENTER ---");}
        if (shouldRun) {
            shouldRun = false;
        } else {
            shouldRun = true;
            tuneIt();
        }
            break;
        case tvKey.KEY_RETURN:
        //on return set volume back to where we started
        audioControlObject.setVolume(oldVolume);
        if (myDebug) {alert("--- RETURN ---");}
            break;
    case tvKey.KEY_EXIT:
        //on exit set volume back to where we started
        audioControlObject.setVolume(oldVolume);
        if (myDebug) {alert("--- EXIT ---");}
        break;
    case tvKey.KEY_VOL_UP:
        if (myDebug) {alert("--- VOL UP ---");}
        audioControlObject.setVolumeUp();
        break;
    case tvKey.KEY_VOL_DOWN:
        if (myDebug) {alert("--- VOL DOWN ---");}
        audioControlObject.setVolumeDown();
        break;
    case tvKey.KEY_INFO:
        if (myDebug) {alert("--- INFO ---");}
        if (document.getElementById("content1").style.visibility == "hidden") {
            document.getElementById("content1").style.visibility = "visible";
        } else {
            document.getElementById("content1").style.visibility = "hidden";
        }
        break;
    }
};

////channelListSuccessCallBack
//function successListCB(channelList) {
//        if (myDebug) {
//      alert("--- All Channels: : " + channelList.length);
//      for(chan in channelList) {
//          alert("------ Channellist: " + chan);
//              for(item in chan) {
//              alert("--------- Item: " + item);
//                  for(i in item) {
//                  alert("------------ I: " + i);
//              }
//          };
//      };
//  };
//};

//tuneUpSuccessCallBack
function successCB() {
    //channelName and running program info
    var curChannel = webapis.tv.channel.getCurrentChannel();
    var curProgram = webapis.tv.channel.getCurrentProgram();
    curChannelName = curChannel.channelName;

    //$("#myP").text("Hello World");

    //get my content pane
    var myContent = document.getElementById("status");
    myContent.style.textAlign = "left";
    myContent.style.color = "white";


    //put info on TV
    widgetAPI.putInnerHTML(myContent,"#: " + (myCounter +=1) + "<br>C: " + curChannelName + "<br>P: " + curProgram.title + "<br>Seconds (l/r): " + waitSeconds + "<br>Volume: " + audioControlObject.getVolume() + "<br>Running: " + shouldRun);

        if (myDebug) {
        alert("--- Channel: " + curChannelName + " --- Program: " + curProgram.title + " --- Description: " + curProgram.detailedDescription);
    }

    //test if current channel is the channel we started, if so quit widget
    if (savedChannelName == curChannelName) {

        alert("--- Starting Channel Reached ---");

        //set volume back to where we started
        audioControlObject.setVolume(oldVolume);

        //unmute audio
        //audioControlObject.setMute(false);

        //let the TV know that we are ready
        widgetAPI.sendExitEvent();
    }
};

//tuneUpErrorCallBack
function errorCB(error) {
        alert("--- ERROR --- : " + error.name);
};

//wait X seconds than jump to tuneIt()
function holdIt() {
        if (myDebug) {alert("--- Waiting " + waitSeconds + " seconds ---");}

    if (waitSeconds < 1) {
        waitSeconds = 1;
    }

    setTimeout(tuneIt,waitSeconds*1000);
};

//switch the channel up by one,after that jump to holdIt()
function tuneIt() {
        if (myDebug) {alert("--- try to tuneup ---");}

    if (!shouldRun) { return; }

    webapis.tv.channel.tuneUp(successCB, errorCB, webapis.tv.channel.NAVIGATOR_MODE_FAVORITE, 0);

    holdIt();
};

////onbeforeunload
//window.onbeforeunload = function() {
//        if (myDebug) { alert("--- entered onbeforeunload ---"); }
//}

////onunload
//window.onunload = function() {
//        if (myDebug) { alert("--- entered onunload ---"); }
//}

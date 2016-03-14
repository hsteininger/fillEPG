"use strict";

//Interfaces
var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var audioControlObject = webapis.audiocontrol;

//UI
var mainFrame;
var mainFrameBody;
var mainFrameBodyContent1;
var mainFrameBodyContent2;
var myContent;
var myPanel;

//Variables
var savedChannelName;
var curChannelName;
var curProgramTitle;

var myCounter = 0;
var waitSeconds = 4;
var oldVolume = 0;

var isMuted = false;
var shouldRun = true;
var myDebug = false;

//main
window.onload = function () {

    if (myDebug) {alert("--- entered onload ---");}

    //get volume and mute state
    oldVolume = audioControlObject.getVolume();
    isMuted = audioControlObject.getMute();

    //dime volume
    if (oldVolume > 5 && !isMuted) {
       audioControlObject.setVolume(oldVolume-2);
    }

    //addEventlistener for keydown
    top.document.documentElement.addEventListener('keydown', remoteControlEvent);

    //get my content and panel
    myContent = document.getElementById("status");
    myContent.style.textAlign = "left";
    myContent.style.color = "white";
    myPanel = document.getElementById("myP");

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

    if (myDebug) {alert("--- KeyHandling --- " + e.keyCode);}

    switch (e.keyCode) {
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
        //if (myDebug) {alert("--- RETURN ---");}
        //on return set volume back to where we started
        //audioControlObject.setVolume(oldVolume);
        //    break;
      case tvKey.KEY_EXIT:
        if (myDebug) {alert("--- RETURN & EXIT ---");}
        //on exit set volume back to where we started
        if (!isMuted) {audioControlObject.setVolume(oldVolume);}
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
    updateInfo();
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

//update info pane
function updateInfo() {
    if (myDebug) {alert("--- Update Info ---");}
    //put info on TV
    widgetAPI.putInnerHTML(myContent,"Count: " + (myCounter) + "<br>Channel: " + curChannelName + "<br>Program: " + curProgramTitle + "<br>Sec (l/r): " + waitSeconds + "<br>Vol/Muted: " + audioControlObject.getVolume() + "/" + isMuted + "<br>Running (OK): " + shouldRun);
    //widgetAPI.putInnerHTML(myPanel,"Count: " + (myCounter) + "<br>Channel: " + curChannelName + "<br>Program: " + curProgramTitle + "<br>Sec (l/r): " + waitSeconds + "<br>Vol/Muted: " + audioControlObject.getVolume() + "/" + isMuted + "<br>Running (OK): " + shouldRun);
}

//tuneUpSuccessCallBack
function successCB() {
    //channelName and running program info
    var curChannel = webapis.tv.channel.getCurrentChannel();
    var curProgram = webapis.tv.channel.getCurrentProgram();
    curChannelName = curChannel.channelName;
    curProgramTitle = curProgram.title;

    myCounter +=1;

    updateInfo();

    //$("#myP").text("Hello World");

    if (myDebug) {
        alert("--- Channel: " + curChannelName + " --- Program: " + curProgramTitle + " --- Description: " + curProgram.detailedDescription);
    }

    //test if current channel is the channel we started, if so quit widget
    if (savedChannelName == curChannelName) {

        alert("--- Starting Channel Reached ---");

        //set volume back to where we started
        if (!isMuted) {audioControlObject.setVolume(oldVolume);}

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

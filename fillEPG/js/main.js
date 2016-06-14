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
var mainFrameBodyContent3;
var myStatus;
var myPanel;
var myswitchBackPanel;
var myCanvas;

//Colors
var randColor = "white";

//Variables
var curChannel;
var curChannelName;
var curProgram;
var curProgramTitle;
var savedChannelName;
var startChannel;

var setTimeoutHandle;
var updateInfoInterval;

var myCounter = 0;
var waitSeconds = 5;
var oldVolume = 0;

//390 Seconds, 420 seems a little bit too much
var def_Timeout = 390;
//var def_Timeout = 15;
var myTimeout = def_Timeout;

var runInfinity = false;
var isMuted = false;
var sbRun = false;
var shouldRun = true;
var myDebug = false;

//main
window.onload = function () {

    if (myDebug) {alert("--- entered onload ---");}

    //check for WebAudioAPI
    var contextClass = (window.AudioContext ||
       window.webkitAudioContext ||
       window.mozAudioContext ||
       window.oAudioContext ||
       window.msAudioContext);
     if (contextClass) {
       // Web Audio API is available.
       //var audioContext = new contextClass();
       if (myDebug) {alert("--- WebAudioAPI availabale ---");}
      } else {
       // Web Audio API is not available. Ask the user to use a supported browser.
       if (myDebug) {alert("--- WebAudioAPI not available ---");}
      }

    //get volume and mute state
    oldVolume = audioControlObject.getVolume();
    isMuted = audioControlObject.getMute();

    //dime volume
    if (oldVolume > 5 && !isMuted) {
       audioControlObject.setVolume(oldVolume-2);
    }

    //addEventlistener for keydown
    top.document.documentElement.addEventListener('keydown', remoteControlEvent);

    //get all my elements by id
    mainFrame = parent.document.getElementById("mainframe");
    mainFrameBody = document.getElementById("mainbody");
    mainFrameBodyContent1 = document.getElementById("content1");
    mainFrameBodyContent2 = document.getElementById("content2");
    mainFrameBodyContent3 = document.getElementById("content3");
    myStatus = document.getElementById("status");
    myStatus.style.textAlign = "left";
    myStatus.style.color = randColor;
    myPanel = document.getElementById("myP");
    myPanel.style.textAlign = "left";
    myPanel.style.visibility = "hidden";
    myswitchBackPanel = document.getElementById("myswitchBackPanel");
    myCanvas = document.getElementById("myCanvas");

    //channelname from where we started
    startChannel = webapis.tv.channel.getCurrentChannel();
    savedChannelName = startChannel.channelName;
    if (myDebug) {alert("--- startChannel --- : " + startChannel.major + " - " + startChannel.minor);}

    //how much channels do we have - need further investigation
    //look up here: http://www.samsungdforum.com/SamsungDForum/ForumView/df3455b529adf7c4?forumID=12aa9c2241f919a9
    //webapis.tv.channel.getChannelList(successListCB, null, webapis.tv.channel.NAVIGATOR_MODE_FAVORITE, 0);
    //webapis.tv.channel.getChannelList(successListCB, errorCB, webapis.tv.channel.NAVIGATOR_MODE_FAVORITE, 0);

    //Widget ready
    widgetAPI.sendReadyEvent();

    //Update myStatus
    //updateInfoInterval = setInterval(updateInfo,1000);
    updateInfo();

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
        waitSeconds --;
        break;
      case tvKey.KEY_RIGHT:
        if (myDebug) {alert("--- RIGHT ---");}
        waitSeconds ++;
        break;
      case tvKey.KEY_UP:
        if (myDebug) {alert("--- UP ---");}
        if (mainFrameBodyContent1.style.visibility == "hidden") {
            mainFrameBodyContent1.style.visibility = "visible";
        } else {
            mainFrameBodyContent1.style.visibility = "hidden";
        }
        break;
      case tvKey.KEY_DOWN:
        if (myDebug) {alert("--- DOWN ---");}
        if (myPanel.style.visibility == "hidden") {
            myPanel.style.visibility = "visible";
        } else {
            myPanel.style.visibility = "hidden";
        }
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
      case tvKey.KEY_PANEL_CH_UP:
      case tvKey.KEY_CH_UP:
      case tvKey.KEY_WHEELUP:
        if (myDebug) {alert("--- CHANNEL UP ---");}
        webapis.tv.channel.tuneUp(function(){if (myDebug){alert("--- CHANNEL TUNED UP ---");}}, errorCB, webapis.tv.channel.NAVIGATOR_MODE_FAVORITE, 0);
        break;
      case tvKey.KEY_PANEL_CH_DOWN:
      case tvKey.KEY_CH_DOWN:
      case tvKey.KEY_WHEELDOWN:
        if (myDebug) {alert("--- CHANNEL DOWN ---");}
        webapis.tv.channel.tuneDown(function(){if (myDebug){alert("--- CHANNEL TUNED DOWN ---");}}, errorCB, webapis.tv.channel.NAVIGATOR_MODE_FAVORITE, 0);
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
        oldVolume = audioControlObject.getVolume();
        break;
      case tvKey.KEY_VOL_DOWN:
        if (myDebug) {alert("--- VOL DOWN ---");}
        audioControlObject.setVolumeDown();
        oldVolume = audioControlObject.getVolume();
        break;
      case tvKey.KEY_MUTE:
        if (myDebug) {alert("--- MUTE ---");}
        if (!isMuted) {
           audioControlObject.setMute(true);
           isMuted = true; 
        } else {
           audioControlObject.setMute(false); 
           isMuted= false;
        }
        break;
      case tvKey.KEY_INFO:
        if (myDebug) {alert("--- INFO ---");}
        if (!myDebug) {
           alert("--- Turn Debug On ---");
           myDebug = true;
        } else {
           alert("--- Turn Debug Off ---");
           myDebug = false;
        }
        break;
      case tvKey.KEY_YELLOW:
        if (myDebug) {alert("--- YELLOW ---");}
	if (!runInfinity) {
	   runInfinity = true;
	} else {
	   runInfinity = false;
	}
        break;
      case tvKey.KEY_RED:
        if (myDebug) {alert("--- RED ---");}
        if (myDebug) {alert("--- Switchback entered");}
        if ( sbRun == false ) {
          shouldRun = false;
          sbRun = true;
          mainFrameBodyContent1.style.visibility = "hidden";
          mainFrameBodyContent3.style.visibility = "visible";
          mainFrameBodyContent3.style.backgroundColor = "red";
          mainFrameBodyContent3.style.color = "white";
          updateInfoInterval = setInterval(updateSwitchBackPanel,1000);
          setTimeoutHandle = setTimeout(switchBack,myTimeout*1000);
        } else {
          clearTimeout(setTimeoutHandle);
          myTimeout -= 30;
          setTimeoutHandle = setTimeout(switchBack,myTimeout*1000);
        }
        widgetAPI.putInnerHTML(mainFrameBodyContent3,myTimeout);
        break;
      case tvKey.KEY_GREEN:
        if (myDebug) {alert("--- GREEN ---");}
	if ( sbRun == true ) {
          clearTimeout(setTimeoutHandle);
          myTimeout += 30;
          setTimeoutHandle = setTimeout(switchBack,myTimeout*1000);
          widgetAPI.putInnerHTML(mainFrameBodyContent3,myTimeout);
	}
        break;
      case tvKey.KEY_BLUE:
        if (myDebug) {alert("--- BLUE ---");}
        randColor = randomColors();
        myStatus.style.color = randColor;
        myPanel.style.color = randColor;
        if (myDebug) {alert("--- randColor: "+ randColor + " ---");}
        break;
//      case tvKey.KEY_####:
//        if (myDebug) {alert("--- ####### CHANGE ME ######## ---");}
//
//        break;
    }
    updateInfo();
}

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

//switchBack function
function switchBack() {
    if (myDebug) {alert("--- switchBack Function ---");}
    try {
         webapis.tv.channel.tune(startChannel,successCB,errorCB);
    } catch(e){
         if (myDebug) {alert("--- switchBack-Error : "+ e.code + " - " + e.type + " - " + e.message + " ---");}
    }
    mainFrameBodyContent1.style.visibility = "visible";
    mainFrameBodyContent3.style.visibility = "hidden";
    clearInterval(updateInfoInterval);
    myTimeout=def_Timeout;
}

//update info pane
function updateInfo() {
    if (myDebug) {alert("--- Update Info ---");}
    curChannel = webapis.tv.channel.getCurrentChannel();
    curProgram = webapis.tv.channel.getCurrentProgram();
    curChannelName = curChannel.channelName;
    curProgramTitle = curProgram.title;

    widgetAPI.putInnerHTML(myStatus,"Count: " + (myCounter) + "<br>Channel: " + curChannelName + "<br>Program: " + curProgramTitle + "<br>Sec (l/r): " + waitSeconds + "<br>Vol/Muted: " + audioControlObject.getVolume() + "/" + isMuted + "<br>Running (OK): " + shouldRun + "<br>Debug (u): " + myDebug + " --- Color (blue): " + randColor + "<br>Infinity (yellow): " + runInfinity);

    //only update panel if visible, until i found something better it is just a clone view of myStatus, maybe output debug later
    //if (myPanel.style.visibility == "visible") {
       widgetAPI.putInnerHTML(myPanel,"Count: " + (myCounter) + "<br>Channel: " + curChannelName + "<br>Program: " + curProgramTitle + "<br>Sec (l/r): " + waitSeconds + " --- Vol/Muted: " + audioControlObject.getVolume() + "/" + isMuted + " --- Running (OK): " + shouldRun + " --- Debug: " + myDebug + " --- Color (blue): " + randColor + " --- Infinity (yellow): " + runInfinity);
    //}
}

//update switchback panel
function updateSwitchBackPanel() {
    if (myDebug) {alert("--- UPDATESWITCHBACKCHANNEL ---");}
        widgetAPI.putInnerHTML(mainFrameBodyContent3,myTimeout--);
}

//tuneUpSuccessCallBack
function successCB() {

    myCounter++;

    updateInfo();

    if (myDebug) {
        alert("--- Channel: " + curChannelName + " --- Program: " + curProgramTitle + " --- Description: " + curProgram.detailedDescription);
    }

    //test if current channel is the channel we started, if so quit widget
    if ( (savedChannelName == curChannelName) && (!runInfinity) ) {

        alert("--- Starting Channel Reached ---");

        //set volume back to where we started
        if (!isMuted) {audioControlObject.setVolume(oldVolume);}

        //let the TV know that we are exiting
        widgetAPI.sendExitEvent();
    }
}

//tuneUpErrorCallBack
function errorCB(error) {
    alert("--- ERROR --- : " + error.name);
}

//wait X seconds than jump to tuneIt()
function holdIt() {
    if (myDebug) {alert("--- Waiting " + waitSeconds + " seconds ---");}

    if (waitSeconds < 1) {
        waitSeconds = 1;
    }

    setTimeout(updateInfo,2000);

    setTimeout(tuneIt,(waitSeconds-1)*1000);
}

//switch the channel up by one,after that jump to holdIt()
function tuneIt() {
    if (myDebug) {alert("--- TuneIt ---");}

    if (!shouldRun) {return;}

    webapis.tv.channel.tuneUp(successCB, errorCB, webapis.tv.channel.NAVIGATOR_MODE_FAVORITE, 0);

    holdIt();
}

// random colors - taken from here:
// http://www.paulirish.com/2009/random-hex-color-code-snippets/
function randomColors() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

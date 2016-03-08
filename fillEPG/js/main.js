//Declaration
var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();
var audioControlObject = webapis.audiocontrol;  
var successCB;
var errorCB;
var holdIt;
var tuneIt;
var savedChannelName;
var curChannelName;
//fixed int because getChannelList() is buggy, look below
var myCounter = 0;
var myDebug = false;
var waitSeconds = 5;
var oldVolume = 2;

//main
window.onload = function () {

	if (myDebug) { alert("--- entered onload ---"); };

	//get volume
	oldVolume = audioControlObject.getVolume();

	//set volume to 4
	audioControlObject.setVolume(2);

	//mute audio
	//audioControlObject.setMute(true);

	//addEventlistener
	document.addEventListener('keydown', remoteControlEvent);

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
	holdIt();
};

// Event handling function.
function remoteControlEvent(e) {
    var keyCode = event.keyCode;

    switch (keyCode) {
        case tvKey.KEY_LEFT:
		if (myDebug) { alert("--- LEFT ---"); };
		waitSeconds -=1;
            break;
        case tvKey.KEY_RIGHT:
		if (myDebug) { alert("--- RIGHT ---"); };
		waitSeconds +=1;
            break;
        case tvKey.KEY_UP:
		if (myDebug) { alert("--- UP ---"); };
            break;
        case tvKey.KEY_DOWN:
		if (myDebug) { alert("--- DOWN ---"); };
            break;
        case tvKey.KEY_ENTER:
		if (myDebug) { alert("--- ENTER ---"); };
            break;
        case tvKey.KEY_RETURN:
		//on return set volume back to where we started
		audioControlObject.setVolume(oldVolume);
		if (myDebug) { alert("--- RETURN ---"); };
            break;
	case tvKey.KEY_EXIT:
		//on exit set volume back to where we started
		audioControlObject.setVolume(oldVolume);
		if (myDebug) { alert("--- EXIT ---"); };
	    break;
    }
};

//channelListSuccessCallBack
function successListCB(channelList) {
        if (myDebug) {
		alert("--- All Channels: : " + channelList.length);
		for(chan in channelList) {
			alert("------ Channellist: " + chan);
		};
	};
};

//tuneUpSuccessCallBack
function successCB() {
	//channelName and running program info
	var curChannel = webapis.tv.channel.getCurrentChannel();
	var curProgram = webapis.tv.channel.getCurrentProgram();
	curChannelName = curChannel.channelName;

	//search html by Id
	var myContent = document.getElementById("status");
	document.getElementById("status").style.textAlign = "left";

	//put info on TV
	widgetAPI.putInnerHTML(myContent,"#: " + (myCounter +=1) + "<br>C: " + curChannelName + "<br>P: " + curProgram.title + "<br>Seconds to wait (l/r to change): " + waitSeconds);

        if (myDebug) {
		alert("--- Channel: " + curChannelName + " --- Program: " + curProgram.title + " --- Description: " + curProgram.detailedDescription);
	};

	//test if current channel is the channel we started, if so quit widget
	if (savedChannelName == curChannelName) {

        	if (myDebug) {
			alert("--- Starting Channel Reached ---");
			alert("--- Terminating Widget  ---");
		} else {
			alert("--- Run Finished ---");
		};

		if (oldVolume > 8) {
			oldVolume = 6;
		};
		//set volume back to where we started
		audioControlObject.setVolume(oldVolume);

		//unmute audio
		//audioControlObject.setMute(false);

		//play notify sound that we are finished
		//audioControlObject.playSound(webapis.audiocontrol.AUDIO_SOUND_TYPE_WARNING);
		
		//let the TV know that we are ready
		widgetAPI.sendExitEvent();
	};
};

//tuneUpErrorCallBack
function errorCB(error) {
		alert("--- " + error.name);
};

//wait 3 seconds than jump to tuneIt()
function holdIt() {
        if (myDebug) { alert("--- Waiting --- :" + waitSeconds); };

	if (waitSeconds < 1) {
		waitSeconds = 1;
	};

	setTimeout(tuneIt,waitSeconds*1000);
};

//switch the channel up by one,after that jump to holdIt()
function tuneIt() {
        if (myDebug) { alert("--- try to tuneup ---"); };

	webapis.tv.channel.tuneUp(successCB, errorCB, webapis.tv.channel.NAVIGATOR_MODE_FAVORITE, 0);
	holdIt();
};

//onbeforeunload
window.onbeforeunload = function() {
        if (myDebug) { alert("--- entered onbeforeunload ---"); };
};

//onunload
window.onunload = function() {
        if (myDebug) { alert("--- entered onunload ---"); };
};

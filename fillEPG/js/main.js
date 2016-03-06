//Declaration
var widgetAPI = new Common.API.Widget();
var successCB;
var errorCB;
var holdIt;
var tuneIt;
var savedChannelName;
var curChannelName;
//fixed int because getChannelList() is buggy, look below
var myCounter = 44;
var myDebug = false;

//main
window.onload = function () {
	if (myDebug) {
		alert("--- entered onload ---");
	};

	//channelname and info
	var startChannel = webapis.tv.channel.getCurrentChannel();
	savedChannelName = startChannel.channelName;

	//how much channels do we have - need further investigation
	//look up here: http://www.samsungdforum.com/SamsungDForum/ForumView/df3455b529adf7c4?forumID=12aa9c2241f919a9
	//var channelCount = webapis.tv.channel.getChannelList(successListCB, null, webapis.tv.channel.NAVIGATOR_MODE_FAVORITE, 0);
	//webapis.tv.channel.getChannelList(successListCB, null, 2, 0);
	//alert("--- ChannelCount : " + channelCount.length);

	//Widget ready
	widgetAPI.sendReadyEvent();

	//start to tune up
	//tuneIt();

	//better start with holdIT()
	holdIt();
};

//channelListSuccessCallBack
function successListCB(channelList) {
        if (myDebug) {
		alert("--- All Channels: : " + channelList.length);
	};
};

//tuneUpSuccessCallBack
function successCB() {
	//channelName and running program info
	var curChannel = webapis.tv.channel.getCurrentChannel();
	var curProgram = webapis.tv.channel.getCurrentProgram();
	curChannelName = curChannel.channelName;

	//set up counter
	myCounter -= 1;
	var count = myCounter + " Channels to go !!!"

	//search html by Id
	var myContent = document.getElementById("status");

	//put counter on TV
	widgetAPI.putInnerHTML(myContent,count);

        if (myDebug) {
		alert("--- Kanal: " + curChannelName + "  --- Programm: " + curProgram.title);
	};

	//test if current channel is the channel we started, if so quit widget
	if (savedChannelName == curChannelName) {

        	if (myDebug) {
			alert("--- starting channel reached ---");
			alert("--- terminating widget  ---");
		} else {
			alert("run finished");
		};
		
		//let the TV know that we are ready
		widgetAPI.sendExitEvent();
	};
};

//tuneUpErrorCallBack
function errorCB(error) {
	if (myDebug) {
		alert("--- " + error.name);
	};
};

//wait 3 seconds than jump to tuneIt()
function holdIt() {
        if (myDebug) {
		alert("--- waiting ---");
	};

	setTimeout(tuneIt,3000);
};

//switch the channel up by one,after that jump to holdIt()
function tuneIt() {
        if (myDebug) {
		alert("--- try to tuneup ---");
	};

	webapis.tv.channel.tuneUp(successCB, errorCB, webapis.tv.channel.NAVIGATOR_MODE_FAVORITE, 0);
	holdIt();
};

//unload
Main.onUnload = function() {

}


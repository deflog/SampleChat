var ChatStomp = function(){
	//イベントのトリガーになるIDを定義
	this.connectButton = document.getElementById('connect');
	this.disconnectButton = document.getElementById('disconnect');
	this.sendButton = document.getElementById('send');
	this.messageText = document.getElementById('message');

	//(イベントの種類,処理後の変数)
	this.connectButton.addEventListener('click',this.connect.bind(this));
	this.disconnectButton.addEventListener('click',this.disconnect.bind(this));
	this.sendButton.addEventListener('click',this.sendName.bind(this));
	this.messageText.addEventListener('input',this.setSendableStatus.bind(this));
};

ChatStomp.prototype.connect = function(){
	var socket = new WebSocket('ws://' + location.host + '/endpoint');
	this.stompClient = Stomp.over(socket);
	this.stompClient.connect({},this.onConnected.bind(this));



};

ChatStomp.prototype.onConnected = function(frame){

	console.log('Connected: '+frame);

	this.stompClient.subscribe('/topic/messages/'+ document.getElementById('room').value,this.onSubscribeGreeting.bind(this));
	this.setConnected(true);

	this.sendAcc();

};

ChatStomp.prototype.onSubscribeGreeting = function(message){

	var response = document.getElementById('response');
    var p = document.createElement('p');
    p.classList.add('talk-area');
    response.appendChild(p);

    var name_span = document.createElement('span');
    name_span.classList.add('talk-name');
    name_span.appendChild(document.createTextNode(JSON.parse(message.body).name));
    p.appendChild(name_span);

    var message_span = document.createElement('span');
    message_span.classList.add('talk-content');

    message_span.appendChild(document.createTextNode(JSON.parse(message.body).message));
    p.appendChild(message_span);

    /** スクロールを一番下に **/
    var scrollHeight = document.getElementById('response').scrollHeight;
    document.getElementById('response').scrollTop = scrollHeight;
};

ChatStomp.prototype.sendName = function(){
	var name = document.getElementById('name').value;
	if(!name) name = EMPTY_NAME;
	var json_message = {name: name, message: document.getElementById('message').value};
	this.stompClient.send("/app/message/"+ document.getElementById('room').value,{},JSON.stringify(json_message));

};
ChatStomp.prototype.sendAcc = function(){
	var name = document.getElementById('name').value;
	if(!name) name = EMPTY_NAME;
	var json_message = {name: ('['+document.getElementById('room').value + ']ROOM'), message: (name + 'さんが入室しました。')}
	this.stompClient.send("/app/message/" + document.getElementById('room').value,{},JSON.stringify(json_message));
};
ChatStomp.prototype.sendDisAcc = function(){
	var name = document.getElementById('name').value;
	if(!name) name = EMPTY_NAME;
	var json_message = {name: ('['+document.getElementById('room').value + ']ROOM'), message: (name + 'さんが退室しました。')}
	this.stompClient.send("/app/message/" + document.getElementById('room').value,{},JSON.stringify(json_message));
};
ChatStomp.prototype.setSendableStatus = function(){
	var message = document.getElementById('message').value || '';
	var connected = this.connectButton.disabled;
	this.canSubmit(connected && message.length > 0);
};

ChatStomp.prototype.disconnect = function(){
	this.sendDisAcc();
	if(this.stompClient){
		this.stompClient.disconnect();
		this.stompClient = null;
	}
	this.setConnected(false)


};

ChatStomp.prototype.setConnected = function(connected){
	this.connectButton.disabled = connected;
	this.disconnectButton.disabled = !connected;
	this.setSendableStatus();
};

ChatStomp.prototype.canSubmit = function(enabled){
	this.sendButton.disabled = !enabled;
};
new ChatStomp();
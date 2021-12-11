ip = 'coturn.koreacentral.cloudapp.azure.com';
let port = '1935';
let ws = new WebSocket('wss://'+ip+':'+port+'/test');
let userID = new Date().toJSON();
let userType;
var userExist = false;
ws.onopen = () => {
	console.log('open connection')
	document.getElementById("message_text").textContent+=`Welcome to Chat Room\n\r`;
	var config = {
		cmd:'ConnectRoom',
		args:[sessionStorage.getItem('room'),sessionStorage.getItem('userID'),sessionStorage.getItem('user')]
	}
	ws.send(JSON.stringify(config));
}


ws.onclose = () => {
	    console.log('close connection')
}


ws.onmessage = event => {
	if(isConnectRoom){
		if (event.data instanceof Blob) {
			reader = new FileReader();
	        	reader.onload = () => {
	    		console.log(reader.result);
	    		document.getElementById("message_text").textContent+=reader.result+"\n\r";
		        };
	        	reader.readAsText(event.data);} 
		else {
			console.log(event.data);
			var rece_data = JSON.parse(event.data);
			switch(rece_data.cmd)
			{
				case 'receiveMessage':
					{
						if(room == rece_data.args[0])
						document.getElementById("message_text").textContent+=rece_data.args[1]+"\n\r";
					}break;
				case "ConnectRoom":
					{
						if(rece_data.value)
						{
							if(userID == rece_data.args[0])
							{
								userType = rece_data.args[1];
								console.log(userType);							
							}
						}
						else
						{
							userExist = true;
							//sendCommand("LeaveRoom",[room,sessionStorage.getItem('userID'),userExist]);
							sessionStorage.removeItem('userID');
							window.alert("The username is exist!!\nPlease edit the username or join other room");
							window.location = 'https://coturn.koreacentral.cloudapp.azure.com/';
						}
					}break;
				case "HostLeaved":
					{
						userExist = true;
						window.alert("Host is leaved!!");
						window.location = 'https://coturn.koreacentral.cloudapp.azure.com/';
					}break;
				case "ClientLeaved":
					{
						document.getElementById("message_text").textContent+=`${rece_data.args[0]} is leaved!!`+"\n\r";
					}break;
			}
		}
	}
};

function sendCommand(cmd,args) {
	if(isConnectRoom){
		message = {
			cmd: cmd,
			args: args
		}
		ws.send(JSON.stringify(message));
		document.getElementById("userMessage").value = "";
	}
};


function sendMessage() {
		return [sessionStorage.getItem('user'),document.getElementById("userMessage").value,room,userID]
};
function chatappear(){
	var td = document.getElementById('text_div');

	if(td.style.display ==="none"){
		td.style.display="block";
	}
	else {
		td.style.display="none";
	}
}

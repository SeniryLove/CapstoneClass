ip = 'corturntest.koreacentral.cloudapp.azure.com';
let port = '1935';
let ws = new WebSocket('wss://'+ip+':'+port+'/test');

ws.onopen = () => {
	    console.log('open connection')
		document.getElementById("message_text").textContent+=`Welcome to Chat Room\n\r`;
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
		return [document.getElementById("userName").value,document.getElementById("userMessage").value,room]
};

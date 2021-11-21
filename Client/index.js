//使用 WebSocket 的網址向 Server 開啟連結
let ip = 'localhost';
let port = '1935';
let ws = new WebSocket('ws://'+ip+':'+port)

//開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
ws.onopen = () => {
    console.log('open connection')
	document.getElementById("text").textContent+=`Welcome to ${ip}\n\r`;
}

//關閉後執行的動作，指定一個 function 會在連結中斷後執行
ws.onclose = () => {
    console.log('close connection')
}

//接收 Server 發送的訊息
ws.onmessage = event => {
    if (event.data instanceof Blob) {
        reader = new FileReader();

        reader.onload = () => {
			console.log(reader.result);
			document.getElementById("text").textContent+=reader.result+"\n\r";
        };
		
        reader.readAsText(event.data);
    } else {
		console.log(event.data);
        document.getElementById("text").textContent+=event.data+"\n\r";
    }
}

function sendCommand(cmd,args) {
	message = {
		cmd: cmd,
		args: args
	}
	
	ws.send(JSON.stringify(message));
	document.getElementById("userMessage").value = "";
};


function sendMessage() {
	return [document.getElementById("userName").value,document.getElementById("userMessage").value]
};
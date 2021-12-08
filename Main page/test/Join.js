var userName = "";
var room = "";
function EnterUserName(){
	if(document.getElementById('name-3b9a').value != '')
	{
		userName = document.getElementById('name-3b9a').value;
		sessionStorage.setItem("user",userName);
		window.alert("Username set successfully!!");
	}
	else
	{
		window.alert("Please enter the username!!");
	}
}


function JoinRoom(){
	if(userName == "")
	{
		window.alert("Please enter the username!!");
	}
	else if(document.getElementById('name-6797').value == '')
	{
		window.alert("Please enter the roomID!!");
	}
	else
	{
		room = document.getElementById('name-6797').value.toLowerCase().replace(/\s/g, '-').replace(/[^0-9]/g, '');
		if(parseInt(room) > 100 || parseInt(room) < 1 || room == '')
		{
			window.alert("Please enter the roomID between 1~100");
		}
		else
		{
			window.location = 'https://coturn.koreacentral.cloudapp.azure.com/test?' + room;
		}
		
	}
}

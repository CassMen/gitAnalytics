
const baseUrl = "https://gitlab.com/";
const user = "doctormo";
const twoYears = new Date();
twoYears.setFullYear( twoYears.getFullYear() - 2 );
const per_page = 40;

let page = 1;


/* Sends sync GET request and returns the response . */
function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", url, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


/* Creates download link with JSON data and clicks it. */
function downloadDataJsonFile(json, type = "text/javascript", filename = "dataset.js") {
	let body = document.body;
	const downloadLink = document.createElement("a");
	downloadLink.href = URL.createObjectURL(new Blob(['const dataset = ' + JSON.stringify(json, null, 2)], {
		type: type
	}));
	downloadLink.setAttribute("download", filename);
	body.appendChild(downloadLink);
	downloadLink.click();
	body.removeChild(downloadLink);
}


/* Busy loop to freeze the script for a number of milliseconds. */
function busyLoop(milliseconds) {
	var start = new Date().getTime();
	var end = 0;
	while((end - start) < milliseconds){
		end = new Date().getTime();
	}
}

// Requests data from Gitlab API until there is no more or within the two years time range.
let content = httpGet(baseUrl + "api/v4/users/" + user + "/events?page=" + page + "&per_page=" + per_page);
let jsonContent = JSON.parse(content);

let dataset = [];
let belowLimitDate = false;

while (jsonContent.length != 0) {
	for (let i = 0; i < jsonContent.length; i++) {
		activityDate = new Date(jsonContent[i].created_at);
		if (activityDate < twoYears) {
			belowLimitDate = true;
			break;
		}
		if (jsonContent[i].push_data != undefined) {
			hash = jsonContent[i].push_data.commit_to;
			if (hash != null) {
				dataset.push({
					"data": activityDate,
					"hash": hash
				});
			}
		}
	}
	if (!belowLimitDate) {
		busyLoop(2000);
		page++;
		content = httpGet(baseUrl + "api/v4/users/" + user + "/events?page=" + page + "&per_page=" + per_page);
		jsonContent = JSON.parse(content);
		
	} else {
		break;
	}
}

document.addEventListener("DOMContentLoaded", function(e) {
	downloadDataJsonFile(dataset);
});


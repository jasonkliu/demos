var allSchedules = new Array();
var scheduleCounter = 0;
var classList = {};
var nameList = {};
var classListKeys = []; 
var timeMappings = [];
var colorMapping = [];
var mon = false;
var tues = false;
var wed = false;
var thur = false;
var fri = false;


function initialLoad() {
	
	initializeTable();
	initializeClassTable();
	initializeActivityTable();
	initializeAlternateTable();
	
	populateClassList();
	populateNameList();
	populateTimeMappings();
	populateColorMapping();

	$("#classSearchBox").keypress(function(event){
		if (event.keyCode == 13) {
			var input = $("#classSearchBox").val(); 
			if (classList[input] == true) {	
				updateClassTable(input); 
				generateSchedule(); }
			else {
				alert("Class does not exist!"); 
			}
			initializeClassSearchBox(); 
		}

	});
}

function initializeSearchField() {
	//new search function
	$("#searchclass").focus(function() {
		console.log('hello'); 
		$("#searchclass").val("");
		$("#searchclass").css("color","black"); 
	});
	
	$("#searchclass").focusout(function() {
		$("#searchclass").val("Add Class");
		$("#searchclass").css("color", "#B8B8B8")
	}); 
}


function initializeTable() {
	var newTable = document.getElementById("scheduleTable");
	var tableTimes = ['8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM'];
	var tableHTML = "";
	
	tableHTML += "<table id='scheduleTable' class='table table-bordered'>";
	tableHTML += "<thead>";
	tableHTML += "<tr>";
	tableHTML += "<th id='timeless' width='15%'><center>Times</center></th>"
	tableHTML += "<th id='monday' width='17%'><center>Monday</center></th>"
	tableHTML += "<th id='tuesday' width='17%'><center>Tuesday</center></th>"
	tableHTML += "<th id='wednesday' width='17%'><center>Wednesday</center></th>"
	tableHTML += "<th id='thursday' width='17%'><center>Thursday</center></th>"
	tableHTML += "<th id='friday' width='17%'><center>Friday</center></th>"
	tableHTML += "</tr>";
	tableHTML += "</thead>";
	tableHTML += "<tbody>";
	
	for (var i = 0; i < tableTimes.length; i++)
	{
		tableHTML += "<tr>";
		tableHTML += "<td><center>"+tableTimes[i]+"</center></td>";
		for (var j = 0; j < 5; j++)
		{
			tableHTML += "<td id=" + (16 +i + 48*j) + "></td>";
		}
		tableHTML += "</tr>";
	}
	tableHTML += "<tbody>";
	tableHTML += "</table>";
	
	newTable.innerHTML = tableHTML;
}

function initializeAlternateTable() {
	var newTable = document.getElementById("scheduleTable");
	var tableTimes = ['8:00 AM','8:30 AM','9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM','9:30 PM'];
	var tableHTML = "";
	
	tableHTML += "<table id='alternateTable' class='table table-bordered'>";
	tableHTML += "<thead>";
	tableHTML += "<tr>";
	tableHTML += "<th id='timeless' width='15%'><center>Times</center></th>"
	tableHTML += "<th id='monday' width='17%'><center>Monday</center></th>"
	tableHTML += "<th id='tuesday' width='17%'><center>Tuesday</center></th>"
	tableHTML += "<th id='wednesday' width='17%'><center>Wednesday</center></th>"
	tableHTML += "<th id='thursday' width='17%'><center>Thursday</center></th>"
	tableHTML += "<th id='friday' width='17%'><center>Friday</center></th>"
	tableHTML += "</tr>";
	tableHTML += "</thead>";
	tableHTML += "<tbody>";
	
	for (var i = 0; i < tableTimes.length; i++)
	{
		tableHTML += "<tr>";
		tableHTML += "<td><center>"+tableTimes[i]+"</center></td>";
		for (var j = 0; j < 5; j++)
		{
			tableHTML += "<td id=" + (16 +i + 48*j) + "></td>";
		}
		tableHTML += "</tr>";
	}
	tableHTML += "<tbody>";
	tableHTML += "</table>";
	
	newTable.innerHTML = tableHTML;
}

function generateSchedule() {
	scheduleCounter = 0;
	document.getElementById("conflictBox").innerHTML = '';
	for (k=0;k<336;k++){
		if (document.getElementById(""+k) != null)
		{
			document.getElementById(""+k).innerHTML = "<b>" + "" + "</b>";
			document.getElementById(""+k).bgColor = "#FFFFFF";
		}
	}
	var ordering = new Array();
	var table = document.getElementById("classTable");
	var rowCount = table.rows.length;
	
	for (var i = 1; i < rowCount; i++) {
        ordering.push(table.rows[i].cells[1].childNodes[0].innerHTML);
	}
	
	var holy = {};
	for (var j = 0; j < ordering.length; j++) {
		holy[j] = ordering[j];
	}
	$.get("http://alexwang.scripts.mit.edu/client.php", holy, function(data) { /*console.log(data);*/ //var hi = data.split("\n");
	allSchedules = data.split("-");
	allSchedules.splice(-1,1);
	var hi = allSchedules[0].split("\n");
	hi.push("-");
	
	
	var sandwiches = new Array();
	sandwiches=ordering;
	
	var returnedClasses = new Array();
	var unique = true;
	for (oza = 0; hi[oza]!="-"; oza++)
	{
		tester = hi[oza].split(" ");
		for (var i = 0; i < returnedClasses.length; i++) {
			if (returnedClasses[i] == tester[1]) {unique = false;}	
		}
		if (unique) {
			returnedClasses.push(tester[1]);
		}
		unique = true;
	}
	var conflicts = new Array();
	for (var ii = 0; ii < sandwiches.length; ii++) {
		for (var jj = 0; jj < returnedClasses.length; jj++) {
			if (returnedClasses[jj] == sandwiches[ii]) {unique = false;}	
		}
		if (unique) {
			conflicts.push(sandwiches[ii]);
		}
		unique = true;
	}

	
	for (oza = 0; hi[oza]!="-"; oza++)
	{
	tokens = hi[oza].split(" ");
	k = tokens[0];
	
		if (document.getElementById(""+k) != null)
		{
			document.getElementById(""+k).innerHTML = "<center><b>" + tokens[1] + "</b></center>";
			
	
					
			if (tokens[1] != 0) {	
				document.getElementById(""+k).bgColor = colorMapping[sandwiches.indexOf(tokens[1])+1];				
			}
			else{
				document.getElementById(""+k).bgColor = "#FFFFFF";
			}
		}
	} scheduleActivity(sandwiches, conflicts); document.getElementById("textOutput").innerHTML = "<center>"+text['mon']+"</center>";
	});
}

function loadPrevious() {
	if (scheduleCounter == 0) {
		return;
	} else {
		scheduleCounter--;
		funStuff();
	}
}

function loadNext() {
	if (scheduleCounter == allSchedules.length-1) {
		return;
	} else {
		scheduleCounter++;
		funStuff();
	}
}

function funStuff() {
	document.getElementById("conflictBox").innerHTML = '';
	for (k=0;k<336;k++){
		if (document.getElementById(""+k) != null)
		{
			document.getElementById(""+k).innerHTML = "<b>" + "" + "</b>";
			document.getElementById(""+k).bgColor = "#FFFFFF";
		}
	}
	
	var ordering = new Array();
	var table = document.getElementById("classTable");
	var rowCount = table.rows.length;
	
	for (var i = 1; i < rowCount; i++) {
        ordering.push(table.rows[i].cells[1].childNodes[0].innerHTML);
	}
	
	var hi = allSchedules[scheduleCounter].split("\n");
	hi.push("-");
	var sandwiches = new Array();
	sandwiches=ordering;
	
	var returnedClasses = new Array();
	var unique = true;
	for (oza = 0; hi[oza]!="-"; oza++)
	{
		var tester = hi[oza].split(" ");
		for (var i = 0; i < returnedClasses.length; i++) {
			if (returnedClasses[i] == tester[1]) {unique = false;}	
		}
		if (unique) {
			returnedClasses.push(tester[1]);
		}
		unique = true;
	}
	var conflicts = new Array();
	for (var ii = 0; ii < sandwiches.length; ii++) {
		for (var jj = 0; jj < returnedClasses.length; jj++) {
			if (returnedClasses[jj] == sandwiches[ii]) {unique = false;}	
		}
		if (unique) {
			conflicts.push(sandwiches[ii]);
		}
		unique = true;
	}
	
	for (oza = 0; hi[oza]!="-"; oza++)
	{
		var tokens = hi[oza].split(" ");
		var k = tokens[0];
	
		if (document.getElementById(""+k) != null)
		{
			document.getElementById(""+k).innerHTML = "<center><b>" + tokens[1] + "</b></center>";
			if (tokens[1] != 0) {	
				document.getElementById(""+k).bgColor = colorMapping[sandwiches.indexOf(tokens[1])+1];				
			}
			else{
				document.getElementById(""+k).bgColor = "#FFFFFF";
			}
		}
	} scheduleActivity(sandwiches, conflicts);
}

function initializeClassTable() {
	var newTable = document.getElementById("classTable");
	var tableHTML = "";
	
	tableHTML += "<table id='classTable' class='table table-bordered'>";
	tableHTML += "<thead>";
	tableHTML += "<tr>";
	tableHTML += "<th id='removeClass' width='10%' VALIGN=TOP><center>Select</center></th>";
	tableHTML += "<th id='classNumber' width='30%' VALIGN=TOP><center>Class Number</center></th>";
	tableHTML += "<th id='className' width='50%' VALIGN=TOP><center>Class Name</center></th>";
	tableHTML += "</tr>";
	tableHTML += "</thead>";
	tableHTML += "<tbody>";
	
	newTable.innerHTML = tableHTML;	

	var params = getParams();
	classes = params["classes"].split(/[\s,;\/\+]+/);
	for (i = 0; i < classes.length; i++)
	{
		if (classes[i]=="") {continue;}
		updateClassTable(classes[i]);
	}
	tableHTML += "</tbody>";
	generateSchedule();
}

function getParams() {
	var idx = document.URL.indexOf('?');
	var tempParams = new Object();
	if (idx != -1) {
	var pairs = document.URL.substring(idx+1, document.URL.length).split('&');
		for (var i=0; i<pairs.length; i++) {
			nameVal = pairs[i].split('=');
			tempParams[nameVal[0]] = nameVal[1];
			}
			return tempParams;
		}
	tempParams["classes"]="";
	return tempParams;
}

function updateClassTable(classNumber) {
	var updateTable = document.getElementById("classTable");
	
	var rowCount = updateTable.rows.length;
	var row = updateTable.insertRow(rowCount);
	
	var cell1 = row.insertCell(0);
	var element1 = document.createElement("input");
	element1.type = "radio";
	element1.name = "classRadio";
	cell1.appendChild(element1);
	
	var cell2 = row.insertCell(1);
    cell2.innerHTML = "<center>"+classNumber+"</center>";
	
	var cell3 = row.insertCell(2);
	cell3.innerHTML = "<center>"+nameList[classNumber]+"</center>";
	
}

function loadSearch() {
	document.getElementById("overlay").style.display = "block";
	document.getElementById("classPopUp").style.display = "block";
	makeSearchTable();
}

function makeSearchTable() {
	var newTable = document.getElementById("classListings");
	var tableHTML = "";
	
	tableHTML += "<table id='classListings' style='background-color:gray;text-align:center;margin-bottom:10px;' border='2' bordercolor='black' width='100%' cellpadding='0' cellspacing='0'>"; 
	tableHTML += "<tr>";
	tableHTML += "<th id='selectClass' width='10%'>Select</th>";
	tableHTML += "<th id='classNumber' width='25%'>Class Number</th>";
	tableHTML += "<th id='className' width='65%'>Class Name</th>";
	tableHTML += "<tr>";
	tableHTML += "<tr>";
	tableHTML += "<th colspan='3'>Select A Class!</th>";
	tableHTML += "<tr>";
	tableHTML += "</table>";
	
	newTable.innerHTML = tableHTML;
}

function updateSearchTable() {
	var newTable = document.getElementById("classListings");
	var tableHTML = "";
	var inputedText = document.getElementById("userSearch").value;
	var className = nameList[inputedText];
	
	tableHTML += "<table id='classListings' style='background-color:gray;text-align:center;margin-bottom:10px;' border='2' bordercolor='black' width='100%' cellpadding='0' cellspacing='0'>"; 
	tableHTML += "<tr>";
	tableHTML += "<th id='selectClass' width='10%'>Select</th>";
	tableHTML += "<th id='classNumber' width='25%'>Class Number</th>";
	tableHTML += "<th id='className' width='65%'>Class Name</th>";
	tableHTML += "<tr>";
		
	if (classList[inputedText] == true) {	
		tableHTML += "<tr>";
		tableHTML += "<td><button onclick='closeSearchBox()'>ADD</button></td>"
		tableHTML += "<td id='userSelectedClass'>"+inputedText+"</td>";
		tableHTML += "<td>"+className+"</td>";
		tableHTML += "<tr>";
		tableHTML += "</table>";
	}
	
	else {
		tableHTML += "<tr>";
		tableHTML += "<td colspan='3'>Class Does Not Exist</td>"
		tableHTML += "<tr>";
		tableHTML += "</table>";
	}
	
	newTable.innerHTML = tableHTML;
}

function closeClassWindow() {
	document.getElementById("overlay").style.display = "none";
	document.getElementById("classPopUp").style.display = "none"; 
}

function moveUp() {
	var updateTable = document.getElementById("classTable");
	var rowCount = updateTable.rows.length;
	for (var i = 1; i < rowCount; i++) {
		if (updateTable.rows[i].cells[0].childNodes[0].checked && i > 1) {			
			var row = updateTable.rows[i];
			var insert = updateTable.insertRow(i-1);
			
			var cell1 = insert.insertCell(0);
			var element1 = document.createElement("input");
			element1.type = "radio";
			element1.checked = true;
			element1.name = "classRadio";
			cell1.appendChild(element1);
			
			var cell2 = insert.insertCell(1);
			cell2.innerHTML = "<center>"+row.cells[1].childNodes[0].innerText+"</center>";
			
			var cell3 = insert.insertCell(2);
			cell3.innerHTML = "<center>"+row.cells[2].childNodes[0].innerText+"</center>";
			
			updateTable.deleteRow(i+1);
			break;
		}
	}
	generateSchedule();
}

function moveDown() {
	var updateTable = document.getElementById("classTable");
	var rowCount = updateTable.rows.length;
	for (var i = 1; i < rowCount; i++) {
		if (updateTable.rows[i].cells[0].childNodes[0].checked && i < rowCount-1) {			
			var row = updateTable.rows[i];
			var insert = updateTable.insertRow(i+2);
			
			var cell1 = insert.insertCell(0);
			var element1 = document.createElement("input");
			element1.type = "radio";
			element1.checked = true;
			element1.name = "classRadio";
			cell1.appendChild(element1);
			
			var cell2 = insert.insertCell(1);
			cell2.innerHTML = "<center>"+row.cells[1].childNodes[0].innerText+"</center>";
			
			var cell3 = insert.insertCell(2);
			cell3.innerHTML = "<center>"+row.cells[2].childNodes[0].innerText+"</center>";
			
			updateTable.deleteRow(i);
			break;
		}
	}
	generateSchedule();
}

function moveUp1() {
	var updateTable = document.getElementById("activityTable");
	var rowCount = updateTable.rows.length;
	for (var i = 1; i < rowCount; i++) {
		if (updateTable.rows[i].cells[0].childNodes[0].checked && i > 1) {			
			var row = updateTable.rows[i];
			var insert = updateTable.insertRow(i-1);
			
			var cell1 = insert.insertCell(0);
			var element1 = document.createElement("input");
			element1.type = "radio";
			element1.checked = true;
			element1.name = "classRadio";
			cell1.appendChild(element1);
			
			var cell2 = insert.insertCell(1);
			cell2.innerHTML = "<center>"+row.cells[1].childNodes[0].innerText+"</center>";
			
			var cell3 = insert.insertCell(2);
			cell3.innerHTML = "<center>"+row.cells[2].childNodes[0].innerText+"</center>";
			
			var cell4 = insert.insertCell(3);
			cell4.innerHTML = "<center>"+row.cells[3].childNodes[0].innerText+"</center>";
			
			updateTable.deleteRow(i+1);
			break;
		}
	}
	generateSchedule();
}

function moveDown1() {
	var updateTable = document.getElementById("activityTable");
	var rowCount = updateTable.rows.length;
	for (var i = 1; i < rowCount; i++) {
		if (updateTable.rows[i].cells[0].childNodes[0].checked && i < rowCount-1) {			
			var row = updateTable.rows[i];
			var insert = updateTable.insertRow(i+2);
			
			var cell1 = insert.insertCell(0);
			var element1 = document.createElement("input");
			element1.type = "radio";
			element1.checked = true;
			element1.name = "classRadio";
			cell1.appendChild(element1);
			
			var cell2 = insert.insertCell(1);
			cell2.innerHTML = "<center>"+row.cells[1].childNodes[0].innerText+"</center>";
			
			var cell3 = insert.insertCell(2);
			cell3.innerHTML = "<center>"+row.cells[2].childNodes[0].innerText+"</center>";
			
			var cell4 = insert.insertCell(3);
			cell4.innerHTML = "<center>"+row.cells[3].childNodes[0].innerText+"</center>";
			
			updateTable.deleteRow(i);
			break;
		}
	}
	generateSchedule();
}

function closeSearchBox() {
	var input = $("#classSearchBox").val();
	if (classList[input] == true) {	
		updateClassTable(input);
		generateSchedule();
	} else {

	}
	initializeClassSearchBox();
}

function initializeClassSearchBox() {
	$("#classSearchBox").val("");
}

function deleteSelectedClass() {
	var updateTable = document.getElementById("classTable");
	var rowCount = updateTable.rows.length;
	for(var i=1; i<rowCount; i++) {
		var row = updateTable.rows[i];
        var box = row.cells[0].childNodes[0];
        if(box.checked == true) { 
            updateTable.deleteRow(i);
            rowCount--;
            i--;
        }
     }
	 generateSchedule();
}

function clearSelectedClasses() {
	var updateTable = document.getElementById("classTable");
	var rowCount = updateTable.rows.length;
	for(var i=1; i<rowCount; i++) {
        updateTable.deleteRow(i);
        rowCount--;
        i--;
     };
	 generateSchedule();
}

function initializeActivityTable() {
	var newTable = document.getElementById("activityTable");
	var tableHTML = "";
	
	tableHTML += "<table id='activityTable' class='table table-bordered'>";
	tableHTML += "<thead>";	
	tableHTML += "<tr>";
	tableHTML += "<th id='selectActivity' width='10%' VALIGN=TOP><center>Select</center></th>";
	tableHTML += "<th id='activityName' width='30%' VALIGN=TOP><center>Activity Name</center></th>";
	tableHTML += "<th id='activityDay' width='30%' VALIGN=TOP><center>Day</center></th>";
	tableHTML += "<th id='activityTime' width='30%' VALIGN=TOP><center>Time</center></th>";
	tableHTML += "</tr>";
	tableHTML += "</thead>";	
	tableHTML += "<tbody>";
	tableHTML += "</tbody>";
	
	newTable.innerHTML = tableHTML;	
}

function addActivity() {
	clearActivitiesBox();
	document.getElementById("overlay").style.display = "block";
	document.getElementById("activitiesPopUp").style.display = "block";
}

function selectMonday() {
	if (mon == false) {
		mon = true;
	} else {
		mon = false;
	}
}

function selectTuesday() {
	if (tues == false) {
		tues = true;
	} else {
		tues = false;
	}
}

function selectWednesday() {
	if (wed == false) {
		wed = true;
	} else {
		wed = false;
	}
}

function selectThursday() {
	if (thur == false) {
		thur = true;
	} else {
		thur = false;
	}
}

function selectFriday() {
	if (fri == false) {
		fri = true;
	} else {
		fri = false;
	}
}

function resetDays() {
	if (mon) $("#mondayActivity").button('toggle');
	if (tues) $("#tuesdayActivity").button('toggle');
	if (wed) $("#wednesdayActivity").button('toggle');
	if (thur) $("#thursdayActivity").button('toggle');
	if (fri) $("#fridayActivity").button('toggle');

	mon = false;
	tues = false;
	wed = false;
	thur = false;
	fri = false;
}

function saveActivitiesChanges() {	
	var name = document.getElementById("activitiesName").value;
	var start = document.getElementById("startTime")[document.getElementById("startTime").selectedIndex].text;
	var end = document.getElementById("startTime")[document.getElementById("endTime").selectedIndex].text;
	updateActivitiesTable(name, mon, tues, wed, thur, fri, start, end);
	resetDays();
	generateSchedule();	
}

function closeActivitiesWindow() {
	document.getElementById("overlay").style.display = "none";
	document.getElementById("activitiesPopUp").style.display = "none"; 
}

function clearActivitiesBox() {
	document.getElementById("activitiesName").value = "";
	resetDays();
	document.getElementById("startTime").value = 0;
	document.getElementById("endTime").value = 0;
}

function updateActivitiesTable(name, mon, tues, wed, thur, fri, start, end) {
	var updateTable = document.getElementById("activityTable");
	
	var rowCount = updateTable.rows.length;
	var row = updateTable.insertRow(rowCount);
	
	var cell1 = row.insertCell(0);
	var element1 = document.createElement("input");
	element1.type = "radio";
	element1.name = "classRadio1";
	cell1.appendChild(element1);
	
	var cell2 = row.insertCell(1);
    cell2.innerHTML = "<center>"+name+"</center>";
	
	var temp = "";
	var temp5 = "";
	var temp4 = "";
	var temp3 = "";
	var temp2 = "";
	var temp1 = "";
	var flag = false; 
	if (mon == true) { temp += "M"; flag = true}
	if (flag == true) { temp += "/"; flag = false;}
	if (tues == true) { temp += "T"; flag = true}
	if (flag == true) { temp += "/"; flag = false;}
	if (wed == true) { temp += "W"; flag = true}
	if (flag == true) { temp += "/"; flag = false;}
	if (thur == true) { temp += "TH"; flag = true}
	if (flag == true) { temp += "/"; flag = false;}
	if (fri == true) { temp += "F"; flag = true}
	if (temp.charAt(temp.length-1) == "/") { temp = temp.substring(0,temp.length-1);}
	
	var cell3 = row.insertCell(2);
	cell3.innerHTML = "<center>"+temp+"</center>";
	
	var cell4 = row.insertCell(3);
	cell4.innerHTML = "<center>"+start+"-"+end+"</center>";
}

function scheduleActivity(sandwiches, conflict) {
	var updateTable = document.getElementById("activityTable");
	var rowCount = updateTable.rows.length;

	for(var i=1; i<rowCount; i++) {
		var row = updateTable.rows[i];
		var potentialTimes = new Array;
        var name = row.cells[1].childNodes[0].innerText;
		var days = row.cells[2].childNodes[0].innerText;
		var time = row.cells[3].childNodes[0].innerText;
		var timez = time.split("-");
		var start = timez[0];
		var end = timez[1];
		var dayz = days.split("/");
		if (sandwiches.indexOf(name) == -1) {
			sandwiches.push(name);
		}
		for (var j=0; j < dayz.length; j++) {
			switch (dayz[j]) {
				case 'M':
					for (var k = timeMappings[start]; k < timeMappings[end]; k++) {
						potentialTimes.push(k);
					}
					break;
				case 'T':
					for (var k = 48+timeMappings[start]; k < 48+timeMappings[end]; k++) {
						potentialTimes.push(k);
					}
					break;
				case 'W':
					for (var k = 96+timeMappings[start]; k < 96+timeMappings[end]; k++) {
						potentialTimes.push(k);
					}
					break;
				case 'TH':
					for (var k = 144+timeMappings[start]; k < 144+timeMappings[end]; k++) {
						potentialTimes.push(k);
					}
					break;
				case 'F':
					for (var k = 192+timeMappings[start]; k < 192+timeMappings[end]; k++) {
						potentialTimes.push(k);
					}
					break;
				default:
					continue;
			}
		}
		var proceed = true;
		for (var z = 0; z < potentialTimes.length; z++) {
			if ((document.getElementById(""+potentialTimes[z]) == null) ||(document.getElementById(""+potentialTimes[z]).innerHTML != '<b></b>')) 
			{
				proceed = false;
				var unique = true;
				for (var q = 0; q < conflict.length; q++) {
					if (conflict[q] == name) {unique = false;}
				}	
				if (unique) {conflict.push(name);}
			}
		}
		if (proceed) {
			for (var zz = 0; zz < potentialTimes.length; zz++) {
				document.getElementById(""+potentialTimes[zz]).innerHTML = "<center><b>" + name + "</b></center>";
				document.getElementById(""+potentialTimes[zz]).bgColor = colorMapping[sandwiches.indexOf(name)+1];
			}
		}
	}
	if (conflict.length > 0) {
		message = "Captain PlanIt failed to schedule the following classes and activities due to conflicts: "; 
		for (var p = 0; p < conflict.length-1; p++) {
			message += conflict[p];
			message += ', ';			
		}
		message += conflict[conflict.length-1];
		document.getElementById("conflictBox").innerHTML = "<center><b><font size='5' color='red'>"+message+"</font></b></center>";
	}
}

function deleteSelectedActivities() {
	var updateTable = document.getElementById("activityTable");
	var rowCount = updateTable.rows.length;
	for(var i=1; i<rowCount; i++) {
		var row = updateTable.rows[i];
        var box = row.cells[0].childNodes[0];
        if(box.checked == true) { 
            updateTable.deleteRow(i);
            rowCount--;
            i--;
        }
     }
	generateSchedule();
}

function clearSelectedActivities() {
	var updateTable = document.getElementById("activityTable");
	var rowCount = updateTable.rows.length;
	for(var i=1; i<rowCount; i++) {
        updateTable.deleteRow(i);
        rowCount--;
        i--;
     }
	generateSchedule();
}

function parseTime(time) {
	var temp = time.split(' ');
	var spaceSplit = temp[0];
	while (spaceSplit.indexOf(":") != -1) {
		spaceSplit = spaceSplit.replace(':30', '.5');
	}
	var check = /\d/;
	var seperate = spaceSplit.match(check);
	var seperate2 = spaceSplit.indexOf(seperate);
	var days = spaceSplit.substring(0, seperate2);
	var times = spaceSplit.substring(seperate2);
	var output = [];
	
	if (times.length == 1) {
		var lol = (parseInt(times)+1).toString();
		times = times.concat("-", lol);
	}

	var timeSplit = times.split('-');
	for (i = 0; i<days.length; i++) {
		output.push(dayMap[days.charAt(i)]+timeMap[timeSplit[0]], dayMap[days.charAt(i)]+timeMap[timeSplit[1]]);
	}
	
	return output;
	
}

function populateColorMapping() {
	colorMapping[1] = '#6698FF';
	colorMapping[2] = '#C48793';
	colorMapping[3] = '#9E7BFF';
	colorMapping[4] = '#F88017';
	colorMapping[5] = '#C45AEC';
	colorMapping[6] = '#EDDA74';
	colorMapping[7] = '#C45AEC';
	colorMapping[8] = '#4E9258';
	colorMapping[9] = '#43BFC7';
	colorMapping[10] = '#5E767E';
	
	
}

function populateTimeMappings() {
	timeMappings['8:00 AM'] = 16;
	timeMappings['8:30 AM'] = 17;
	timeMappings['9:00 AM'] = 18;
	timeMappings['9:30 AM'] = 19;
	timeMappings['10:00 AM'] = 20;
	timeMappings['10:30 AM'] = 21;
	timeMappings['11:00 AM'] = 22;
	timeMappings['11:30 AM'] = 23;
	timeMappings['12:00 PM'] = 24;
	timeMappings['12:30 PM'] = 25;
	timeMappings['1:00 PM'] = 26;
	timeMappings['1:30 PM'] = 27;
	timeMappings['2:00 PM'] = 28;
	timeMappings['2:30 PM'] = 29;
	timeMappings['3:00 PM'] = 30;
	timeMappings['3:30 PM'] = 31;
	timeMappings['4:00 PM'] = 32;
	timeMappings['4:30 PM'] = 33;
	timeMappings['5:00 PM'] = 34;
	timeMappings['5:30 PM'] = 35;
	timeMappings['6:00 PM'] = 36;
	timeMappings['6:30 PM'] = 37;
	timeMappings['7:00 PM'] = 38;
	timeMappings['7:30 PM'] = 39;
	timeMappings['8:00 PM'] = 40;
	timeMappings['8:30 PM'] = 41;
	timeMappings['9:00 PM'] = 42;
	timeMappings['9:30 PM'] = 43;
}

function populateClassList() {
classList['WGS.101'] = true;
classList['18.02A'] = true;
classList['15.840'] = true;
classList['CMS.846'] = true;
classList['CMS.843'] = true;
classList['18.024'] = true;
classList['21L.488'] = true;
classList['21L.487'] = true;
classList['4.663'] = true;
classList['21M.273'] = true;
classList['18.336'] = true;
classList['9.285'] = true;
classList['21L.715'] = true;
classList['21L.471'] = true;
classList['CMS.838'] = true;
classList['21L.473'] = true;
classList['18.330'] = true;
classList['CMS.631'] = true;
classList['10.10'] = true;
classList['18.747'] = true;
classList['CMS.830'] = true;
classList['WGS.115'] = true;
classList['CMS.831'] = true;
classList['18.745'] = true;
classList['15.839'] = true;
classList['16.522'] = true;
classList['18.338'] = true;
classList['11.125'] = true;
classList['11.126'] = true;
classList['11.123'] = true;
classList['HST.212'] = true;
classList['CMS.400'] = true;
classList['18.369'] = true;
classList['16.S498'] = true;
classList['CMS.821'] = true;
classList['11.127'] = true;
classList['14.70'] = true;
classList['CMS.621'] = true;
classList['HST.491'] = true;
classList['10.04'] = true;
classList['ESD.274'] = true;
classList['10.03'] = true;
classList['ES.8022'] = true;
classList['14.75'] = true;
classList['21M.294'] = true;
classList['15.828'] = true;
classList['18.354'] = true;
classList['21A.341'] = true;
classList['21A.342'] = true;
classList['CMS.812'] = true;
classList['4.670'] = true;
classList['18.034'] = true;
classList['CMS.612'] = true;
classList['CMS.610'] = true;
classList['4.671'] = true;
classList['CMS.616'] = true;
classList['16.323'] = true;
classList['ESD.261'] = true;
classList['ESD.267'] = true;
classList['ESD.265'] = true;
classList['ESD.268'] = true;
classList['14.272'] = true;
classList['14.273'] = true;
classList['10.65'] = true;
classList['4.616'] = true;
classList['WGS.142'] = true;
classList['WGS.141'] = true;
classList['11.147'] = true;
classList['18.102'] = true;
classList['18.104'] = true;
classList['CMS.607'] = true;
classList['18.304'] = true;
classList['4.625'] = true;
classList['21L.448'] = true;
classList['ESD.212'] = true;
classList['CMS.609'] = true;
classList['18.306'] = true;
classList['16.333'] = true;
classList['15.S42'] = true;
classList['16.338'] = true;
classList['5.512'] = true;
classList['14.51'] = true;
classList['14.283'] = true;
classList['18.706'] = true;
classList['14.284'] = true;
classList['6.335'] = true;
classList['6.334'] = true;
classList['18.704'] = true;
classList['CMS.876'] = true;
classList['18.702'] = true;
classList['10.53'] = true;
classList['11.131'] = true;
classList['4.605'] = true;
classList['24.401'] = true;
classList['16.763'] = true;
classList['21L.430'] = true;
classList['24.601'] = true;
classList['4.611'] = true;
classList['21L.434'] = true;
classList['21W.890'] = true;
classList['ES.010'] = true;
classList['4.613'] = true;
classList['17.407'] = true;
classList['24.810'] = true;
classList['10.56'] = true;
classList['11.800'] = true;
classList['CMS.871'] = true;
classList['16.346'] = true;
classList['CMS.863'] = true;
classList['CMS.866'] = true;
classList['CMS.868'] = true;
classList['3.903'] = true;
classList['21L.460'] = true;
classList['11.166'] = true;
classList['1.714'] = true;
classList['15.S21'] = true;
classList['4.644'] = true;
classList['15.S24'] = true;
classList['4.645'] = true;
classList['15.S23'] = true;
classList['15.S26'] = true;
classList['WGS.170'] = true;
classList['15.S25'] = true;
classList['21M.250'] = true;
classList['14.32'] = true;
classList['NS.202'] = true;
classList['18.086'] = true;
classList['4.641'] = true;
classList['14.33'] = true;
classList['NS.201'] = true;
classList['18.085'] = true;
classList['CMS.861'] = true;
classList['15.S20'] = true;
classList['CMS.862'] = true;
classList['10.32'] = true;
classList['18.726'] = true;
classList['18.310'] = true;
classList['21L.451'] = true;
classList['1.723'] = true;
classList['11.153'] = true;
classList['18.312'] = true;
classList['21M.269'] = true;
classList['18.311'] = true;
classList['22.107'] = true;
classList['ESD.222'] = true;
classList['14.48'] = true;
classList['18.318'] = true;
classList['11.161'] = true;
classList['22.106'] = true;
classList['11.162'] = true;
classList['14.43'] = true;
classList['18.075'] = true;
classList['ESD.226'] = true;
classList['14.44'] = true;
classList['22.313'] = true;
classList['21M.260'] = true;
classList['8.04'] = true;
classList['8.03'] = true;
classList['7.014'] = true;
classList['7.013'] = true;
classList['8.08'] = true;
classList['21A.100'] = true;
classList['15.S30'] = true;
classList['10.37'] = true;
classList['9.691'] = true;
classList['8.06'] = true;
classList['MAS.533'] = true;
classList['MAS.532'] = true;
classList['15.S06'] = true;
classList['15.S03'] = true;
classList['15.S01'] = true;
classList['15.S02'] = true;
classList['15.S09'] = true;
classList['15.S08'] = true;
classList['15.S07'] = true;
classList['2.341'] = true;
classList['21L.000'] = true;
classList['15.S14'] = true;
classList['15.S15'] = true;
classList['15.S16'] = true;
classList['15.S10'] = true;
classList['15.S11'] = true;
classList['15.S12'] = true;
classList['15.S13'] = true;
classList['21L.009'] = true;
classList['9.59'] = true;
classList['21L.002'] = true;
classList['21L.007'] = true;
classList['21A.512'] = true;
classList['21L.008'] = true;
classList['21L.005'] = true;
classList['21L.006'] = true;
classList['MAS.551'] = true;
classList['MAS.552'] = true;
classList['3.36'] = true;
classList['21F.019'] = true;
classList['21F.011'] = true;
classList['12.540'] = true;
classList['16.985'] = true;
classList['4.602'] = true;
classList['21F.029'] = true;
classList['20.S952'] = true;
classList['3.21'] = true;
classList['3.22'] = true;
classList['21F.021'] = true;
classList['21F.022'] = true;
classList['21F.027'] = true;
classList['21L.029'] = true;
classList['9.35'] = true;
classList['21A.760'] = true;
classList['MAS.571'] = true;
classList['17.202'] = true;
classList['MAS.581'] = true;
classList['22.561'] = true;
classList['STS.449'] = true;
classList['4.189'] = true;
classList['HST.203'] = true;
classList['SP.360'] = true;
classList['4.181'] = true;
classList['2.570'] = true;
classList['18.784'] = true;
classList['18.785'] = true;
classList['4.183'] = true;
classList['9.91'] = true;
classList['18.781'] = true;
classList['18.783'] = true;
classList['WGS.700'] = true;
classList['2.370'] = true;
classList['11.S195'] = true;
classList['11.S196'] = true;
classList['2.374'] = true;
classList['HST.200'] = true;
classList['12.591'] = true;
classList['HST.202'] = true;
classList['16.940'] = true;
classList['9.65'] = true;
classList['9.68'] = true;
classList['21L.706'] = true;
classList['21L.702'] = true;
classList['21L.703'] = true;
classList['21L.705'] = true;
classList['2.391'] = true;
classList['9.70'] = true;
classList['9.75'] = true;
classList['20.411'] = true;
classList['9.77'] = true;
classList['ES.802'] = true;
classList['20.415'] = true;
classList['7.68'] = true;
classList['11.316'] = true;
classList['10.606'] = true;
classList['11.THG'] = true;
classList['21F.222'] = true;
classList['21F.220'] = true;
classList['17.962'] = true;
classList['7.66'] = true;
classList['7.63'] = true;
classList['21F.223'] = true;
classList['21F.224'] = true;
classList['21F.084'] = true;
classList['7.64'] = true;
classList['21H.152'] = true;
classList['15.649'] = true;
classList['15.442'] = true;
classList['21H.155'] = true;
classList['WGS.231'] = true;
classList['WGS.237'] = true;
classList['WGS.234'] = true;
classList['15.441'] = true;
classList['12.870'] = true;
classList['21H.365'] = true;
classList['10.S95'] = true;
classList['1.34'] = true;
classList['12.207'] = true;
classList['12.601'] = true;
classList['7.70'] = true;
classList['4.541'] = true;
classList['4.542'] = true;
classList['11.320'] = true;
classList['6.UAT'] = true;
classList['12.603'] = true;
classList['21F.074'] = true;
classList['7.76'] = true;
classList['21F.075'] = true;
classList['7.77'] = true;
classList['21F.219'] = true;
classList['15.434'] = true;
classList['17.955'] = true;
classList['15.433'] = true;
classList['WGS.220'] = true;
classList['18.100B'] = true;
classList['22.70'] = true;
classList['18.100C'] = true;
classList['15.438'] = true;
classList['WGS.221'] = true;
classList['12.007'] = true;
classList['21H.351'] = true;
classList['18.100A'] = true;
classList['WGS.228'] = true;
classList['11.526'] = true;
classList['3.97'] = true;
classList['21H.161'] = true;
classList['22.78'] = true;
classList['12.009'] = true;
classList['ES.S10'] = true;
classList['ES.S11'] = true;
classList['WGS.640'] = true;
classList['7.49'] = true;
classList['4.S12'] = true;
classList['4.S14'] = true;
classList['8.325'] = true;
classList['MAS.S60'] = true;
classList['MAS.S61'] = true;
classList['3.091'] = true;
classList['7.41'] = true;
classList['4.553'] = true;
classList['2.965'] = true;
classList['6.170'] = true;
classList['4.556'] = true;
classList['20.451'] = true;
classList['15.428'] = true;
classList['4.557'] = true;
classList['15.427'] = true;
classList['15.423'] = true;
classList['15.628'] = true;
classList['4.163'] = true;
classList['8.334'] = true;
classList['22.62'] = true;
classList['22.63'] = true;
classList['18.06'] = true;
classList['18.05'] = true;
classList['11.306'] = true;
classList['11.303'] = true;
classList['18.02'] = true;
classList['2.003'] = true;
classList['18.01'] = true;
classList['7.57'] = true;
classList['7.58'] = true;
classList['4.561'] = true;
classList['2.001'] = true;
classList['18.04'] = true;
classList['2.006'] = true;
classList['2.005'] = true;
classList['STS.340'] = true;
classList['7.55'] = true;
classList['20.440'] = true;
classList['11.302'] = true;
classList['EC.733'] = true;
classList['15.419'] = true;
classList['6.182'] = true;
classList['15.615'] = true;
classList['WGS.240'] = true;
classList['15.617'] = true;
classList['21H.185'] = true;
classList['22.55'] = true;
classList['17.021'] = true;
classList['MAS.S63'] = true;
classList['MAS.S62'] = true;
classList['EC.720'] = true;
classList['21F.040'] = true;
classList['21F.046'] = true;
classList['7.26'] = true;
classList['6.857'] = true;
classList['EC.130'] = true;
classList['7.23'] = true;
classList['21F.852'] = true;
classList['7.29'] = true;
classList['CMS.376'] = true;
classList['7.28'] = true;
classList['7.27'] = true;
classList['1.58'] = true;
classList['3.45'] = true;
classList['21H.321'] = true;
classList['6.865'] = true;
classList['ES.S41'] = true;
classList['MAS.600'] = true;
classList['2.702'] = true;
classList['WGS.270'] = true;
classList['2.704'] = true;
classList['4.501'] = true;
classList['15.676'] = true;
classList['18.S995'] = true;
classList['EC.711'] = true;
classList['7.33'] = true;
classList['EC.120'] = true;
classList['7.37'] = true;
classList['MAS.111'] = true;
classList['EC.714'] = true;
classList['1.76'] = true;
classList['EC.715'] = true;
classList['1.77'] = true;
classList['EC.310'] = true;
classList['6.850'] = true;
classList['21H.312'] = true;
classList['EC.110'] = true;
classList['6.851'] = true;
classList['21F.451'] = true;
classList['12.844'] = true;
classList['17.006'] = true;
classList['17.007'] = true;
classList['4.302'] = true;
classList['21F.064'] = true;
classList['4.510'] = true;
classList['15.668'] = true;
classList['7.08'] = true;
classList['7.06'] = true;
classList['21F.069'] = true;
classList['7.05'] = true;
classList['14.573'] = true;
classList['21F.068'] = true;
classList['5.921'] = true;
classList['10.626'] = true;
classList['EC.101'] = true;
classList['5.913'] = true;
classList['10.213'] = true;
classList['ES.S20'] = true;
classList['EC.100'] = true;
classList['14.772'] = true;
classList['6.881'] = true;
classList['8.371'] = true;
classList['2.722'] = true;
classList['14.773'] = true;
classList['STS.390'] = true;
classList['12.810'] = true;
classList['NS.402'] = true;
classList['4.314'] = true;
classList['4.315'] = true;
classList['15.655'] = true;
classList['4.522'] = true;
classList['15.657'] = true;
classList['2.705'] = true;
classList['CC.111'] = true;
classList['7.10'] = true;
classList['CC.112'] = true;
classList['4.523'] = true;
classList['CC.114'] = true;
classList['21F.233'] = true;
classList['21F.232'] = true;
classList['20.486'] = true;
classList['14.582'] = true;
classList['1.322'] = true;
classList['4.113'] = true;
classList['21H.333'] = true;
classList['6.875'] = true;
classList['4.115'] = true;
classList['6.870'] = true;
classList['2.710'] = true;
classList['11.543'] = true;
classList['11.541'] = true;
classList['20.200'] = true;
classList['4.111'] = true;
classList['12.820'] = true;
classList['21M.405'] = true;
classList['4.333'] = true;
classList['2.744'] = true;
classList['4.332'] = true;
classList['14.26'] = true;
classList['15.268'] = true;
classList['22.00'] = true;
classList['21M.401'] = true;
classList['14.21'] = true;
classList['5.941'] = true;
classList['6.813'] = true;
classList['18.966'] = true;
classList['6.814'] = true;
classList['22.02'] = true;
classList['6.815'] = true;
classList['6.115'] = true;
classList['12.080'] = true;
classList['1.138'] = true;
classList['12.802'] = true;
classList['12.801'] = true;
classList['3.044'] = true;
classList['21F.410'] = true;
classList['4.343'] = true;
classList['4.342'] = true;
classList['21M.604'] = true;
classList['4.341'] = true;
classList['MAS.160'] = true;
classList['WGS.190'] = true;
classList['18.952'] = true;
classList['18.950'] = true;
classList['21M.606'] = true;
classList['6.123'] = true;
classList['5.931'] = true;
classList['2.066'] = true;
classList['9.S913'] = true;
classList['9.S915'] = true;
classList['4.S66'] = true;
classList['14.19'] = true;
classList['ESD.864'] = true;
classList['2.062'] = true;
classList['ESD.863'] = true;
classList['2.065'] = true;
classList['1.851'] = true;
classList['4.S68'] = true;
classList['21F.416'] = true;
classList['ESD.054'] = true;
classList['ESD.053'] = true;
classList['ESD.052'] = true;
classList['ESD.051'] = true;
classList['6.632'] = true;
classList['6.634'] = true;
classList['1.562'] = true;
classList['21F.401'] = true;
classList['1.561'] = true;
classList['21M.426'] = true;
classList['6.S062'] = true;
classList['21M.423'] = true;
classList['18.157'] = true;
classList['6.842'] = true;
classList['2.071'] = true;
classList['21M.421'] = true;
classList['18.156'] = true;
classList['14.03'] = true;
classList['14.05'] = true;
classList['21M.226'] = true;
classList['ES.S60'] = true;
classList['1.151'] = true;
classList['ES.S61'] = true;
classList['11.378'] = true;
classList['6.431'] = true;
classList['2.753'] = true;
classList['4.368'] = true;
classList['4.367'] = true;
classList['2.752'] = true;
classList['21H.102'] = true;
classList['3.021'] = true;
classList['4.366'] = true;
classList['8.962'] = true;
classList['4.365'] = true;
classList['6.641'] = true;
classList['15.270'] = true;
classList['10.450'] = true;
classList['6.437'] = true;
classList['6.832'] = true;
classList['6.831'] = true;
classList['6.830'] = true;
classList['21L.422'] = true;
classList['21L.421'] = true;
classList['21M.410'] = true;
classList['CC.802'] = true;
classList['2.081'] = true;
classList['15.279'] = true;
classList['2.082'] = true;
classList['2.085'] = true;
classList['21M.215'] = true;
classList['MAS.132'] = true;
classList['6.824'] = true;
classList['6.102'] = true;
classList['ES.S71'] = true;
classList['ES.S70'] = true;
classList['6.443'] = true;
classList['21H.106'] = true;
classList['6.441'] = true;
classList['18.175'] = true;
classList['15.879'] = true;
classList['22.40'] = true;
classList['21M.442'] = true;
classList['2.782'] = true;
classList['21M.445'] = true;
classList['14.124'] = true;
classList['8.311'] = true;
classList['14.126'] = true;
classList['15.229'] = true;
classList['1.582'] = true;
classList['6.S083'] = true;
classList['14.123'] = true;
classList['6.652'] = true;
classList['10.441'] = true;
classList['6.S084'] = true;
classList['ESD.283'] = true;
classList['2.785'] = true;
classList['17.483'] = true;
classList['17.482'] = true;
classList['11.352'] = true;
classList['1.782'] = true;
classList['15.025'] = true;
classList['18.376'] = true;
classList['15.878'] = true;
classList['4.S32'] = true;
classList['8.512'] = true;
classList['1.383'] = true;
classList['21W.735'] = true;
classList['8.322'] = true;
classList['21W.739'] = true;
classList['18.994'] = true;
classList['8.323'] = true;
classList['1.570'] = true;
classList['6.S076'] = true;
classList['21H.390'] = true;
classList['4.389'] = true;
classList['6.S078'] = true;
classList['4.388'] = true;
classList['9.013'] = true;
classList['9.012'] = true;
classList['11.367'] = true;
classList['1.813'] = true;
classList['4.587'] = true;
classList['4.583'] = true;
classList['4.582'] = true;
classList['22.38'] = true;
classList['21L.640'] = true;
classList['11.369'] = true;
classList['21W.742'] = true;
classList['21W.741'] = true;
classList['15.460'] = true;
classList['4.390'] = true;
classList['CC.1803'] = true;
classList['16.540'] = true;
classList['10.426'] = true;
classList['3.054'] = true;
classList['21H.134'] = true;
classList['21H.133'] = true;
classList['12.011'] = true;
classList['21H.132'] = true;
classList['MAS.836'] = true;
classList['3.053'] = true;
classList['11.330'] = true;
classList['8.901'] = true;
classList['4.S52'] = true;
classList['11.334'] = true;
classList['11.333'] = true;
classList['11.332'] = true;
classList['11.339'] = true;
classList['11.338'] = true;
classList['11.337'] = true;
classList['4.S54'] = true;
classList['21M.460'] = true;
classList['1.00'] = true;
classList['15.451'] = true;
classList['2.792'] = true;
classList['2.793'] = true;
classList['21M.451'] = true;
classList['2.797'] = true;
classList['8.711'] = true;
classList['3.063'] = true;
classList['MAS.826'] = true;
classList['21H.142'] = true;
classList['7.342'] = true;
classList['7.343'] = true;
classList['15.032'] = true;
classList['2.997'] = true;
classList['15.031'] = true;
classList['11.344'] = true;
classList['7.346'] = true;
classList['2.998'] = true;
classList['4.S42'] = true;
classList['5.063'] = true;
classList['7.345'] = true;
classList['21M.450'] = true;
classList['5.069'] = true;
classList['5.068'] = true;
classList['15.038'] = true;
classList['15.037'] = true;
classList['24.118'] = true;
classList['24.942'] = true;
classList['HST.500'] = true;
classList['24.114'] = true;
classList['21A.215'] = true;
classList['16.230'] = true;
classList['11.005'] = true;
classList['11.003'] = true;
classList['WGS.600'] = true;
classList['24.111'] = true;
classList['15.905'] = true;
classList['HST.509'] = true;
classList['2.18'] = true;
classList['21W.764'] = true;
classList['21W.762'] = true;
classList['21A.218'] = true;
classList['21W.757'] = true;
classList['HST.922'] = true;
classList['HST.923'] = true;
classList['21W.755'] = true;
classList['2.23'] = true;
classList['HST.924'] = true;
classList['21W.754'] = true;
classList['2.22'] = true;
classList['14.137'] = true;
classList['HST.921'] = true;
classList['16.430'] = true;
classList['24.954'] = true;
classList['24.956'] = true;
classList['CMS.935'] = true;
classList['24.952'] = true;
classList['21M.380'] = true;
classList['21A.225'] = true;
classList['HST.101'] = true;
classList['HST.100'] = true;
classList['21A.228'] = true;
classList['WGS.615'] = true;
classList['21A.229'] = true;
classList['17.303'] = true;
classList['21W.752'] = true;
classList['21W.746'] = true;
classList['2.14'] = true;
classList['21W.745'] = true;
classList['21W.749'] = true;
classList['16.20'] = true;
classList['6.S897'] = true;
classList['HST.918'] = true;
classList['14.003'] = true;
classList['HST.916'] = true;
classList['HST.523'] = true;
classList['11.910'] = true;
classList['HST.524'] = true;
classList['HST.527'] = true;
classList['6.265'] = true;
classList['21W.785'] = true;
classList['HST.110'] = true;
classList['6.262'] = true;
classList['21M.350'] = true;
classList['ESD.86'] = true;
classList['21M.351'] = true;
classList['ESD.80'] = true;
classList['ESD.129'] = true;
classList['HST.111'] = true;
classList['16.831'] = true;
classList['ESD.137'] = true;
classList['ESD.132'] = true;
classList['21W.777'] = true;
classList['17.317'] = true;
classList['HST.905'] = true;
classList['15.097'] = true;
classList['16.36'] = true;
classList['15.099'] = true;
classList['22.012'] = true;
classList['HST.521'] = true;
classList['HST.514'] = true;
classList['HST.790'] = true;
classList['24.933'] = true;
classList['6.256'] = true;
classList['6.253'] = true;
classList['CMS.951'] = true;
classList['6.252'] = true;
classList['15.914'] = true;
classList['15.915'] = true;
classList['21W.771'] = true;
classList['15.913'] = true;
classList['7.549'] = true;
classList['21W.769'] = true;
classList['ESD.125'] = true;
classList['17.523'] = true;
classList['21W.768'] = true;
classList['21W.767'] = true;
classList['18.440'] = true;
classList['16.855'] = true;
classList['ESD.63'] = true;
classList['18.443'] = true;
classList['6.241'] = true;
classList['ESD.64'] = true;
classList['2.59'] = true;
classList['24.900'] = true;
classList['2.60'] = true;
classList['15.071'] = true;
classList['2.61'] = true;
classList['24.909'] = true;
classList['HST.542'] = true;
classList['15.074'] = true;
classList['9.777'] = true;
classList['24.905'] = true;
classList['15.077'] = true;
classList['15.078'] = true;
classList['24.903'] = true;
classList['2.67'] = true;
classList['16.470'] = true;
classList['2.62'] = true;
classList['16.863'] = true;
classList['21W.790'] = true;
classList['9.181'] = true;
classList['14.386'] = true;
classList['24.912'] = true;
classList['ESD.77'] = true;
classList['14.382'] = true;
classList['15.084'] = true;
classList['HST.531'] = true;
classList['24.918'] = true;
classList['24.914'] = true;
classList['24.711'] = true;
classList['2.55'] = true;
classList['18.438'] = true;
classList['ESD.802'] = true;
classList['2.57'] = true;
classList['21W.789'] = true;
classList['18.436'] = true;
classList['24.502'] = true;
classList['HST.151'] = true;
classList['ESD.40'] = true;
classList['18.424'] = true;
classList['2.37'] = true;
classList['11.027'] = true;
classList['11.026'] = true;
classList['HST.150'] = true;
classList['15.053'] = true;
classList['HST.560'] = true;
classList['16.459'] = true;
classList['18.425'] = true;
classList['17.552'] = true;
classList['15.058'] = true;
classList['21L.325'] = true;
classList['17.551'] = true;
classList['18.410'] = true;
classList['11.011'] = true;
classList['11.013'] = true;
classList['11.016'] = true;
classList['16.888'] = true;
classList['15.070'] = true;
classList['16.09'] = true;
classList['18.821'] = true;
classList['16.00'] = true;
classList['CMS.990'] = true;
classList['17.565'] = true;
classList['21L.310'] = true;
classList['18.418'] = true;
classList['22.912'] = true;
classList['HST.934'] = true;
classList['21L.315'] = true;
classList['16.90'] = true;
classList['24.02'] = true;
classList['20.104'] = true;
classList['HST.584'] = true;
classList['MAS.672'] = true;
classList['10.998'] = true;
classList['10.997'] = true;
classList['ES.1803'] = true;
classList['ES.1802'] = true;
classList['10.390'] = true;
classList['10.992'] = true;
classList['24.04'] = true;
classList['10.996'] = true;
classList['10.995'] = true;
classList['12.420'] = true;
classList['10.392'] = true;
classList['10.994'] = true;
classList['18.400'] = true;
classList['20.111'] = true;
classList['CMS.312'] = true;
classList['MAS.664'] = true;
classList['CMS.590'] = true;
classList['21F.142'] = true;
classList['21F.143'] = true;
classList['CMS.S98'] = true;
classList['STS.S91'] = true;
classList['10.976'] = true;
classList['10.974'] = true;
classList['10.971'] = true;
classList['10.970'] = true;
classList['22.211'] = true;
classList['HST.590'] = true;
classList['20.310'] = true;
classList['ESD.S50'] = true;
classList['10.987'] = true;
classList['10.989'] = true;
classList['10.983'] = true;
classList['10.982'] = true;
classList['10.985'] = true;
classList['12.431'] = true;
classList['10.984'] = true;
classList['10.981'] = true;
classList['CMS.362'] = true;
classList['CMS.361'] = true;
classList['16.50'] = true;
classList['21F.802'] = true;
classList['ESD.S41'] = true;
classList['24.981'] = true;
classList['ESD.S43'] = true;
classList['21F.804'] = true;
classList['16.003'] = true;
classList['7.95'] = true;
classList['10.953'] = true;
classList['7.98'] = true;
classList['ESD.S40'] = true;
classList['16.68'] = true;
classList['7.80'] = true;
classList['21F.106'] = true;
classList['9.301'] = true;
classList['16.64'] = true;
classList['ESD.S31'] = true;
classList['24.991'] = true;
classList['ESD.S30'] = true;
classList['10.960'] = true;
classList['10.964'] = true;
classList['10.965'] = true;
classList['10.967'] = true;
classList['10.968'] = true;
classList['10.969'] = true;
classList['7.88'] = true;
classList['6.691'] = true;
classList['21F.820'] = true;
classList['6.695'] = true;
classList['12.409'] = true;
classList['17.S953'] = true;
classList['17.S950'] = true;
classList['12.482'] = true;
classList['12.402'] = true;
classList['17.S952'] = true;
classList['ESD.S22'] = true;
classList['ESD.S21'] = true;
classList['24.962'] = true;
classList['12.400'] = true;
classList['12.S990'] = true;
classList['24.967'] = true;
classList['24.968'] = true;
classList['MAS.681'] = true;
classList['16.89'] = true;
classList['16.82'] = true;
classList['10.807'] = true;
classList['21A.430'] = true;
classList['CMS.335'] = true;
classList['CMS.338'] = true;
classList['24.973'] = true;
classList['4.431'] = true;
classList['17.33'] = true;
classList['20.380'] = true;
classList['21F.716'] = true;
classList['21F.713'] = true;
classList['4.430'] = true;
classList['21F.711'] = true;
classList['1.233'] = true;
classList['11.S965'] = true;
classList['21M.785'] = true;
classList['17.28'] = true;
classList['20.371'] = true;
classList['21F.312'] = true;
classList['21M.581'] = true;
classList['2.830'] = true;
classList['MAS.510'] = true;
classList['EC.075'] = true;
classList['MAS.511'] = true;
classList['21F.310'] = true;
classList['21M.789'] = true;
classList['14.662'] = true;
classList['21F.590'] = true;
classList['5.24'] = true;
classList['12.740'] = true;
classList['10.301'] = true;
classList['21F.592'] = true;
classList['21H.253'] = true;
classList['21H.250'] = true;
classList['6.071'] = true;
classList['17.55'] = true;
classList['6.072'] = true;
classList['17.57'] = true;
classList['MS.402'] = true;
classList['6.070'] = true;
classList['17.802'] = true;
classList['21F.346'] = true;
classList['17.115'] = true;
classList['17.50'] = true;
classList['12.115'] = true;
classList['STS.089'] = true;
classList['6.781'] = true;
classList['STS.087'] = true;
classList['21H.245'] = true;
classList['5.50'] = true;
classList['6.780'] = true;
classList['21H.981'] = true;
classList['15.326'] = true;
classList['15.318'] = true;
classList['2.813'] = true;
classList['24.S95'] = true;
classList['21F.192'] = true;
classList['4.427'] = true;
classList['24.S96'] = true;
classList['STS.091'] = true;
classList['21F.199'] = true;
classList['EC.090'] = true;
classList['21H.236'] = true;
classList['17.42'] = true;
classList['17.S914'] = true;
classList['5.48'] = true;
classList['6.775'] = true;
classList['5.45'] = true;
classList['21F.740'] = true;
classList['17.S919'] = true;
classList['5.46'] = true;
classList['6.777'] = true;
classList['17.S918'] = true;
classList['5.44'] = true;
classList['15.317'] = true;
classList['6.S977'] = true;
classList['6.S976'] = true;
classList['12.333'] = true;
classList['21F.562'] = true;
classList['21F.563'] = true;
classList['20.330'] = true;
classList['10.333'] = true;
classList['1.002'] = true;
classList['2.S997'] = true;
classList['1.001'] = true;
classList['6.02'] = true;
classList['21H.217'] = true;
classList['6.00'] = true;
classList['12.340'] = true;
classList['21F.555'] = true;
classList['21F.556'] = true;
classList['15.539'] = true;
classList['21H.213'] = true;
classList['1.202'] = true;
classList['21H.211'] = true;
classList['2.160'] = true;
classList['9.14'] = true;
classList['5.08'] = true;
classList['9.18'] = true;
classList['21H.209'] = true;
classList['1.S979'] = true;
classList['12.510'] = true;
classList['5.111'] = true;
classList['1.S978'] = true;
classList['15.565'] = true;
classList['21F.163'] = true;
classList['21F.162'] = true;
classList['20.361'] = true;
classList['9.10'] = true;
classList['11.432'] = true;
classList['11.S949'] = true;
classList['11.434'] = true;
classList['11.S948'] = true;
classList['11.S943'] = true;
classList['11.S942'] = true;
classList['11.S941'] = true;
classList['21M.515'] = true;
classList['11.S940'] = true;
classList['11.436'] = true;
classList['11.S946'] = true;
classList['11.438'] = true;
classList['11.S944'] = true;
classList['5.12'] = true;
classList['9.09'] = true;
classList['2.140'] = true;
classList['9.S52'] = true;
classList['EC.050'] = true;
classList['9.00'] = true;
classList['CC.011'] = true;
classList['20.345'] = true;
classList['5.05'] = true;
classList['5.03'] = true;
classList['6.730'] = true;
classList['11.S958'] = true;
classList['15.386'] = true;
classList['3.961'] = true;
classList['4.232'] = true;
classList['17.584'] = true;
classList['18.276'] = true;
classList['4.233'] = true;
classList['17.581'] = true;
classList['21M.065'] = true;
classList['15.387'] = true;
classList['ESD.38'] = true;
classList['15.771'] = true;
classList['11.252'] = true;
classList['HST.060'] = true;
classList['14.462'] = true;
classList['17.178'] = true;
classList['11.255'] = true;
classList['HST.061'] = true;
classList['1.036'] = true;
classList['6.717'] = true;
classList['22.612'] = true;
classList['11.469'] = true;
classList['6.902'] = true;
classList['15.371'] = true;
classList['21M.505'] = true;
classList['17.572'] = true;
classList['ESD.712'] = true;
classList['4.241'] = true;
classList['4.247'] = true;
classList['6.522'] = true;
classList['4.244'] = true;
classList['15.376'] = true;
classList['11.466'] = true;
classList['14.453'] = true;
classList['16.891'] = true;
classList['15.575'] = true;
classList['24.235'] = true;
classList['21M.705'] = true;
classList['24.237'] = true;
classList['14.454'] = true;
classList['15.571'] = true;
classList['1.041'] = true;
classList['21L.501'] = true;
classList['17.181'] = true;
classList['18.917'] = true;
classList['17.182'] = true;
classList['HST.977'] = true;
classList['STS.001'] = true;
classList['5.561'] = true;
classList['HST.979'] = true;
classList['8.282'] = true;
classList['11.479'] = true;
classList['4.216'] = true;
classList['STS.009'] = true;
classList['2.71'] = true;
classList['8.284'] = true;
classList['3.152'] = true;
classList['ESD.344'] = true;
classList['11.474'] = true;
classList['STS.005'] = true;
classList['HST.710'] = true;
classList['4.211'] = true;
classList['15.141'] = true;
classList['STS.007'] = true;
classList['HST.081'] = true;
classList['11.481'] = true;
classList['1.016'] = true;
classList['18.901'] = true;
classList['HST.080'] = true;
classList['15.792'] = true;
classList['18.904'] = true;
classList['18.906'] = true;
classList['1.011'] = true;
classList['22.S904'] = true;
classList['HST.971'] = true;
classList['ESD.753'] = true;
classList['15.799'] = true;
classList['ESD.755'] = true;
classList['15.137'] = true;
classList['2.180'] = true;
classList['21W.011'] = true;
classList['15.396'] = true;
classList['NS.301'] = true;
classList['11.487'] = true;
classList['STS.901'] = true;
classList['ESD.352'] = true;
classList['2.83'] = true;
classList['15.399'] = true;
classList['17.871'] = true;
classList['15.398'] = true;
classList['HST.723'] = true;
classList['11.484'] = true;
classList['10.792'] = true;
classList['ESD.00'] = true;
classList['ESD.01'] = true;
classList['24.211'] = true;
classList['14.471'] = true;
classList['6.302'] = true;
classList['1.020'] = true;
classList['17.398'] = true;
classList['1.021'] = true;
classList['6.006'] = true;
classList['2.184'] = true;
classList['2.183'] = true;
classList['6.007'] = true;
classList['6.004'] = true;
classList['2.890'] = true;
classList['24.215'] = true;
classList['21W.041'] = true;
classList['10.543'] = true;
classList['11.496'] = true;
classList['10.542'] = true;
classList['15.349'] = true;
classList['12.980'] = true;
classList['15.122'] = true;
classList['5.74'] = true;
classList['5.72'] = true;
classList['21W.826'] = true;
classList['21W.824'] = true;
classList['15.123'] = true;
classList['1.274'] = true;
classList['2.682'] = true;
classList['1.273'] = true;
classList['1.271'] = true;
classList['21M.340'] = true;
classList['6.012'] = true;
classList['21M.735'] = true;
classList['6.011'] = true;
classList['4.474'] = true;
classList['6.013'] = true;
classList['ESD.565'] = true;
classList['4.475'] = true;
classList['22.071'] = true;
classList['8.022'] = true;
classList['3.370'] = true;
classList['22.070'] = true;
classList['2.888'] = true;
classList['3.990'] = true;
classList['5.60'] = true;
classList['10.531'] = true;
classList['5.62'] = true;
classList['ESD.192'] = true;
classList['ESD.191'] = true;
classList['1.472'] = true;
classList['5.64'] = true;
classList['24.280'] = true;
classList['1.081'] = true;
classList['8.421'] = true;
classList['21W.035'] = true;
classList['1.083'] = true;
classList['16.S949'] = true;
classList['1.284'] = true;
classList['21W.031'] = true;
classList['10.536'] = true;
classList['8.614'] = true;
classList['ESD.756'] = true;
classList['1.080'] = true;
classList['6.024'] = true;
classList['ESD.762'] = true;
classList['6.023'] = true;
classList['6.022'] = true;
classList['11.220'] = true;
classList['21M.011'] = true;
classList['1.258'] = true;
classList['ESD.162'] = true;
classList['10.569'] = true;
classList['1.253'] = true;
classList['4.253'] = true;
classList['3.985'] = true;
classList['4.254'] = true;
classList['1.251'] = true;
classList['16.687'] = true;
classList['3.987'] = true;
classList['15.363'] = true;
classList['1.254'] = true;
classList['8.431'] = true;
classList['1.255'] = true;
classList['6.034'] = true;
classList['1.055'] = true;
classList['1.053'] = true;
classList['21M.715'] = true;
classList['6.035'] = true;
classList['14.444'] = true;
classList['8.044'] = true;
classList['14.441'] = true;
classList['11.234'] = true;
classList['24.242'] = true;
classList['14.442'] = true;
classList['6.541'] = true;
classList['15.356'] = true;
classList['22.055'] = true;
classList['10.551'] = true;
classList['9.520'] = true;
classList['15.358'] = true;
classList['4.264'] = true;
classList['1.261'] = true;
classList['21W.THG'] = true;
classList['15.769'] = true;
classList['10.557'] = true;
classList['WGS.301'] = true;
classList['1.265'] = true;
classList['1.060'] = true;
classList['15.764'] = true;
classList['STS.050'] = true;
classList['21A.114'] = true;
classList['21L.522'] = true;
classList['15.763'] = true;
classList['6.046'] = true;
classList['15.762'] = true;
classList['6.045'] = true;
classList['11.249'] = true;
classList['6.049'] = true;
classList['15.765'] = true;
classList['17.01'] = true;
classList['8.226'] = true;
classList['CMS.920'] = true;
classList['6.041'] = true;
classList['CMS.922'] = true;
}

function populateNameList() {
nameList['1.00'] = ' Intro Comp & Engr Prob Solving';
nameList['1.001'] = ' Intro Comp & Engr Prob Solving';
nameList['1.002'] = ' Intro Comp & Engr Prob Solving';
nameList['1.011'] = ' Project Evaluation';
nameList['1.016'] = ' Design for Envir Issues';
nameList['1.020'] = ' Ecol II: Engr Sustainability';
nameList['1.021'] = ' Intro to Modeling & Simulation';
nameList['1.036'] = ' Structural & Geotechnical Engr';
nameList['1.041'] = ' Transportation Systms Modeling';
nameList['1.053'] = ' Dynamics and Control I';
nameList['1.055'] = ' Steel Bridge Competition';
nameList['1.060'] = ' Engineering Mechanics II';
nameList['1.080'] = ' Environmental Chemistry';
nameList['1.081'] = ' Envir Cncr Rsk Prvntn Therapy';
nameList['1.083'] = ' Environmental Health';
nameList['1.138'] = ' Wave Propagation';
nameList['1.151'] = ' Probability & Stats in Eng';
nameList['1.202'] = ' Demand Modeling';
nameList['1.233'] = ' Air  Trans Operations Research';
nameList['1.251'] = ' Comparative Land Use';
nameList['1.253'] = ' Trsprtn Policy & Envir Limits';
nameList['1.254'] = ' Transport Modeling Course';
nameList['1.255'] = ' Transportation MEng Project';
nameList['1.258'] = ' Public Transportation Systems';
nameList['1.261'] = ' Logistics & Supply Chain Mgmt';
nameList['1.265'] = ' International Supp Chain Mgmt';
nameList['1.271'] = ' Theory of Operations Mgmt';
nameList['1.273'] = ' Supply Chain Planning';
nameList['1.274'] = ' Mfg Sys & Supply Chain Design';
nameList['1.284'] = ' Analyzing Regional Econ Change';
nameList['1.322'] = ' Soil Behavior';
nameList['1.34'] = ' Waste Containment & Remed Tech';
nameList['1.383'] = ' Underground Construction';
nameList['1.472'] = ' Innovative Project Delivery';
nameList['1.561'] = ' Motion-Based Design';
nameList['1.562'] = ' High-Performance Struct Proj';
nameList['1.570'] = ' Micromech & Durability: Solids';
nameList['1.58'] = ' Steel Bridge Competition';
nameList['1.582'] = ' Steel Structures';
nameList['1.714'] = ' Surface Hydrology';
nameList['1.723'] = ' Computational Methods';
nameList['1.76'] = ' Aquatic Chemistry';
nameList['1.77'] = ' Water Quality Control';
nameList['1.782'] = ' Envir Engr MEng Project';
nameList['1.813'] = ' Sustainability, Trade, & Envir';
nameList['1.851'] = ' Infrastructure: Dev Countries';
nameList['1.S978'] = ' Sp Grad Subj: Civ & Envir Engr';
nameList['1.S979'] = ' Sp Grad Subj: Civ & Envir Engr';
nameList['10.03'] = ' Advances in Biomanufacturing';
nameList['10.04'] = ' Philosophcal History of Energy';
nameList['10.10'] = ' Intro Chem Engineering';
nameList['10.213'] = ' Chem & Bio Engr Thermodynamics';
nameList['10.301'] = ' Fluid Mechanics';
nameList['10.32'] = ' Separation Processes';
nameList['10.333'] = ' Intro to Modeling & Simulation';
nameList['10.37'] = ' Chemical Kinetics & Reactors';
nameList['10.390'] = ' Fund of Adv Energy Conversion';
nameList['10.392'] = ' Fund of Adv Energy Conversion';
nameList['10.426'] = ' Electrochemical Energy Systems';
nameList['10.441'] = ' Molec & Engr Aspects Biotech';
nameList['10.450'] = ' Process Dynamics, Opers, Ctrl';
nameList['10.53'] = ' Advances in Biomanufacturing';
nameList['10.531'] = ' Macromolecular Hydrodynamics';
nameList['10.536'] = ' Therm Hydraulics:Power Tech';
nameList['10.542'] = ' Biochemical Engineering';
nameList['10.543'] = ' Protein Folding& Human Disease';
nameList['10.551'] = ' System Engineering';
nameList['10.557'] = ' Mixed-integer & Nonconvex Opt';
nameList['10.56'] = ' Advances in Surfactant Science';
nameList['10.569'] = ' Synthesis of Polymers';
nameList['10.606'] = ' Visual Strat for Sci & Engrs';
nameList['10.626'] = ' Electrochemical Energy Systems';
nameList['10.65'] = ' Chemical Reactor Engineering';
nameList['10.792'] = ' Global Oper Ldrship Sem';
nameList['10.807'] = ' Innovation Teams';
nameList['10.953'] = ' Sem: Heterogeneous Catalysis';
nameList['10.960'] = ' Seminar: Polymer Sci & Tech';
nameList['10.964'] = ' Sem on Transport Theory';
nameList['10.965'] = ' Sem in Biosystems Eng';
nameList['10.967'] = ' Sem: Protein-Polymer Matl Engr';
nameList['10.968'] = ' Seminar in Biomolecular Engir';
nameList['10.969'] = ' Molecular Engineering Seminar';
nameList['10.970'] = ' Sem: Molecular Computation';
nameList['10.971'] = ' Sem-Fl Mech & Trans Phen';
nameList['10.974'] = ' Seminar: Chem Engr Nanotech';
nameList['10.976'] = ' Process Design, Oper, Control';
nameList['10.981'] = ' Sem: Colloid Interface Science';
nameList['10.982'] = ' Sem:Exp Colloid & Surface Chem';
nameList['10.983'] = ' React Proc & Microfab Chem Sys';
nameList['10.984'] = ' Biomed Applications: Chem Eng';
nameList['10.985'] = ' Sem: Materials Systems Engr';
nameList['10.987'] = ' Solid Thin Films & Interfaces';
nameList['10.989'] = ' Seminar in Biotechnology';
nameList['10.992'] = ' Seminar in Chemical Engr';
nameList['10.994'] = ' Molecular Bioengineering';
nameList['10.995'] = ' Cellular and Metabolic Engr';
nameList['10.996'] = ' Seminar: Cellular Engineering';
nameList['10.997'] = ' Seminar: Immunology';
nameList['10.998'] = ' Sem: Crystallization Science';
nameList['10.S95'] = ' Special Problems in Chem Engr';
nameList['11.003'] = ' Methods of Policy Analysis';
nameList['11.005'] = ' Intro to International Dev';
nameList['11.011'] = ' Art & Science of Negotiation';
nameList['11.013'] = ' American Urban History I';
nameList['11.016'] = ' The City';
nameList['11.026'] = ' Downtown';
nameList['11.027'] = ' City to City';
nameList['11.123'] = ' Big Plans Mega-Urbn Landscapes';
nameList['11.125'] = ' Evaluating Education';
nameList['11.126'] = ' Economics of Education';
nameList['11.127'] = ' Computer Games';
nameList['11.131'] = ' Education Theory & Prctice III';
nameList['11.147'] = ' Urban Public Finance';
nameList['11.153'] = ' Shanghai 1840 to Present';
nameList['11.161'] = ' Enrgy Decisns, Mkts & Policies';
nameList['11.162'] = ' Energy & Environment Politics';
nameList['11.166'] = ' Law Social Mvmnts & Public Pol';
nameList['11.220'] = ' Quant Reasoning & Stat Methods';
nameList['11.234'] = ' Qualit Meth:Designrs & Plannrs';
nameList['11.249'] = ' Economics of Education';
nameList['11.252'] = ' Computer Games';
nameList['11.255'] = ' Neg & Dispute Res: Pub Sector';
nameList['11.302'] = ' Urban Design Politics';
nameList['11.303'] = ' RE Dev Studio: Urban Projects';
nameList['11.306'] = ' Planning Studio';
nameList['11.316'] = ' Landscp & Urb Heritage Conserv';
nameList['11.320'] = ' Digital City Design Workshop';
nameList['11.330'] = ' Theory of City Form';
nameList['11.332'] = ' Urban Design Studio';
nameList['11.333'] = ' Urban Design Seminar';
nameList['11.334'] = ' Adv Sem: Landscape + Urbanism';
nameList['11.337'] = ' Urban Design Ideals & Action';
nameList['11.338'] = ' Urban Design Studio';
nameList['11.339'] = ' Downtown';
nameList['11.344'] = ' Innovative Project Delivery';
nameList['11.352'] = ' Real Estate Ventures II';
nameList['11.367'] = ' The Law & Politics of Land Use';
nameList['11.369'] = ' Energy Policy';
nameList['11.378'] = ' Water Reading Group';
nameList['11.432'] = ' Real Estate Capital';
nameList['11.434'] = ' RE Dev: Tools for Analysis';
nameList['11.436'] = ' Housing Studio: Sustainability';
nameList['11.438'] = ' Economic Development Planning';
nameList['11.466'] = ' Sustainability, Trade, & Envir';
nameList['11.469'] = ' Urban Sociology';
nameList['11.474'] = ' D-Lab:Disseminating Innovation';
nameList['11.479'] = ' Infrastructure: Dev Countries';
nameList['11.481'] = ' Analyzing Regional Econ Change';
nameList['11.484'] = ' Proj Appraisal: Dev Countries';
nameList['11.487'] = ' Public Finance: Dev Countries';
nameList['11.496'] = ' Law Social Mvmnts & Public Pol';
nameList['11.526'] = ' Comparative Land Use';
nameList['11.541'] = ' Public Transportation Systems';
nameList['11.543'] = ' Trsprtn Policy & Envir Limits';
nameList['11.800'] = ' Doctoral Research Paper';
nameList['11.910'] = ' Doctoral Tutorial';
nameList['11.S195'] = ' Spec Subj Urban Studies & Plan';
nameList['11.S196'] = ' Spec Subj Urban Studies & Plan';
nameList['11.S940'] = ' Spec Subj Urban Studies & Plan';
nameList['11.S941'] = ' Spec Subj Urban Studies & Plan';
nameList['11.S942'] = ' Spec Subj Urban Studies & Plan';
nameList['11.S943'] = ' Spec Subj Urban Studies & Plan';
nameList['11.S944'] = ' Spec Subj Urban Studies & Plan';
nameList['11.S946'] = ' Spec Subj Urban Studies & Plan';
nameList['11.S948'] = ' Spec Subj Urban Studies & Plan';
nameList['11.S949'] = ' Spec Subj Urban Studies & Plan';
nameList['11.S958'] = ' Spec Sem Urban Studies & Plan';
nameList['11.S965'] = ' Special Subject: Real Estate';
nameList['11.THG'] = ' Thesis';
nameList['12.007'] = ' Geobiology';
nameList['12.009'] = ' Theoretical Envir Analysis';
nameList['12.011'] = ' Archaeological Science';
nameList['12.080'] = ' EAPS Undergraduate Seminar';
nameList['12.115'] = ' Field Geology II';
nameList['12.207'] = ' Nonlinr Dynmic II:Cntinuum Sys';
nameList['12.333'] = ' Atmospheric Dynamics';
nameList['12.340'] = ' Global Warming Science';
nameList['12.400'] = ' The Solar System';
nameList['12.402'] = ' Intro to Astronomy';
nameList['12.409'] = ' Hands-On Astronomy';
nameList['12.420'] = ' Physics & Chem of Solar System';
nameList['12.431'] = ' Space Systems Development';
nameList['12.482'] = ' Advanced Field Geology II';
nameList['12.510'] = ' Introduction to Seismology';
nameList['12.540'] = ' Prncp: Global Positioning Sys';
nameList['12.591'] = ' Advanced Seminar in Geophysics';
nameList['12.601'] = ' Essentials: Planetary Science';
nameList['12.603'] = ' Solar System Dynamics';
nameList['12.740'] = ' Paleoceanography';
nameList['12.801'] = ' General Circulation of Ocean';
nameList['12.802'] = ' Wave Motions: Ocean & Atmos';
nameList['12.810'] = ' Dynamics of the Atmosphere';
nameList['12.820'] = ' Turbulence in Ocean and Atmos';
nameList['12.844'] = ' Modeling & Assessment for Pol';
nameList['12.870'] = ' Air-Sea Interaction';
nameList['12.980'] = ' Current Research: Meteorology';
nameList['12.S990'] = ' Special Subject: Meteorology';
nameList['14.003'] = ' Microecon Theory & Public Pol';
nameList['14.03'] = ' Microecon Theory & Public Pol';
nameList['14.05'] = ' Intermed Applied Macroecnomics';
nameList['14.123'] = ' Microeconomic Theory III';
nameList['14.124'] = ' Microeconomic Theory IV';
nameList['14.126'] = ' Game Theory';
nameList['14.137'] = ' Psychology and Economics';
nameList['14.19'] = ' Market Design';
nameList['14.21'] = ' Health Economics';
nameList['14.26'] = ' Economics of Incentives';
nameList['14.272'] = ' Industrial Organization II';
nameList['14.273'] = ' Adv Topics in Industrial Org';
nameList['14.283'] = ' Adv Top: Organizational Econ I';
nameList['14.284'] = ' Adv Top: Organizationl Econ II';
nameList['14.32'] = ' Econometrics';
nameList['14.33'] = ' Research & Comm in Economics';
nameList['14.382'] = ' Econometrics';
nameList['14.386'] = ' New Econometric Methods';
nameList['14.43'] = ' Enrgy Decisns, Mkts & Policies';
nameList['14.44'] = ' Energy Economics & Policy';
nameList['14.441'] = ' Advance Financial Economics II';
nameList['14.442'] = ' Advanced Financial Econ III';
nameList['14.444'] = ' Energy Economics & Policy';
nameList['14.453'] = ' Econmic Fluctuations';
nameList['14.454'] = ' Economic Crises';
nameList['14.462'] = ' Advanced Macroeconomics II';
nameList['14.471'] = ' Public Economics I';
nameList['14.48'] = ' Economics of Education';
nameList['14.51'] = ' Urban and Regional Economics';
nameList['14.573'] = ' Urban and Regional Economics';
nameList['14.582'] = ' International Economics II';
nameList['14.662'] = ' Labor Economics II';
nameList['14.70'] = ' Medieval Econ Hist Compar Pers';
nameList['14.75'] = ' Political Economy & Econ  Dev';
nameList['14.772'] = ' Dev Economics: Macro Issues';
nameList['14.773'] = ' Political Econ: Insts & Dev';
nameList['15.025'] = ' Game Theory for Strat Advtg';
nameList['15.031'] = ' Enrgy Decisns, Mkts & Policies';
nameList['15.032'] = ' Eng Econ & Reg: Electric Power';
nameList['15.037'] = ' Energy Economics & Policy';
nameList['15.038'] = ' Energy Economics & Policy';
nameList['15.053'] = ' Optimzn Methods in Mgmt Sci';
nameList['15.058'] = ' Optimzn Meth in Ops Research';
nameList['15.070'] = ' Adv Stochastic Processes';
nameList['15.071'] = ' The Analytical Edge';
nameList['15.074'] = ' Stat Reasoning & Data Modeling';
nameList['15.077'] = ' Stat Learning & Data Mining';
nameList['15.078'] = ' Models for Socio-Tech Sys';
nameList['15.084'] = ' Nonlinear Programming';
nameList['15.097'] = ' Seminar Ops Rsrch & Statistics';
nameList['15.099'] = ' Seminar in Operations Research';
nameList['15.122'] = ' Critical Assessmnt Biomed Info';
nameList['15.123'] = ' Dynamics of Biomed Tech';
nameList['15.137'] = ' Drug Safety Issues';
nameList['15.141'] = ' Econ Health Care Industries';
nameList['15.229'] = ' Sem: International Management';
nameList['15.268'] = ' Choice Pts: Power & Respons';
nameList['15.270'] = ' Ethical Practice';
nameList['15.279'] = ' Management Communication';
nameList['15.317'] = ' Organizatnl Leadershp & Change';
nameList['15.318'] = ' Leadership & Change in Organiz';
nameList['15.326'] = ' Seminar in Leadership II';
nameList['15.349'] = ' Qualitative Research Methods';
nameList['15.356'] = ' Devel Breakthru Products Svcs';
nameList['15.358'] = ' Bus of Software& Dig Platforms';
nameList['15.363'] = ' Strat Dec Mkg in Life Sci';
nameList['15.371'] = ' Innovation Teams';
nameList['15.376'] = ' Digitial Innovations';
nameList['15.386'] = ' Managing in Adversity';
nameList['15.387'] = ' Tech Sales and Mgmt';
nameList['15.396'] = ' Seminar in Entrepreneurship';
nameList['15.398'] = ' The CEO Perspective';
nameList['15.399'] = ' Entrepreneurship Lab';
nameList['15.419'] = ' Prac of Finance:Private Equity';
nameList['15.423'] = ' Advanced Corp Risk Mgmt';
nameList['15.427'] = ' Real Estate Capital';
nameList['15.428'] = ' RE Dev: Tools for Analysis';
nameList['15.433'] = ' Investments';
nameList['15.434'] = ' Advanced Corporate Finance';
nameList['15.438'] = ' Fixed Income';
nameList['15.441'] = ' Advance Financial Economics II';
nameList['15.442'] = ' Advanced Financial Econ III';
nameList['15.451'] = ' Prosem: Financial Engineering';
nameList['15.460'] = ' Analytics of Finance II';
nameList['15.539'] = ' Doctoral Seminar in Accounting';
nameList['15.565'] = ' Evolution to Web & Mgmt 3.0';
nameList['15.571'] = ' Business Strategy & Role of IT';
nameList['15.575'] = ' Econ of IT in Markets and Org';
nameList['15.615'] = ' Basic Bus Law: Entrprnr & Mgr';
nameList['15.617'] = ' Business Law and Finance';
nameList['15.628'] = ' Patent,Copy, & Law Intell Prop';
nameList['15.649'] = ' Seminar in Law';
nameList['15.655'] = ' Law, Technology, & Pub Policy';
nameList['15.657'] = ' Sustainability, Trade, & Envir';
nameList['15.668'] = ' People and Organizations';
nameList['15.676'] = ' Work, Employ, Ind Rels Theory';
nameList['15.762'] = ' Supply Chain Planning';
nameList['15.763'] = ' Mfg Sys & Supply Chain Design';
nameList['15.764'] = ' Theory of Operations Mgmt';
nameList['15.765'] = ' International Supp Chain Mgmt';
nameList['15.769'] = ' Operations Strategy';
nameList['15.771'] = ' Logistics & Supply Chain Mgmt';
nameList['15.792'] = ' Global Oper Ldrship Sem';
nameList['15.799'] = ' Workshop in Operations Mgt';
nameList['15.828'] = ' Design and Mktg New Products';
nameList['15.839'] = ' Workshop in Marketing';
nameList['15.840'] = ' Seminar in Marketing';
nameList['15.878'] = ' Capstone Sem in Sustainability';
nameList['15.879'] = ' Rsrch Sem in System Dynamics';
nameList['15.905'] = ' Technology Strategy  for SDM';
nameList['15.913'] = ' Strategies Sustainble Business';
nameList['15.914'] = ' Comptitive Dynamics & Strategy';
nameList['15.915'] = ' Lab for Sustainable Business';
nameList['15.S01'] = ' Special Seminar in Management';
nameList['15.S02'] = ' Special Seminar in Management';
nameList['15.S03'] = ' Special Seminar in Management';
nameList['15.S06'] = ' Special Seminar in Management';
nameList['15.S07'] = ' Special Seminar in Management';
nameList['15.S08'] = ' Special Seminar in Management';
nameList['15.S09'] = ' Special Seminar in Management';
nameList['15.S10'] = ' Special Seminar in Management';
nameList['15.S11'] = ' Special Seminar in Management';
nameList['15.S12'] = ' Special Seminar in Management';
nameList['15.S13'] = ' Special Seminar in Management';
nameList['15.S14'] = ' Special Seminar in Management';
nameList['15.S15'] = ' Special Seminar in Management';
nameList['15.S16'] = ' Special Seminar in Management';
nameList['15.S20'] = ' Special Seminar in Management';
nameList['15.S21'] = ' Special Seminar in Management';
nameList['15.S23'] = ' Special Seminar in Management';
nameList['15.S24'] = ' Special Seminar in Management';
nameList['15.S25'] = ' Special Seminar in Management';
nameList['15.S26'] = ' Special Seminar in Management';
nameList['15.S30'] = ' Sp Distance Learning Sem: Mgmt';
nameList['15.S42'] = ' Special Seminar in Management';
nameList['16.00'] = ' Intro to Aerospace Design';
nameList['16.003'] = ' Unified Engineering III';
nameList['16.09'] = ' Statistics and Probability';
nameList['16.20'] = ' Structural Mechanics';
nameList['16.230'] = ' Plates & Shells';
nameList['16.323'] = ' Principles of Optimal Control';
nameList['16.333'] = ' Aircraft Stability & Control';
nameList['16.338'] = ' Dynamic Systems and Control';
nameList['16.346'] = ' Astrodynamics';
nameList['16.36'] = ' Communication Sys & Networks';
nameList['16.430'] = ' Sensory-Neural Systems';
nameList['16.459'] = ' Bioengineering Journal Seminar';
nameList['16.470'] = ' Statistical Methods';
nameList['16.50'] = ' Intro to Propulsion Systems';
nameList['16.522'] = ' Space Propulsion';
nameList['16.540'] = ' Internal Flows: Turbomachines';
nameList['16.64'] = ' Flight Measurement Lab';
nameList['16.68'] = ' Modern Space Science & Engr';
nameList['16.687'] = ' Selected Topics Aero & Astro';
nameList['16.763'] = ' Air  Trans Operations Research';
nameList['16.82'] = ' Flight Vehicle Engineering';
nameList['16.831'] = ' Space Systems Development';
nameList['16.855'] = ' Enterprise Architecting';
nameList['16.863'] = ' System Safety';
nameList['16.888'] = ' Multidscply Sys Dsgn Optmztn';
nameList['16.89'] = ' Space Systems Engineering';
nameList['16.891'] = ' Space Policy Seminar';
nameList['16.90'] = ' Computatnl Methods: Aero Engr';
nameList['16.940'] = ' Num Methods for Stoch Modeling';
nameList['16.985'] = ' Global Oper Ldrship Sem';
nameList['16.S498'] = ' Adv Sp Subj:Humans & Automatn';
nameList['16.S949'] = ' Adv Spec Subj in Computation';
nameList['17.006'] = ' Feminist Thought';
nameList['17.007'] = ' Feminist  PoliticalThought';
nameList['17.01'] = ' Justice';
nameList['17.021'] = ' Philosophy of Law';
nameList['17.115'] = ' International Political Econ';
nameList['17.178'] = ' Institutions and Development';
nameList['17.181'] = ' Sustainability';
nameList['17.182'] = ' Sustainability';
nameList['17.202'] = ' American Politics II';
nameList['17.28'] = ' US Poitics& Society in Wartime';
nameList['17.303'] = ' Methods of Policy Analysis';
nameList['17.317'] = ' US Social Policy';
nameList['17.33'] = ' Building a Better World';
nameList['17.398'] = ' Energy Policy';
nameList['17.407'] = ' Chinese Foreign Policy';
nameList['17.42'] = ' Causes & Prevention of War';
nameList['17.482'] = ' US Military Power';
nameList['17.483'] = ' US Military Power';
nameList['17.50'] = ' Intro to Comparative Politics';
nameList['17.523'] = ' Ethnic Conflict World Politics';
nameList['17.55'] = ' Intro to Latin Amer Studies';
nameList['17.551'] = ' Pol Economy of Chinese Reform';
nameList['17.552'] = ' Pol Economy of Chinese Reform';
nameList['17.565'] = ' Israel: Culture & Identity';
nameList['17.57'] = ' Soviet & Post-Soviet Pol & Soc';
nameList['17.572'] = ' African Politics';
nameList['17.581'] = ' Riots, Rebellions, Revolutions';
nameList['17.584'] = ' Civil-Military Relations';
nameList['17.802'] = ' Quantitative Resrch Methods II';
nameList['17.871'] = ' Political Science Laboratory';
nameList['17.955'] = ' Reading Seminar in Soc Science';
nameList['17.962'] = ' Second Year Paper';
nameList['17.S914'] = ' Spec Subj in Political Science';
nameList['17.S918'] = ' Spec Subj in Political Science';
nameList['17.S919'] = ' Spec Subj in Political Science';
nameList['17.S950'] = ' Spec Subj in Political Science';
nameList['17.S952'] = ' Spec Subj in Political Science';
nameList['17.S953'] = ' Spec Subj in Political Science';
nameList['18.01'] = ' Calculus';
nameList['18.02'] = ' Calculus';
nameList['18.024'] = ' Calculus with Theory';
nameList['18.02A'] = ' Calculus';
nameList['18.034'] = ' Differential Equations';
nameList['18.04'] = ' Complex Variables with Appl';
nameList['18.05'] = ' Intro Probability & Statistics';
nameList['18.06'] = ' Linear Algebra';
nameList['18.075'] = ' Methods: Scientists Engineers';
nameList['18.085'] = ' Computational Science & Engr I';
nameList['18.086'] = ' Computational Sci & Engr II';
nameList['18.100A'] = ' Real Analysis';
nameList['18.100B'] = ' Real Analysis';
nameList['18.100C'] = ' Real Analysis';
nameList['18.102'] = ' Intro to Functional Analysis';
nameList['18.104'] = ' Seminar in Analysis';
nameList['18.156'] = ' Differential Analysis';
nameList['18.157'] = ' Microlocal Analysis';
nameList['18.175'] = ' Theory of Probability';
nameList['18.276'] = ' Math Methods in Physics';
nameList['18.304'] = ' Ugrad Seminar in Discrete Math';
nameList['18.306'] = ' Advanced PDE with Applications';
nameList['18.310'] = ' Principles of Applied Math';
nameList['18.311'] = ' Principles of Applied Math';
nameList['18.312'] = ' Algebraic Combinatorics';
nameList['18.318'] = ' Topics in Combinatorics';
nameList['18.330'] = ' Intro to Numerical Analysis';
nameList['18.336'] = ' Fast Methods:Part Diff Eq';
nameList['18.338'] = ' Eigenvalues of Random Matrices';
nameList['18.354'] = ' Nonlinr Dynmic II:Cntinuum Sys';
nameList['18.369'] = ' Methods in Nanophotonics';
nameList['18.376'] = ' Wave Propagation';
nameList['18.400'] = ' Automata, Comput, & Complexity';
nameList['18.410'] = ' Design and Analysis Algorithms';
nameList['18.418'] = ' Topics:Computatn Molecular Bio';
nameList['18.424'] = ' Seminar in Information Theory';
nameList['18.425'] = ' Cryptography & Cryptanalysis';
nameList['18.436'] = ' Quantum Information Science';
nameList['18.438'] = ' Adv Combinatorial Optimization';
nameList['18.440'] = ' Probability & Random Variables';
nameList['18.443'] = ' Statistics for Applications';
nameList['18.702'] = ' Algebra II';
nameList['18.704'] = ' Seminar in Algebra';
nameList['18.706'] = ' Noncommutative Algebra';
nameList['18.726'] = ' Algebraic Geometry II';
nameList['18.745'] = ' Introduction to Lie Algebras';
nameList['18.747'] = ' Infinite-Dimens Lie Algebras';
nameList['18.781'] = ' Theory of Numbers';
nameList['18.783'] = ' Elliptic Curves';
nameList['18.784'] = ' Seminar in Number Theory';
nameList['18.785'] = ' Analytic Number Theory';
nameList['18.821'] = ' Project Lab in Mathematics';
nameList['18.901'] = ' Introduction to Topology';
nameList['18.904'] = ' Seminar in Topology';
nameList['18.906'] = ' Algebraic Topology II';
nameList['18.917'] = ' Topics in Algebraic Topology';
nameList['18.950'] = ' Differential Geometry';
nameList['18.952'] = ' Theory of Differential Forms';
nameList['18.966'] = ' Geometry of Manifolds';
nameList['18.994'] = ' Seminar in Geometry';
nameList['18.S995'] = ' Special Subject: Mathematics';
nameList['2.001'] = ' Mechanics and Materials I';
nameList['2.003'] = ' Dynamics and Control I';
nameList['2.005'] = ' Thermal-Fluids Engineering I';
nameList['2.006'] = ' Thermal-Fluids Engineering II';
nameList['2.062'] = ' Wave Propagation';
nameList['2.065'] = ' Acoustics and Sensing';
nameList['2.066'] = ' Acoustics and Sensing';
nameList['2.071'] = ' Mechanics of Solid Materials';
nameList['2.081'] = ' Plates & Shells';
nameList['2.082'] = ' Ship Structural Analysis & Des';
nameList['2.085'] = ' Structural Impact';
nameList['2.14'] = ' Analysis & Design Fdbk Ctrl';
nameList['2.140'] = ' Analysis & Design Fdbk Ctrl';
nameList['2.160'] = ' Identification, Estim, & Learn';
nameList['2.18'] = ' Biomolecular Feedback Systems';
nameList['2.180'] = ' Biomolecular Feedback Systems';
nameList['2.183'] = ' Neural Control of Movement';
nameList['2.184'] = ' Neural Control of Movement';
nameList['2.22'] = ' Des Principles: Ocean Vehicles';
nameList['2.23'] = ' Hydrofoils & Propellers';
nameList['2.341'] = ' Macromolecular Hydrodynamics';
nameList['2.37'] = ' Fundamentals Nanoengineering';
nameList['2.370'] = ' Fundamentals Nanoengineering';
nameList['2.374'] = ' Design and Fabrication of MEMS';
nameList['2.391'] = ' Nanostructure Fabrication';
nameList['2.55'] = ' Advanced Heat & Mass Transfer';
nameList['2.57'] = ' Nano-Macro Transport Process';
nameList['2.570'] = ' Nano-Macro Transport Process';
nameList['2.59'] = ' Therm Hydraulics:Power Tech';
nameList['2.60'] = ' Fund of Adv Energy Conversion';
nameList['2.61'] = ' Internal Combustion Engines';
nameList['2.62'] = ' Fund of Adv Energy Conversion';
nameList['2.67'] = ' Analysis & Des: HVAC Systems';
nameList['2.682'] = ' Acoustical Oceanography';
nameList['2.702'] = ' Sys Engr & Naval Ship Design';
nameList['2.704'] = ' Naval Ship Conversion Design';
nameList['2.705'] = ' New Naval Ship Design';
nameList['2.71'] = ' Optics';
nameList['2.710'] = ' Optics';
nameList['2.722'] = ' D-Lab: Design';
nameList['2.744'] = ' Product Design';
nameList['2.752'] = ' Developing Mechanical Products';
nameList['2.753'] = ' Developing Mechanical Products';
nameList['2.782'] = ' Design Med Devices & Implants';
nameList['2.785'] = ' Cell-Matrix Mechanics';
nameList['2.792'] = ' Quant  Systems Physiology';
nameList['2.793'] = ' Fields, Forces and Flows';
nameList['2.797'] = ' Molec, Cell, & Tissue Biomechs';
nameList['2.813'] = ' Energy, Materials & Mfg';
nameList['2.83'] = ' Energy, Materials & Mfg';
nameList['2.830'] = ' Control of Manufacturing Proc';
nameList['2.888'] = ' Global Mfg & Entrepreneurship';
nameList['2.890'] = ' Global Oper Ldrship Sem';
nameList['2.965'] = ' International Supp Chain Mgmt';
nameList['2.997'] = ' Advanced Topics in Mech Engr';
nameList['2.998'] = ' Advanced Topics in Mech Engr';
nameList['2.S997'] = ' Spec Subj: Mechanical Engr';
nameList['20.104'] = ' Envir Cncr Rsk Prvntn Therapy';
nameList['20.111'] = ' Phys Chem Biomolecular Systems';
nameList['20.200'] = ' Biological Engineering Seminar';
nameList['20.310'] = ' Molec, Cell, & Tissue Biomechs';
nameList['20.330'] = ' Fields, Forces and Flows';
nameList['20.345'] = ' Bioinstrumentation Project Lab';
nameList['20.361'] = ' Molec & Engr Aspects Biotech';
nameList['20.371'] = ' Quant  Systems Physiology';
nameList['20.380'] = ' Biological Engineering Design';
nameList['20.411'] = ' Cell-Matrix Mechanics';
nameList['20.415'] = ' Physical Biology';
nameList['20.440'] = ' Biological Networks';
nameList['20.451'] = ' Design Med Devices & Implants';
nameList['20.486'] = ' Drug Safety Issues';
nameList['20.S952'] = ' Spec Subj in Biological Engr';
nameList['21A.100'] = ' Intro to Anthropology';
nameList['21A.114'] = ' Intro to Black Studies';
nameList['21A.215'] = ' Disease and Health';
nameList['21A.218'] = ' Identity and Difference';
nameList['21A.225'] = ' Violence, Human Rghts, Justice';
nameList['21A.228'] = ' Global Health & Development';
nameList['21A.229'] = ' Disability Local Global';
nameList['21A.341'] = ' Enrgy Decisns, Mkts & Policies';
nameList['21A.342'] = ' Environmental Struggles';
nameList['21A.430'] = ' Intro to Latin Amer Studies';
nameList['21A.512'] = ' Sem in Ethnography & Fieldwork';
nameList['21A.760'] = ' Qualitative Research Methods';
nameList['21F.011'] = ' Topics Indian Popular Culture';
nameList['21F.019'] = ' Communicating Across Cultures';
nameList['21F.021'] = ' Communicating Across Cultures';
nameList['21F.022'] = ' International Womens Voices';
nameList['21F.027'] = ' Asia in the Modern World';
nameList['21F.029'] = ' Identity in Asian American Lit';
nameList['21F.040'] = ' Intro Modern Indian Cult & Soc';
nameList['21F.046'] = ' Modern Chinese Fiction & Film';
nameList['21F.064'] = ' Intro to Japanese Culture';
nameList['21F.068'] = ' Invention of French Theory';
nameList['21F.069'] = ' Race & Gender in Asian America';
nameList['21F.074'] = ' Portuguese Popular Culture';
nameList['21F.075'] = ' Chinese Migration 1567-Present';
nameList['21F.084'] = ' Intro to Latin Amer Studies';
nameList['21F.106'] = ' Chinese VI (Regular)';
nameList['21F.142'] = ' Interm Chinese I: Fast Track';
nameList['21F.143'] = ' Interm Chinese II: Fast Track';
nameList['21F.162'] = ' Interm Chinese I: Fast Track';
nameList['21F.163'] = ' Interm Chinese II: Fast Track';
nameList['21F.192'] = ' Modern Chinese Fiction & Film';
nameList['21F.199'] = ' Chinese Youths & Web Culture';
nameList['21F.219'] = ' Wkshp Written Expression: ELS';
nameList['21F.220'] = ' Wkshp Written Expression: ELS';
nameList['21F.222'] = ' Exposit Writg Bilingual Studnt';
nameList['21F.223'] = ' Listeng Spkng Pronunciatn ELS';
nameList['21F.224'] = ' Listeng Spkng Pronunciatn ELS';
nameList['21F.232'] = ' Adv Spkng & Critcl Listeng ELS';
nameList['21F.233'] = ' Adv Spkng & Critcl Listeng ELS';
nameList['21F.310'] = ' French Conversation';
nameList['21F.312'] = ' Basic Themes French Lit & Cult';
nameList['21F.346'] = ' Modern French Lit & Culture';
nameList['21F.401'] = ' German I';
nameList['21F.410'] = ' Prof Communication in German';
nameList['21F.416'] = ' 20th & 21st Century German Lit';
nameList['21F.451'] = ' German I';
nameList['21F.555'] = ' Interm Japanese I:  Fast Track';
nameList['21F.556'] = ' Interm Japanese II: Fast Track';
nameList['21F.562'] = ' Interm Japanese I:  Fast Track';
nameList['21F.563'] = ' Interm Japanese II: Fast Track';
nameList['21F.590'] = ' Asia in the Modern World';
nameList['21F.592'] = ' Intro to Japanese Culture';
nameList['21F.711'] = ' Adv Spanish Conv & Composition';
nameList['21F.713'] = ' Adv Communication Spanish';
nameList['21F.716'] = ' Contemp Hispanic Lit & Film';
nameList['21F.740'] = ' The New Spain: 1977-Present';
nameList['21F.802'] = ' Portuguese II';
nameList['21F.804'] = ' Portuguese IV';
nameList['21F.820'] = ' Portuguese Lit and Culture';
nameList['21F.852'] = ' Portuguese II';
nameList['21H.102'] = ' America Since 1865';
nameList['21H.106'] = ' Intro to Black Studies';
nameList['21H.132'] = ' The Ancient World: Rome';
nameList['21H.133'] = ' The Medieval World';
nameList['21H.134'] = ' Medieval Econ Hist Compar Pers';
nameList['21H.142'] = ' Age of Reason: Europe';
nameList['21H.152'] = ' Modern China';
nameList['21H.155'] = ' Modern Japan';
nameList['21H.161'] = ' Middle East in 20th Century';
nameList['21H.185'] = ' Intro to Environmental History';
nameList['21H.209'] = ' America in Depression and War';
nameList['21H.211'] = ' US in the Nuclear Age';
nameList['21H.213'] = ' US Poitics& Society in Wartime';
nameList['21H.217'] = ' American Urban History I';
nameList['21H.236'] = ' Making of a Roman Emperor';
nameList['21H.245'] = ' Soviet & Post-Soviet Pol & Soc';
nameList['21H.250'] = ' Asia in the Modern World';
nameList['21H.253'] = ' Chinese Migration 1567-Present';
nameList['21H.312'] = ' Race & Gender in Asian America';
nameList['21H.321'] = ' Downtown';
nameList['21H.333'] = ' Early Christianity';
nameList['21H.351'] = ' Shanghai 1840 to Present';
nameList['21H.365'] = ' Cultural Pluralism Middle East';
nameList['21H.390'] = ' Seminar in Historical Methods';
nameList['21H.981'] = ' Nature, Environment, Empire';
nameList['21L.000'] = ' Writing About Literature';
nameList['21L.002'] = ' Foundations of Western Cult II';
nameList['21L.005'] = ' Introduction to Drama';
nameList['21L.006'] = ' American Literature';
nameList['21L.007'] = ' World Literatures';
nameList['21L.008'] = ' Intro to Black Studies';
nameList['21L.009'] = ' Shakespeare';
nameList['21L.029'] = ' Identity in Asian American Lit';
nameList['21L.310'] = ' Bestsellers';
nameList['21L.315'] = ' Prizewinners';
nameList['21L.325'] = ' Small Wonders';
nameList['21L.421'] = ' Comedy';
nameList['21L.422'] = ' Tragedy';
nameList['21L.430'] = ' Popular Culture and Narrative';
nameList['21L.434'] = ' Science Fiction';
nameList['21L.448'] = ' Darwin and Design';
nameList['21L.451'] = ' Intro to Literary Theory';
nameList['21L.460'] = ' Medieval Literature';
nameList['21L.471'] = ' Major English Novels';
nameList['21L.473'] = ' Jane Austen';
nameList['21L.487'] = ' Modern Poetry';
nameList['21L.488'] = ' Contemporary Literature';
nameList['21L.501'] = ' The American Novel';
nameList['21L.522'] = ' International Womens Voices';
nameList['21L.640'] = ' The New Spain: 1977-Present';
nameList['21L.702'] = ' Studies in Fiction';
nameList['21L.703'] = ' Studies in Drama';
nameList['21L.705'] = ' Major Authors';
nameList['21L.706'] = ' Studies in Film';
nameList['21L.715'] = ' Media in Cultural Context';
nameList['21M.011'] = ' Introduction to Western Music';
nameList['21M.065'] = ' Intro to Musical Composition';
nameList['21M.215'] = ' American Music';
nameList['21M.226'] = ' Jazz';
nameList['21M.250'] = ' Beethoven to Mahler';
nameList['21M.260'] = ' Stravinsky to the Present';
nameList['21M.269'] = ' Western Music History';
nameList['21M.273'] = ' Opera: 1607 - Present';
nameList['21M.294'] = ' Popular Musics of the World';
nameList['21M.340'] = ' Jazz Harmony and Arranging';
nameList['21M.350'] = ' Musical Analysis';
nameList['21M.351'] = ' Music Composition';
nameList['21M.380'] = ' Music and Technology';
nameList['21M.401'] = ' MIT Concert Choir';
nameList['21M.405'] = ' MIT Chamber Chorus';
nameList['21M.410'] = ' Vocal Repertoire & Performance';
nameList['21M.421'] = ' MIT Symphony';
nameList['21M.423'] = ' Conducting and Score-Reading';
nameList['21M.426'] = ' MIT Wind Ensemble';
nameList['21M.442'] = ' Festival Jazz Ensemble';
nameList['21M.445'] = ' Chamber Music Society';
nameList['21M.450'] = ' MIT Balinese Gamelan';
nameList['21M.451'] = ' Studio Accompanying: Pianists';
nameList['21M.460'] = ' MIT Senegalese Drum Ensemble';
nameList['21M.505'] = ' Music Composition';
nameList['21M.515'] = ' Vocal Repertoire & Performance';
nameList['21M.581'] = ' Projects in Media and Music';
nameList['21M.604'] = ' Playwriting I';
nameList['21M.606'] = ' Intro to Stagecraft';
nameList['21M.705'] = ' The Actor and the Text';
nameList['21M.715'] = ' Topics in Theater Arts';
nameList['21M.735'] = ' Design for the Theater';
nameList['21M.785'] = ' Playwrights Workshop';
nameList['21M.789'] = ' Playwrights Workshop';
nameList['21W.011'] = ' Writing and Rhetoric';
nameList['21W.031'] = ' Science Writing and New Media';
nameList['21W.035'] = ' Science Writing and New Media';
nameList['21W.041'] = ' Writing About Literature';
nameList['21W.735'] = ' Writing & Reading the Essay';
nameList['21W.739'] = ' Darwin and Design';
nameList['21W.741'] = ' Intro to Black Studies';
nameList['21W.742'] = ' Writing about Race';
nameList['21W.745'] = ' Advanced Essay Workshop';
nameList['21W.746'] = ' Humanistic Persp on Medicine';
nameList['21W.749'] = ' Doc Photography & Journalism';
nameList['21W.752'] = ' Making Documentary';
nameList['21W.754'] = ' Playwriting I';
nameList['21W.755'] = ' Writng & Reading Short Stories';
nameList['21W.757'] = ' Fiction Workshop';
nameList['21W.762'] = ' Poetry Workshop';
nameList['21W.764'] = ' The Word Made Digital';
nameList['21W.767'] = ' Writing for Videogames';
nameList['21W.768'] = ' Soc & Culture of Digital Games';
nameList['21W.769'] = ' Playwrights Workshop';
nameList['21W.771'] = ' Advanced Poetry Workshop';
nameList['21W.777'] = ' The Science Essay';
nameList['21W.785'] = ' Communicating: Web-Based Media';
nameList['21W.789'] = ' Communicating with Mobile Tech';
nameList['21W.790'] = ' Short Documentary';
nameList['21W.824'] = ' Advanced Science Documentary';
nameList['21W.826'] = ' Adv Science Writing Seminar II';
nameList['21W.890'] = ' Short Documentary';
nameList['21W.THG'] = ' Graduate Thesis';
nameList['22.00'] = ' Intro to Modeling & Simulation';
nameList['22.012'] = ' Seminar in Fusion &Plasma Phys';
nameList['22.02'] = ' Intro to Appl Nuclear Physics';
nameList['22.055'] = ' Radiation Biophysics';
nameList['22.070'] = ' Mtls for Nuclear Application';
nameList['22.071'] = ' Elec, Signals, Measurement';
nameList['22.106'] = ' Neutron Interactns & Applctns';
nameList['22.107'] = ' Computational Nuclear Sci Eng';
nameList['22.211'] = ' Nuclear Reactor Physics I';
nameList['22.313'] = ' Therm Hydraulics:Power Tech';
nameList['22.38'] = ' Prob & Apps To Reli, Qua, Risk';
nameList['22.40'] = ' Fund of Adv Energy Conversion';
nameList['22.55'] = ' Radiation Biophysics';
nameList['22.561'] = ' Magnetic Resonance';
nameList['22.612'] = ' Intro to Plasma Physics II';
nameList['22.62'] = ' Fusion Energy';
nameList['22.63'] = ' Eng Princ for Fusion Reactors';
nameList['22.70'] = ' Mtls for Nuclear Applications';
nameList['22.78'] = ' Nuclear Chem Eng and Waste';
nameList['22.912'] = ' Seminar in Nuclear Sci & Engr';
nameList['22.S904'] = ' Special Subj: Nuclear Sci Engr';
nameList['24.02'] = ' Moral Problems and  Good Life';
nameList['24.04'] = ' Justice';
nameList['24.111'] = ' Philosophy: Quantum Mechanics';
nameList['24.114'] = ' Philosophcal History of Energy';
nameList['24.118'] = ' Paradox & Infinity';
nameList['24.211'] = ' Theory of Knowledge';
nameList['24.215'] = ' Topics in Philosphy of Science';
nameList['24.235'] = ' Philosophy of Law';
nameList['24.237'] = ' Feminist  PoliticalThought';
nameList['24.242'] = ' Logic II';
nameList['24.280'] = ' Foundations of Probability';
nameList['24.401'] = ' Proseminar-Philosophy II';
nameList['24.502'] = ' Topics Metaphysics & Ethics';
nameList['24.601'] = ' Moral Philosophy';
nameList['24.711'] = ' Topics in Philosophical Logic';
nameList['24.810'] = ' Topics: Philosophy of Science';
nameList['24.900'] = ' Introduction to Linguistics';
nameList['24.903'] = ' Lang & Structure III: Semntics';
nameList['24.905'] = ' Psycholinguistics';
nameList['24.909'] = ' Field Methods in Linguistics';
nameList['24.912'] = ' Intro to Black Studies';
nameList['24.914'] = ' Language Variation and Change';
nameList['24.918'] = ' Workshop Linguistic Research';
nameList['24.933'] = ' Lang & Structure III: Semntics';
nameList['24.942'] = ' Grammar of Less Familiar Lang';
nameList['24.952'] = ' Advanced Syntax';
nameList['24.954'] = ' Pragmatics in Linguist Theory';
nameList['24.956'] = ' Topics in Syntax';
nameList['24.962'] = ' Advanced Phonology';
nameList['24.967'] = ' Topics Experimental Phonology';
nameList['24.968'] = ' Speech Communication';
nameList['24.973'] = ' Advanced Semantics';
nameList['24.981'] = ' Topics Computational Phonolgy';
nameList['24.991'] = ' Workshop in Linguistics';
nameList['24.S95'] = ' Special Seminar: Linguistics';
nameList['24.S96'] = ' Special Seminar: Linguistics';
nameList['3.021'] = ' Intro to Modeling & Simulation';
nameList['3.044'] = ' Materials Processing';
nameList['3.053'] = ' Molec, Cell, & Tissue Biomechs';
nameList['3.054'] = ' Cellular Solids';
nameList['3.063'] = ' Polymer Physics';
nameList['3.091'] = ' Intro to Solid-State Chemistry';
nameList['3.152'] = ' Magnetic Materials';
nameList['3.21'] = ' Kinetic Processes in Materials';
nameList['3.22'] = ' Mech Behavior of Materials';
nameList['3.36'] = ' Cellular Solids';
nameList['3.370'] = ' Mfg & Use of Structural Matls';
nameList['3.45'] = ' Magnetic Materials';
nameList['3.903'] = ' Seminar: Polymer Sci & Tech';
nameList['3.961'] = ' Design Med Devices & Implants';
nameList['3.97'] = ' Cell-Matrix Mechanics';
nameList['3.985'] = ' Archaeological Science';
nameList['3.987'] = ' Human Evolution';
nameList['3.990'] = ' Sem:Archaeolog Method & Theory';
nameList['4.111'] = ' Intro Arch & Environ Design';
nameList['4.113'] = ' Arch Design Fundamentals II';
nameList['4.115'] = ' Arch Design Studio II';
nameList['4.163'] = ' Urban Design Studio';
nameList['4.181'] = ' Architectural Design Workshop';
nameList['4.183'] = ' Architectural Design Workshop';
nameList['4.189'] = ' Prep: MArch Thesis';
nameList['4.211'] = ' The City';
nameList['4.216'] = ' Landscp & Urb Heritage Conserv';
nameList['4.232'] = ' New Global Practitioner';
nameList['4.233'] = ' New Global Practitioner';
nameList['4.241'] = ' Theory of City Form';
nameList['4.244'] = ' Urban Design Seminar';
nameList['4.247'] = ' Urban Design Ideals & Action';
nameList['4.253'] = ' Urban Design Politics';
nameList['4.254'] = ' RE Dev Studio: Urban Projects';
nameList['4.264'] = ' Adv Sem: Landscape + Urbanism';
nameList['4.302'] = ' Found in Visual Arts-Majors';
nameList['4.314'] = ' Adv Wkshp Artistic Practice';
nameList['4.315'] = ' Adv Wkshp Artistic Practice';
nameList['4.332'] = ' Adv Sem in Participatory Media';
nameList['4.333'] = ' Adv Sem in Participatory Media';
nameList['4.341'] = ' Intro to Photo & Related Media';
nameList['4.342'] = ' Intro to Photo & Related Media';
nameList['4.343'] = ' Adv Photogrphy & Related Media';
nameList['4.365'] = ' Adv Projects in Visual Arts';
nameList['4.366'] = ' Adv Projects: Visual Arts';
nameList['4.367'] = ' Studio Seminar in Public Art';
nameList['4.368'] = ' Studio Seminar in Public Art';
nameList['4.388'] = ' Preparation for SMACT Thesis';
nameList['4.389'] = ' Tutorial for SMACT Thesis';
nameList['4.390'] = ' Art, Culture, & Tech Studio';
nameList['4.427'] = ' Analysis & Des: HVAC Systems';
nameList['4.430'] = ' Daylighting';
nameList['4.431'] = ' Architectural Acoustics';
nameList['4.474'] = ' Design for Sust Urban Futures';
nameList['4.475'] = ' Design for Sust Urban Futures';
nameList['4.501'] = ' Materializing Design';
nameList['4.510'] = ' Materializing Design';
nameList['4.522'] = ' Computational Design II';
nameList['4.523'] = ' Computational Design II';
nameList['4.541'] = ' Intro to Shape Grammars II';
nameList['4.542'] = ' Background to Shape Grammars';
nameList['4.553'] = ' Workshop in Computation';
nameList['4.556'] = ' Design without Boundaries';
nameList['4.557'] = ' Mobility-on-Demand';
nameList['4.561'] = ' Intro to Computation in Arch';
nameList['4.582'] = ' Rsrch Seminar in Computation';
nameList['4.583'] = ' Forum in Computation';
nameList['4.587'] = ' SMArchS Comp Pre-Thesis Prep';
nameList['4.602'] = ' Modern Art & Mass Culture';
nameList['4.605'] = ' Intro to Hist & Theory of Arch';
nameList['4.611'] = ' Civic  Arch in Islamic History';
nameList['4.613'] = ' Civic Arch in Islamic History';
nameList['4.616'] = ' Topics: Culture & Architecture';
nameList['4.625'] = ' Water Reading Group';
nameList['4.641'] = ' 19th-Century Art';
nameList['4.644'] = ' 19th-Century Art';
nameList['4.645'] = ' Topics in Arch: 1750-Present';
nameList['4.663'] = ' History of Urban Form';
nameList['4.670'] = ' Natlsm Intlsm Globlsm Mod Art';
nameList['4.671'] = ' Natlsm Intlsm Globlsm Mod Art';
nameList['4.S12'] = ' Spec Sub Architecture Design';
nameList['4.S14'] = ' Spec Sub Architecture Design';
nameList['4.S32'] = ' Spec Sub Art, Culture & Tech';
nameList['4.S42'] = ' Spec Sub Building Technology';
nameList['4.S52'] = ' Spec Sub Arch Computation';
nameList['4.S54'] = ' Spec Sub Arch Computation';
nameList['4.S66'] = ' Spec Sub HTC of Art';
nameList['4.S68'] = ' Spec Sub Adv Study Modern Arch';
nameList['5.03'] = ' Princ: Inorganic Chemistry I';
nameList['5.05'] = ' Princ: Inorganic Chemistry III';
nameList['5.063'] = ' Organometallic Compounds';
nameList['5.068'] = ' Physical Inorganic Chemistry';
nameList['5.069'] = ' Crystal Structure Analysis';
nameList['5.08'] = ' Biological Chemistry II';
nameList['5.111'] = ' Principles of Chemical Science';
nameList['5.12'] = ' Organic Chemistry I';
nameList['5.24'] = ' Archaeological Science';
nameList['5.44'] = ' Organometallic Chemistry';
nameList['5.45'] = ' Heterocyclic Chemistry';
nameList['5.46'] = ' NMR & Organic Structure Determ';
nameList['5.48'] = ' Protein Folding& Human Disease';
nameList['5.50'] = ' Enzymes: Struc & Func';
nameList['5.512'] = ' Synthetic Organic Chemistry II';
nameList['5.561'] = ' Chemistry in Industry';
nameList['5.60'] = ' Thermodynamics and Kinetics';
nameList['5.62'] = ' Physical Chemistry';
nameList['5.64'] = ' Biophysical Chemistry';
nameList['5.72'] = ' Statistical Mechanics';
nameList['5.74'] = ' Intro Quantum Mechanics II';
nameList['5.913'] = ' Seminar in Organic Chemistry';
nameList['5.921'] = ' Seminar: Biological Chemistry';
nameList['5.931'] = ' Seminar: Physical Chemistry';
nameList['5.941'] = ' Seminar: Inorganic Chemistry';
nameList['6.00'] = ' Intro: Comp Sci & Programming';
nameList['6.004'] = ' Computation Structures';
nameList['6.006'] = ' Intro to Algorithms';
nameList['6.007'] = ' Electro Energy Motors to Laser';
nameList['6.011'] = ' Intro:Comm,Control,Signal Proc';
nameList['6.012'] = ' Microelect Devices & Circuits';
nameList['6.013'] = ' Electromagnetics & Applctions';
nameList['6.02'] = ' Intro to EECS II';
nameList['6.022'] = ' Quant  Systems Physiology';
nameList['6.023'] = ' Fields, Forces and Flows';
nameList['6.024'] = ' Molec, Cell, & Tissue Biomechs';
nameList['6.034'] = ' Artificial Intelligence';
nameList['6.035'] = ' Computer Language Engineering';
nameList['6.041'] = ' Probabilistic Systems Analysis';
nameList['6.045'] = ' Automata, Comput, & Complexity';
nameList['6.046'] = ' Design and Analysis Algorithms';
nameList['6.049'] = ' Evolutionary Biology';
nameList['6.070'] = ' Electronics Project Laboratory';
nameList['6.071'] = ' Elec, Signals, Measurement';
nameList['6.072'] = ' Intro to Digital Electronics';
nameList['6.102'] = ' Introductory RF Design Lab';
nameList['6.115'] = ' Microcomputer Project Lab';
nameList['6.123'] = ' Bioinstrumentation Project Lab';
nameList['6.170'] = ' Software Studio';
nameList['6.182'] = ' Psychoacoustics Project Lab';
nameList['6.241'] = ' Dynamic Systems and Control';
nameList['6.252'] = ' Nonlinear Programming';
nameList['6.253'] = ' Convex Analysis & Optimization';
nameList['6.256'] = ' Semidefinite Optimization';
nameList['6.262'] = ' Discrete Stochastic Processes';
nameList['6.265'] = ' Adv Stochastic Processes';
nameList['6.302'] = ' Feedback Systems';
nameList['6.334'] = ' Power Electronics';
nameList['6.335'] = ' Fast Methods:Part Diff Eq';
nameList['6.431'] = ' Applied Probability';
nameList['6.437'] = ' Inference and Info';
nameList['6.441'] = ' Information Theory';
nameList['6.443'] = ' Quantum Information Science';
nameList['6.522'] = ' Quant Phys:Organ Transport Sys';
nameList['6.541'] = ' Speech Communication';
nameList['6.632'] = ' Electromagnetic Wave Theory';
nameList['6.634'] = ' Nonlinear Optics';
nameList['6.641'] = ' Electro Forces,Fields,Motion';
nameList['6.652'] = ' Intro to Plasma Physics II';
nameList['6.691'] = ' Sem in Elec Power Sys';
nameList['6.695'] = ' Eng Econ & Reg: Electric Power';
nameList['6.717'] = ' Design and Fabrication of MEMS';
nameList['6.730'] = ' Physics:Solid-State Applicatns';
nameList['6.775'] = ' CMOS Analog and Circuit Design';
nameList['6.777'] = ' Design and Fabrication of MEMS';
nameList['6.780'] = ' Control of Manufacturing Proc';
nameList['6.781'] = ' Nanostructure Fabrication';
nameList['6.813'] = ' User Interface Design';
nameList['6.814'] = ' Database Systems';
nameList['6.815'] = ' Digital & Computational Photo';
nameList['6.824'] = ' Dist Computer Sys Engineering';
nameList['6.830'] = ' Database Systems';
nameList['6.831'] = ' User Interface Design';
nameList['6.832'] = ' Underactuated Robotics';
nameList['6.842'] = ' Randomness and Computation';
nameList['6.850'] = ' Geometric Computing';
nameList['6.851'] = ' Adv Data Structures';
nameList['6.857'] = ' Network and Computer Security';
nameList['6.865'] = ' Adv Computational Photography';
nameList['6.870'] = ' Adv Topics: Computer Vision';
nameList['6.875'] = ' Cryptography & Cryptanalysis';
nameList['6.881'] = ' Adv Topics in Artificial Intel';
nameList['6.902'] = ' Engr Innovation and Design';
nameList['6.S062'] = ' Special Subject  in EECS';
nameList['6.S076'] = ' Special Subject in EE & CS';
nameList['6.S078'] = ' Special Subject in EE & CS';
nameList['6.S083'] = ' Special Subject in EE & CS';
nameList['6.S084'] = ' Special Subject  in EE & CS';
nameList['6.S897'] = ' Special Subj: Computer Science';
nameList['6.S976'] = ' Special Subj: Electrical Engr';
nameList['6.S977'] = ' Special Subj: Electrical Engr';
nameList['6.UAT'] = ' Prep for Undergrad Adv Project';
nameList['7.013'] = ' Introductory Biology';
nameList['7.014'] = ' Introductory Biology';
nameList['7.05'] = ' General Biochemistry';
nameList['7.06'] = ' Cell Biology';
nameList['7.08'] = ' Biological Chemistry II';
nameList['7.10'] = ' Phys Chem Biomolecular Systems';
nameList['7.23'] = ' Immunology';
nameList['7.26'] = ' Molec Basis Infect Disease';
nameList['7.27'] = ' Principles of Human Disease';
nameList['7.28'] = ' Molecular Biology';
nameList['7.29'] = ' Cellular Neurobiology';
nameList['7.33'] = ' Evolutionary Biology';
nameList['7.342'] = ' Advanced Undergraduate Seminar';
nameList['7.343'] = ' Advanced Undergraduate Seminar';
nameList['7.345'] = ' Advanced Undergraduate Seminar';
nameList['7.346'] = ' Advanced Undergraduate Seminar';
nameList['7.37'] = ' Molec & Engr Aspects Biotech';
nameList['7.41'] = ' Topics in Chemical Biology';
nameList['7.49'] = ' Developmental Neurobiology';
nameList['7.549'] = ' Drug Safety Issues';
nameList['7.55'] = ' Case Studies Experimental Des';
nameList['7.57'] = ' Quantitative Biology';
nameList['7.58'] = ' Molecular Biology';
nameList['7.63'] = ' Immunology';
nameList['7.64'] = ' Molec Mechnsm Neuromusc Disord';
nameList['7.66'] = ' Molec Basis Infect Disease';
nameList['7.68'] = ' Molecular &C ell Neurosci II';
nameList['7.70'] = ' Regulation of Gene Expression';
nameList['7.76'] = ' Topics in Protein Biochemistry';
nameList['7.77'] = ' Wrkshp:Nucleic Acids& Proteins';
nameList['7.80'] = ' Biological Chemistry II';
nameList['7.88'] = ' Protein Folding& Human Disease';
nameList['7.95'] = ' Cancer Biology';
nameList['7.98'] = ' Neural Plasticity:Lrng & Mmry';
nameList['8.022'] = ' Physics II';
nameList['8.03'] = ' Physics III';
nameList['8.04'] = ' Quantum Physics I';
nameList['8.044'] = ' Statistical Physics I';
nameList['8.06'] = ' Quantum Physics III';
nameList['8.08'] = ' Statistical Physics II';
nameList['8.226'] = ' 43 Orders of Magnitude';
nameList['8.282'] = ' Intro to Astronomy';
nameList['8.284'] = ' Modern Astrophysics';
nameList['8.311'] = ' Electromagnetic Theory';
nameList['8.322'] = ' Quantum Theory II';
nameList['8.323'] = ' Rel Quantum Field Theory I';
nameList['8.325'] = ' Rel Quantum Field Theory III';
nameList['8.334'] = ' Statistical Mechanics II';
nameList['8.371'] = ' Quantum Information Science';
nameList['8.421'] = ' Atomic & Optical Physics I';
nameList['8.431'] = ' Nonlinear Optics';
nameList['8.512'] = ' Theory of Solids II';
nameList['8.614'] = ' Intro to Plasma Physics II';
nameList['8.711'] = ' Nuclear Physics';
nameList['8.901'] = ' Astrophysics I';
nameList['8.962'] = ' General Relativity';
nameList['9.00'] = ' Introduction to Psychology';
nameList['9.012'] = ' Cognitive Science';
nameList['9.013'] = ' Molecular &C ell Neurosci II';
nameList['9.09'] = ' Cellular Neurobiology';
nameList['9.10'] = ' Behavioral Neuroscience';
nameList['9.14'] = ' Brain Structure';
nameList['9.18'] = ' Developmental Neurobiology';
nameList['9.181'] = ' Developmental Neurobiology';
nameList['9.285'] = ' Neural Coding & Perceptn Sound';
nameList['9.301'] = ' Neural Plasticity:Lrng & Mmry';
nameList['9.35'] = ' Sensation and Perception';
nameList['9.520'] = ' Statistical Learning Theory';
nameList['9.59'] = ' Psycholinguistics';
nameList['9.65'] = ' Cognitive Processes';
nameList['9.68'] = ' Affect: Aspects of Feelings';
nameList['9.691'] = ' Intro to Connectomics';
nameList['9.70'] = ' Social Psychology';
nameList['9.75'] = ' Psychology of Gender and Race';
nameList['9.77'] = ' Computational Perception';
nameList['9.777'] = ' Computational Perception';
nameList['9.91'] = ' Ind Study Brain & Cog Sciences';
nameList['9.S52'] = ' Spec Subj Brain & Cog Sciences';
nameList['9.S913'] = ' Spec Subj Brain & Cog Sciences';
nameList['9.S915'] = ' Spec Subj Brain & Cog Sciences';
nameList['CC.011'] = ' Seminar II';
nameList['CC.111'] = ' Modern Conceptions of Freedom';
nameList['CC.112'] = ' Philosophy of Love';
nameList['CC.114'] = ' Philosophcal History of Energy';
nameList['CC.1803'] = ' Differential Equations';
nameList['CC.802'] = ' Physics II';
nameList['CMS.312'] = ' Topics Natl & Post-Natl Cinema';
nameList['CMS.335'] = ' Short Documentary';
nameList['CMS.338'] = ' Documentary: Techlgy & Techniq';
nameList['CMS.361'] = ' Networked Social Movements';
nameList['CMS.362'] = ' Civic Media Codesign Studio';
nameList['CMS.376'] = ' History of Media and Tech';
nameList['CMS.400'] = ' Media Systems';
nameList['CMS.590'] = ' Computer Games';
nameList['CMS.607'] = ' Theory & Prac of Player Rsch';
nameList['CMS.609'] = ' The Word Made Digital';
nameList['CMS.610'] = ' Media Industries and Systems';
nameList['CMS.612'] = ' Writing for Videogames';
nameList['CMS.616'] = ' Soc & Culture of Digital Games';
nameList['CMS.621'] = ' Fans and Fan Cultures';
nameList['CMS.631'] = ' Systems Visualization';
nameList['CMS.812'] = ' Topics Natl & Post-Natl Cinema';
nameList['CMS.821'] = ' Fans and Fan Cultures';
nameList['CMS.830'] = ' Studies in Film';
nameList['CMS.831'] = ' Systems Visualization';
nameList['CMS.838'] = ' Documentary: Techlgy & Techniq';
nameList['CMS.843'] = ' Theory & Prac of Player Rsch';
nameList['CMS.846'] = ' The Word Made Digital';
nameList['CMS.861'] = ' Networked Social Movements';
nameList['CMS.862'] = ' Civic Media Codesign Studio';
nameList['CMS.863'] = ' Computer Games';
nameList['CMS.866'] = ' Writing for Videogames';
nameList['CMS.868'] = ' Soc & Culture of Digital Games';
nameList['CMS.871'] = ' Media in Cultural Context';
nameList['CMS.876'] = ' History of Media & Technology';
nameList['CMS.920'] = ' Popular Narrative';
nameList['CMS.922'] = ' Media Industries and Systems';
nameList['CMS.935'] = ' Doc Photography & Journalism';
nameList['CMS.951'] = ' Workshop II';
nameList['CMS.990'] = ' Colloquium Comparative Media';
nameList['CMS.S98'] = ' Special Subject: CMS';
nameList['EC.050'] = ' Recreate Exprimnts from Histry';
nameList['EC.075'] = ' Starting Up New Tech Business';
nameList['EC.090'] = ' Recreate Experiments from Hist';
nameList['EC.100'] = ' Electronics Fab and Design I';
nameList['EC.101'] = ' Electronics Fab and Design II';
nameList['EC.110'] = ' Intro to Digital Electronics';
nameList['EC.120'] = ' Electronics Project Laboratory';
nameList['EC.130'] = ' Intro to Microcontrollers';
nameList['EC.310'] = ' Creative Imaging';
nameList['EC.711'] = ' D-Lab: Energy';
nameList['EC.714'] = ' D-Lab: Biodiversity';
nameList['EC.715'] = ' D-Lab:Disseminating Innovation';
nameList['EC.720'] = ' D-Lab: Design';
nameList['EC.733'] = ' D-Lab: Supply Chains';
nameList['ES.010'] = ' Chemistry of Sports';
nameList['ES.1802'] = ' Calculus';
nameList['ES.1803'] = ' Differential Equations';
nameList['ES.802'] = ' Physics II';
nameList['ES.8022'] = ' Physics II';
nameList['ES.S10'] = ' Special Subject in Science';
nameList['ES.S11'] = ' Special Subject in Science';
nameList['ES.S20'] = ' Special Subject in Mathematics';
nameList['ES.S41'] = ' Spec Subject in the Humanities';
nameList['ES.S60'] = ' Spec Subject in Social Science';
nameList['ES.S61'] = ' Spec Subject in Social Science';
nameList['ES.S70'] = ' Spec Subj Intrdisciplinry Stdy';
nameList['ES.S71'] = ' Spec Subj Intrdisciplinry Stdy';
nameList['ESD.00'] = ' Intro to Engineering Systems';
nameList['ESD.01'] = ' Transportation Systms Modeling';
nameList['ESD.051'] = ' Engr Innovation and Design';
nameList['ESD.052'] = ' Project Engineering';
nameList['ESD.053'] = ' Envir Cncr Rsk Prvntn Therapy';
nameList['ESD.054'] = ' Engineering Leadership';
nameList['ESD.125'] = ' Mapping & Eval New Energy Tech';
nameList['ESD.129'] = ' Space Policy Seminar';
nameList['ESD.132'] = ' Law, Technology, & Pub Policy';
nameList['ESD.137'] = ' Sustainability, Trade, & Envir';
nameList['ESD.162'] = ' Eng Econ & Reg: Electric Power';
nameList['ESD.191'] = ' Urban and Regional Economics';
nameList['ESD.192'] = ' Analyzing Regional Econ Change';
nameList['ESD.212'] = ' Demand Modeling';
nameList['ESD.222'] = ' Trsprtn Policy & Envir Limits';
nameList['ESD.226'] = ' Public Transportation Systems';
nameList['ESD.261'] = ' Logistics & Supply Chain Mgmt';
nameList['ESD.265'] = ' International Supp Chain Mgmt';
nameList['ESD.267'] = ' Supply Chain Planning';
nameList['ESD.268'] = ' Mfg Sys & Supply Chain Design';
nameList['ESD.274'] = ' Theory of Operations Mgmt';
nameList['ESD.283'] = ' Humanitarian Logistics';
nameList['ESD.344'] = ' Real Optns for Prod & Sys Dsgn';
nameList['ESD.352'] = ' Space Systems Engineering';
nameList['ESD.38'] = ' Enterprise Architecting';
nameList['ESD.40'] = ' Product Design and Development';
nameList['ESD.565'] = ' Evolution to Web & Mgmt 3.0';
nameList['ESD.63'] = ' Control of Manufacturing Proc';
nameList['ESD.64'] = ' Product Design';
nameList['ESD.712'] = ' RE Dev: Tools for Analysis';
nameList['ESD.753'] = ' Stat Learning & Data Mining';
nameList['ESD.755'] = ' Stat Reasoning & Data Modeling';
nameList['ESD.756'] = ' Statistical Methods';
nameList['ESD.762'] = ' Systems Optimization';
nameList['ESD.77'] = ' Multidscply Sys Dsgn Optmztn';
nameList['ESD.80'] = ' Sem in Tech Policy Research';
nameList['ESD.802'] = ' SDM Thesis Seminar';
nameList['ESD.86'] = ' Models for Socio-Tech Sys';
nameList['ESD.863'] = ' System Safety';
nameList['ESD.864'] = ' Modeling & Assessment for Pol';
nameList['ESD.S21'] = ' Grad Special Subject in ESD';
nameList['ESD.S22'] = ' Grad Special Subject in ESD';
nameList['ESD.S30'] = ' Grad Special Subject in ESD';
nameList['ESD.S31'] = ' Special Grad Studies in ESD';
nameList['ESD.S40'] = ' Special Grad Studies in ESD';
nameList['ESD.S41'] = ' Special Grad Studies in ESD';
nameList['ESD.S43'] = ' Special Grad Studies in ESD';
nameList['ESD.S50'] = ' Special Grad Studies in ESD';
nameList['HST.060'] = ' Endocrinology';
nameList['HST.061'] = ' Endocrinology';
nameList['HST.080'] = ' Hematology';
nameList['HST.081'] = ' Hematology';
nameList['HST.100'] = ' Respiratory Pathophysiology';
nameList['HST.101'] = ' Respiratory Pathophysiology';
nameList['HST.110'] = ' Renal Pathophysiology';
nameList['HST.111'] = ' Renal Pathophysiology';
nameList['HST.150'] = ' Principles of Pharmacology';
nameList['HST.151'] = ' Principles of Pharmacology';
nameList['HST.200'] = ' Intro to Clinical Medicine';
nameList['HST.202'] = ' Medical Engineering II';
nameList['HST.203'] = ' Medical Engr & Medical Physics';
nameList['HST.212'] = ' Biomed Entrprse Clinicl Exp I';
nameList['HST.491'] = ' Review Biomedical Literature';
nameList['HST.500'] = ' Frontiers BioMed Engr & Physcs';
nameList['HST.509'] = ' Comp & Funct Genomics';
nameList['HST.514'] = ' Sensory-Neural Systems';
nameList['HST.521'] = ' Biomaterials &Tissue Engr';
nameList['HST.523'] = ' Cell-Matrix Mechanics';
nameList['HST.524'] = ' Design Med Devices & Implants';
nameList['HST.527'] = ' Bld Vsl & Edth Phn Hlth & Dis';
nameList['HST.531'] = ' Proton Radiation Therapy';
nameList['HST.542'] = ' Quant  Systems Physiology';
nameList['HST.560'] = ' Radiation Biophysics';
nameList['HST.584'] = ' Magnetic Resonance';
nameList['HST.590'] = ' Biomedical Engineering Seminar';
nameList['HST.710'] = ' Speech Communication';
nameList['HST.723'] = ' Neural Coding & Perceptn Sound';
nameList['HST.790'] = ' Research in Speech & Hearing';
nameList['HST.905'] = ' Intro to Health Care Mngmt';
nameList['HST.916'] = ' Drug Safety Issues';
nameList['HST.918'] = ' Econ Health Care Industries';
nameList['HST.921'] = ' Tech Innov in Healthcare';
nameList['HST.922'] = ' Tech Innov in Healthcare';
nameList['HST.923'] = ' Tech Innov in Healthcare (Lab)';
nameList['HST.924'] = ' Tech Innov in Healthcare (Lab)';
nameList['HST.934'] = ' Intro to Global Medicine';
nameList['HST.971'] = ' Strat Dec Mkg in Life Sci';
nameList['HST.977'] = ' Critical Assessmnt Biomed Info';
nameList['HST.979'] = ' Dynamics of Biomed Tech';
nameList['MAS.111'] = ' Intro to Resea Media Art & Sci';
nameList['MAS.132'] = ' Camera Culture';
nameList['MAS.160'] = ' Signals,Sys,Info:Media Technol';
nameList['MAS.510'] = ' Signals,Sys,Info:Media Technol';
nameList['MAS.511'] = ' Signals,Sys,Info:Media Technol';
nameList['MAS.532'] = ' Camera Culture';
nameList['MAS.533'] = ' Imaging Ventures';
nameList['MAS.551'] = ' Design without Boundaries';
nameList['MAS.552'] = ' Mobility-on-Demand';
nameList['MAS.571'] = ' Social Television';
nameList['MAS.581'] = ' Networks, Complexity App';
nameList['MAS.600'] = ' Human 2.0';
nameList['MAS.664'] = ' Digitial Innovations';
nameList['MAS.672'] = ' New Paradigms for HCI';
nameList['MAS.681'] = ' New Textiles';
nameList['MAS.826'] = ' Projects in Media and Music';
nameList['MAS.836'] = ' Sens Tech Interact Environs';
nameList['MAS.S60'] = ' Spec Subj in Media Technology';
nameList['MAS.S61'] = ' Spec Subj in Media Technology';
nameList['MAS.S62'] = ' Spec Subj in Media Technology';
nameList['MAS.S63'] = ' Spec Subj in Media Technology';
nameList['MS.402'] = ' Leadership in a Complex World';
nameList['NS.201'] = ' Naval Weapons Systems';
nameList['NS.202'] = ' Seapower and Maritime Affairs';
nameList['NS.301'] = ' Celestial Navigation';
nameList['NS.402'] = ' Leadership and Ethics';
nameList['SP.360'] = ' Terrascope Radio';
nameList['STS.001'] = ' Technology in American History';
nameList['STS.005'] = ' Disease and Society in America';
nameList['STS.007'] = ' Technology in History';
nameList['STS.009'] = ' Evolution and Society';
nameList['STS.050'] = ' The History of MIT';
nameList['STS.087'] = ' Biography in Science';
nameList['STS.089'] = ' Wealth, Envir & Health: Africa';
nameList['STS.091'] = ' Critical Issues in STS';
nameList['STS.340'] = ' Intro to History of Technology';
nameList['STS.390'] = ' Rsch Sem: Sci, Tech & Society';
nameList['STS.449'] = ' Intro to Global Medicine';
nameList['STS.901'] = ' Ind Stdy: Science, Tech, & Soc';
nameList['STS.S91'] = ' Spec Subject: Sci, Tech & Soci';
nameList['WGS.101'] = ' Intro Womens & Gender Studies';
nameList['WGS.115'] = ' Gender and Technology';
nameList['WGS.141'] = ' International Womens Voices';
nameList['WGS.142'] = ' Contemporary Women of Color';
nameList['WGS.170'] = ' Identity and Difference';
nameList['WGS.190'] = ' Intro to Black Studies';
nameList['WGS.220'] = ' Wmn & Gndr Mid East & N Africa';
nameList['WGS.221'] = ' Women in the Developing World';
nameList['WGS.228'] = ' Psychology of Gender and Race';
nameList['WGS.231'] = ' Writing about Race';
nameList['WGS.234'] = ' Invention of French Theory';
nameList['WGS.237'] = ' Race & Gender in Asian America';
nameList['WGS.240'] = ' Jane Austen';
nameList['WGS.270'] = ' Violence, Human Rghts, Justice';
nameList['WGS.301'] = ' Feminist  PoliticalThought';
nameList['WGS.600'] = ' Dissertation Wkshp Wmn Studies';
nameList['WGS.615'] = ' Feminist Inquiry';
nameList['WGS.640'] = ' Womens Life Narratives';
nameList['WGS.700'] = ' Interdisciplinary Area Studies';
}


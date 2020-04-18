/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const fruits = {
	header:
		['fruit',
		'price'],
	things:
	[
		['apple', 1.70,],
		['berry', 1],
		['banana', 1.2],
		['cherry', 1.3],
		['pear', 1.9],
		['guava', 1.5],
		['lemon', 2],
		['lime', 0.4],
		['tomato', 1.6],
		['papaya', 0.6],
		['raspberry', 0.7],
		['blueberry', 1.2],
		['blackberry', 2.1],
		['strawberry', 2.2],
		['dragonfruit', 1.52],
		['passionfruit', 1.67],
		['boisenberry', 1.34],
		['orange', 1.26],
		['watermelon', 1.58],
		['canteloupe', 1.43],
		['honeydew', 1.73]
	]
}
var data = {};
var dataa;
var order = false //false for ascending, true for descending
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		initializeSheet();
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = lookup(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
function createTable(object, table){
	//iterate through object
	var urlColumn;
	var row = table.insertRow(-1) //insert header row
	i = 0
	object.header.forEach(head => {
		if (head == "Url"){
			urlColumn = i //check if column is urlcolumn
		} else {
			row.classList.add("header") //make header
			var cell = row.insertCell(-1)
			cell.innerHTML = head //set value to element in header
		}
		i++
	})
	var allUrls = [] 
	object.things.forEach(thing => {
		allUrls.push(thing[urlColumn]) //add all urls to one list
	})
	j = 0
	object.things.forEach(thing => {
		var row = table.insertRow(-1) //create row for each element in object
		k = 0
		for (var innerThing in thing){
			//create cell for each value in object
			if (k != urlColumn){
				var cell = row.insertCell(-1)
				if (k == 0) {
					newLink = cell.appendChild(document.createElement("a"))
					newLink.href = allUrls[j]
					newLink.target ="_blank"
					newLink.innerHTML = thing[innerThing]
				} else {
					cell.innerHTML = thing[innerThing]
				}
			}
			k++
		}
		j++
	})
}
function initializeDB(){
		data = parseDataa(dataa)
		dropDown(lookup('sort'), data.header)
		drawTable(data, lookup("searchResults"), data.header.indexOf(lookup("sort").value), order)
		lookup("search").onkeyup = function(){
			if (searchDatabase('searchResults', 'search')){ //set searchbar to search database
				lookup('searchResults').style.display = ""
				lookup("none").style.display = "none"
			} else {
				lookup('none').style.display = ""
				lookup("searchResults").style.display = "none"
			}
		}
		lookup("sort").onchange = function(){
			drawTable(data, lookup("searchResults"), data.header.indexOf(lookup("sort").value), order)
		}
		lookup("order").onclick = function(){
			switchOrder()
		}
}
function drawTable(array, table, sorting, descending = false){
	table = deleteTable(table) //delete all rows in table
	array.things.sort(function(a, b){
		if (a[sorting]== b[sorting]) {
        return 0;
    }
    else {
        return (a[sorting] < b[sorting]) ^ descending ? -1 : 1; //sort by whichever element is given by dropdown
    }
	})
	createTable(array, table) //create table from object
}

function switchOrder(){
	order = !order
	if (order){
		lookup("order").innerHTML = "Descending"
	} else {
		lookup("order").innerHTML = "Ascending"
	}
	drawTable(data, lookup("searchResults"), data.header.indexOf(lookup("sort").value), order)
}


function lookup(id){
	return document.getElementById(id); //lookup using id
}

function searchDatabase(table, input) {
  // Declare variables
  var tr, td, i, txtValue;
  table = lookup(table)
  input = lookup(input)
  filter = input.value.toUpperCase();
  tr = table.getElementsByTagName("tr");
  foundAny = false

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
	if (tr[i].classList.contains("header")){ //check if header
		continue;
	}
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
		foundAny = true
      } else {
        tr[i].style.display = "none";
      }
    }
  }
  return foundAny
}

function remove(obj, thing){
	index = obj.indexOf(thing);
	if (index > -1) {
		obj.splice(index, 1);
	}
	return obj
}
function dropDown(ele, options) { //make dropdown based on elements
    ele.length = 0
    options.forEach(key => {
		if (key !== "Url"){
			let o = document.createElement("option");
			o.coin = key;
			o.text = key;
			ele.appendChild(o);
		}
    })
}
function deleteTable(table){
	table.innerHTML = "";
	return table
}
function initializeSheet(){
	var publicSpreadsheetUrl = "https://docs.google.com/spreadsheets/d/1XQvP1v99cF-rTn1FRBKuffEMYcxn-cVrBfHlpeAS3Jw/edit?usp=sharing";

		  function init() {
			Tabletop.init( { key: publicSpreadsheetUrl,
							 callback: showInfo,
							 simpleSheet: true } )
		  }

		  function showInfo(data, tabletop) {
			dataa = data;
			initializeDB()
		  }

		  window.addEventListener('DOMContentLoaded', init)
}

function parseDataa(dataParse){ //parse data from spreadsheet
	var tempData = {
		things: [],
	}
	tempData.header = Object.keys(dataParse[0])
	dataParse.forEach(datum => {
		datum = Object.values(datum) //only take values
		tempData.things.push(datum);
	})
	return tempData
}


app.initialize();
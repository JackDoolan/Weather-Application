
const $ = (selector) => document.querySelector(selector);



var lat;
var long;




//This is the function which will be used when I click the go button, it checks wether I am choosing metric or imperial then prints the data out.


const printWeather = () => {
	const xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	xhr.onreadystatechange = () => {
		//If the request is succesfull and the information is ready to be pulled run the getweather function, which prints out the weather data.
		if (xhr.readyState == 4 && xhr.status == 200) {

			console.log(xhr.response);
			getWeather(xhr.response);
		}
	};

	xhr.onerror = e => console.log(e.message);
	//Creates a blank string called weather
	var Weather = "";
	//Sets the String "weather" to whatever the user entered in the search box, this is the most important part for the search functionality
	Weather = $("#Search").value;

	//If ceclius is ticked, use the information below
	if ($("#celcius").checked == true) {
		//Runs the API key, "+weather+" refers to the user entry and the unit of measurment is changed to metric
		xhr.open("GET", "https://api.openweathermap.org/data/2.5/forecast?q=" + Weather + ",IE&mode=json&units=metric&appid=2c49244bbe35c98e10a0aacec8bac44e");
		xhr.send();
	}
	//Else, the reason i don't have else if is because these are radio buttons so one of them has to be picked at any one time
	else {
		//Runs the API key, "+weather+" refers to the user entry and the unit of measurment is changed to imperial
		xhr.open("GET", "https://api.openweathermap.org/data/2.5/forecast?q=" + Weather + ",IE&mode=json&units=imperial&appid=2c49244bbe35c98e10a0aacec8bac44e");
		xhr.send();
	}


};


//This is the function which will run when I click the geo location button, it finds my geolocation, latitude and longitude, 
//runs it in openweathermap API and then prints out the data for that location


const getCoords = (function () {



	if (navigator.geolocation) {
		console.log('Geolocation API success')


	} else {
		console.log('Geolocation API is not supported by your browser')
	};
});

// Get latitude and longitude
navigator.geolocation.getCurrentPosition(function (position) {
	lat = position.coords.latitude;
	long = position.coords.longitude;
	console.log("Your latitude is: " + lat + " and your longitude is: " + long);

	//Finds my location based on my current latitude and longitude(not 100% accurate, for some reason it was saying I was in the middle of a river, now is saying that im in Dublin airport?)
	fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=AIzaSyCJw0QfJXXleECtFD5031OMG75lZMiC6dY', function (response) {
		$('.yourLocationGoesHere').text(response.results[7].formatted_address);



	})
});

//This is the get location function, this is what will give me weather data based on my location.
//This is very similar to my main function, apart from the fact that the API key is called with latitude and longitude instead 
//of location name.
const getLocation = (function () {

	//Runs the get coords function to get my latitude and longitude to be used later in this function.
	getCoords();




	//Ling 96-112 is the same as my main function, apart from running getWeather(). getWeatherGeo is ran instead, which prints out my weather data
	//based on my geolocation rather than a searched location.

	const xhr = new XMLHttpRequest();
	xhr.responseType = "json";
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4 && xhr.status == 200) {

			console.log(xhr.response);
			getWeatherGeo(xhr.response);
		}
	};

	xhr.onerror = e => console.log(e.message);


	//Calls the API key and inserts the latitude and longitude into it to that and searches for weather based on that location
	xhr.open("GET", "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&appid=2c49244bbe35c98e10a0aacec8bac44e");
	xhr.send();



});




//This is what displays the current geolocation a map. This is from a google API, refrenced in the report.
function initMap() {
	//Gets the lat and long from "getlocation();"
	const uluru = { lat: lat, lng: long };

	//Makes a new map, sets zoom to 4, and sets centre on my lat and long, prints it out into my div with the ID of map
	const map = new google.maps.Map($("#map"), {
		zoom: 4,
		center: uluru,
	});
	//Sets the marker onto "uluru" which is my latitude and longitude.
	const marker = new google.maps.Marker({
		position: uluru,
		map: map,
	});
}


//This is the function that will print out my data if geolocation weather data is picked, it is very much like the other print functions
//apart from the fact that the celcius and fahrenheit calculations are made inside the function instead of the key call.
//The functionality of printing the weather data is fully explained in my getweather(); function
const getWeatherGeo = (data) => {




	var TemperatureGeo = (data.main.temp);
	if ($("#celcius").checked == true) {
		TemperatureGeo = TemperatureGeo - 273.15
		TemperatureGeo = TemperatureGeo.toFixed(2)
	}
	else {

		TemperatureGeo = (TemperatureGeo - 273.15) * 9 / 5 + 32
		TemperatureGeo = TemperatureGeo.toFixed(2)
	}
	var weathertypeGeo = (data.weather[0].main)

	var weatherDescriptionGeo = (data.weather[0].description)



	var weatherIcon1 = (data.weather[0].icon);

	
	



	var outputString = "<div class='dailyOutput'><br> <h1> Weather based on your location</h1>" +

		"<img class='daily' src = 'images/" + weatherIcon1 + ".png' >" +
		"<br>Temperature = " + TemperatureGeo +
		"<br> Weather = " + weathertypeGeo + "<br> Description = " + weatherDescriptionGeo + "</div>";

	$("#outputday1").innerHTML = outputString;
}




//The function which gets the weather data
const getWeather = (data) => {

	//If the daily radio button is checked it will only print out the data for right now
	if ($("#daily").checked == true) {
		//Again, stores the user search as a string called weather.
		var Weather = $("#Search").value;
		//Stores the temperature right now as Temperatureday1
		var Temperatureday1 = (data.list[0].main.temp);
		//Stores the weather type as weathertypeday1
		var weathertypeday1 = (data.list[0].weather[0].main)
		//Stores the weather description as weatherDescriptionday1
		var weatherDescriptionday1 = (data.list[0].weather[0].description)


		//This is what I used to get changing images
		//Creates a new variable called weatherIcon, finds the icon for whatever time you are looking for and stores it in weatherIcon. This icon
		//code will then be used in the output, I have all the images saved as their adjacent icon codes and will 
		//create a new image letting the image src be the icon code variable, this will make it change based on the icon code
		var weatherIcon1 = (data.list[0].weather[0].icon);
		


		//This is where I create the string to be outputted into the HTML.
		var outputString = "<div class='dailyOutput'><h1>Weather in " + Weather + "</h1><br> " +
			//This is what prints out the image into the HTML, I write out an image statement as normal and then I inlcude the icon code as the image name
			//I can do this without issue because I have saved all of openweathermap Icons with the same name as their code.
			"<img class='daily' src = 'images/" + weatherIcon1 + ".png' >" +
			"<br>Temperature = " + Temperatureday1 +
			"<br> Weather = " + weathertypeday1 + "<br> Description = " + weatherDescriptionday1 + "</div>";
		//Prints out my data into my HTML. I use the same ID for printing out my single day and my weekly. This is so when I decide to print daily after I printed weekly
		//the data is replaced with the new data and vice versa
		$("#outputday1").innerHTML = outputString;
	}




	//Else refers to a weekly view, it is not an if else as these buttons are again, radio buttons, so only one of them can be picked at any time.
	//I have left comments out of most of them as it would be a repeat of my daily function, the only difference being that the element in the
	//list array is different, this is because the list array stores the data for weather in 3 hour intervals so i must choose a different element every
	//time if I want to get weather for tomorrow, the next day and so on.
	else {

		var Weather = $("#Search").value;
		var Temperatureday1 = (data.list[0].main.temp)
		var weathertypeday1 = (data.list[0].weather[0].main)
		var weatherDescriptionday1 = (data.list[0].weather[0].description)
		var weatherIcon1 = (data.list[0].weather[0].icon);
		




		var Temperatureday2 = (data.list[7].main.temp);
		var weathertypeday2 = (data.list[7].weather[0].main)
		var weatherDescriptionday2 = (data.list[7].weather[0].description)
		var weatherIcon2 = (data.list[7].weather[0].icon);
		
		

		var date3 = (data.list[15].dt_txt)
		date3 = date3.slice(5, 10);
		var Temperatureday3 = (data.list[15].main.temp);
		var weathertypeday3 = (data.list[15].weather[0].main)
		var weatherDescriptionday3 = (data.list[15].weather[0].description)
		var weatherIcon3 = (data.list[15].weather[0].icon);
		


		var date4 = (data.list[23].dt_txt)
		date4 = date4.slice(5, 10);
		var Temperatureday4 = (data.list[23].main.temp);
		var weathertypeday4 = (data.list[23].weather[0].main)
		var weatherDescriptionday4 = (data.list[23].weather[0].description)
		var weatherIcon4 = (data.list[23].weather[0].icon);
	

		var date5 = (data.list[31].dt_txt)
		date5 = date5.slice(5, 10);
		var Temperatureday5 = (data.list[31].main.temp);
		var weathertypeday5 = (data.list[31].weather[0].main)
		var weatherDescriptionday5 = (data.list[31].weather[0].description)
		var weatherIcon5 = (data.list[31].weather[0].icon);
		
		
		
		//I have decided to create a table here to keep my data clear, concise and easy to read.
		var outputString = "<h1>Weather in " + Weather + "</h1><br> <table border='1' width='100%' height='500px'> <td></td><td>Today</td><td>Tomorrow</td><td>" + date3 + "</td><td>" + date4 + "</td><td>" + date5 + "</td>" +
			" <tr> <td></td><td><img src = 'images/" + weatherIcon1 + ".png'></td> <td><img src = 'images/" + weatherIcon2 + ".png'></td> <td><img src = 'images/" + weatherIcon3 + ".png'></td> <td><img src = 'images/" + weatherIcon4+ ".png'></td> <td><img src = 'images/" + weatherIcon5 + ".png'></td><tr> <td>Temperature</td><td>" + Temperatureday1 + "</td><td>" + Temperatureday2 + "</td><td>" + Temperatureday3 + "</td><td>" + Temperatureday4 + "</td>" +
			"<td>" + Temperatureday5 + "</td><tr><td>Weather</td><td>" + weathertypeday1 + "</td><td>" + weathertypeday2 + "</td>	<td>" + weathertypeday3 + "</td>	<td>" + weathertypeday4 + "</td>" +
			"<td>" + weathertypeday5 + "</td><tr><td>Description</td><td>" + weatherDescriptionday1 + "</td><td>" + weatherDescriptionday2 + "</td><td>" + weatherDescriptionday3 + "</td>" +
			"<td>" + weatherDescriptionday4 + "</td><td>" + weatherDescriptionday5 + "</td>	</table></p> "


		//Prints out my data into my HTML. I use the same ID for printing out my single day and my weekly. This is so when I decide to print daily after I printed weekly
		//the data is replaced with the new data and vice versa
		$("#outputday1").innerHTML = outputString;


	}

	//Below is where I create my charts, these are refrenced in the report.
	//This is what creates my chart for the data and calls it windchart
	var windChart =
	{	//Makes the type of chart a pie chart
		type: "pie",
		data:
		{
			//Sets the labels.
			labels: ['Today', 'Tomorrow', 'The Day After'],
			datasets:
				[
					{	//Fills the chart with data for wind speed for the next 5 days
						label: 'Wind Speed',
						data: [data.list[0].wind.speed, data.list[7].wind.speed, data.list[15].wind.speed, ],
						backgroundColor: "rgba(137,207,240)"
					}]
		}
	}

	var chart1 = $("#Chart1").getContext('2d');
	var myChart = new Chart(chart1, windChart);


	var tempChart = {
		type: "bar", data: {
			labels: ['Today', 'Tomorrow', 'The Day After'],
			datasets:
				[{
					label: 'Temperature',
					data:
						[data.list[0].main.temp, data.list[7].main.temp, data.list[15].main.temp, ],
					backgroundColor: "rgba(206, 32, 41)"
				}]
		}
	}
	var chart2 = $("#Chart2").getContext('2d');
	var myChart2 = new Chart(chart2, tempChart);


};


document.addEventListener("DOMContentLoaded", () => {





	//On clicking of the "go " button, prints weather data, with checks for ceclius/fahrenheit and daily/weekly
	$("#Button1").addEventListener("click", () => {

		printWeather();

	})
	//Geolocation button, this prints out data based on geolocation and prints out current location on google maps
	$("#geoButton").addEventListener("click", () => {
		getLocation();
		initMap();
	})

}
)







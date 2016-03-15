var humidity = 50;
var temp_list = new Array();
var best_humidity = new Array();
var Temperature_list = new Array();
var last_list = new Array();

var gender = "male";
var temper = 21;

get_cities(gender);







function get_cities(gender){
if(gender=="male") {
	temper = 21;}
if(gender=="female") {
	temper = 22;}
	
	$.ajax({
	 //url: "http://api.openweathermap.org/data/2.1/find/city",
	 url: "weather.json",
	 dataType: "json",
	 timeout: 10000, 
     crossDomain: true, 
	 data: {
	 	bbox:"-180,90,180,-90,10",
	 	units:"metric",
	 	mode:"json",
	 	cluster:"yes",
	 	APPID:"806a11197dbdfbd7f81f86ffb1fbb565",
	 },
	 success: function( response ) {

	 	global_response = response.list;
	 	return parse_response(global_response);
	 },
	error: function(error){console.log(error);}
	});
}




function parse_response(list){
	var i=0;
 	do{
 		var current_temp = list[i].main.temp-273.15;
 		var current_humidity = list[i].main.humidity;
 		var current_icon = list[i].weather[0].icon;
 		var newArray = {
 			id 		:list[i].id,
 			name	:list[i].name,
 			temp	:current_temp,
 			humidity:current_humidity,
 			icon 	:current_icon
 		}
			temp_list.push(newArray);
 		i++;
 	}while(i<list.length);
	temp_list = _(temp_list).sortBy(function(obj) { return parseInt(obj.temp, 10) });
	return get_nearest(temp_list,5,"temp",temper);
}









function get_nearest(data,num,method,value){
temp_data = data;
	
//Let's Get a list of 10 cities that got the Optimal Temperature
	a=0;
	do{
		var best_temp = getClosest_temp(temp_data, temper);
		temp_data.splice(_.indexOf(temp_data, _.findWhere(temp_data, { id : best_temp["id"]})), 1);
		Temperature_list.push(best_temp);
		a++;
	} while(a<(num*2));
	console.log("Best Temperature - "+num*2+" last Items");
	console.log(Temperature_list);

	var temp_list = Temperature_list;
//NOW We'll Reduce the last list to the Optimal Humidity
	b=0;
	do{
		best_humidity = getClosest_humidity(temp_list, humidity);
		temp_list.splice(_.indexOf(temp_list, _.findWhere(temp_list, { id : best_humidity["id"]})), 1);
		last_list.push(best_humidity);
		b++;
	} while(b<num);
	
	console.log("Best Humidity - "+num+" last Items");
	console.log(last_list);
	populate();
return last_list;

}

function getClosest_temp(array, target) {
    var temporary = _.map(array, function(val,i) {
        return [val, Math.abs(val.temp - target),i];
    });
    var get = _.reduce(temporary, function(memo, val,i) {
    	var me = i;
        return (memo[1] < val[1]) ? memo : val;
    }, [-1, 999])[0],i;
    return get;
}

function getClosest_humidity(array, target) {
    var temporary = _.map(array, function(val,i) {
        return [val, Math.abs(val.humidity - target),i];
    });
    var get = _.reduce(temporary, function(memo, val,i) {
    	var me = i;
        return (memo[1] < val[1]) ? memo : val;
    }, [-1, 999])[0],i;
    return get;
}


function populate(){
	
	$('.best_city h1.city_name').text(last_list[0].name);
	$('.best_city').find('.details .temp span').text(last_list[0].temp.toFixed(1)+"°C");
	$('.best_city').find('.details .humidity span').text(last_list[0].humidity+"%");
	$('.best_city').find('.details .condition_icon').html('<img src="http://openweathermap.org/img/w/'+last_list[0].icon+'.png" />');
	for (x=1;x<5;x++){ 
		$(".more_city[value='"+x+"']").find('h4.city_name').text(last_list[x].name);
		$(".more_city[value='"+x+"']").find('.temp').text(last_list[x].temp.toFixed(1)+"°C");
		$(".more_city[value='"+x+"']").find('.humidity').text(last_list[x].humidity+"%");
		$(".more_city[value='"+x+"']").find('.condition_icon').prepend('<img src="http://openweathermap.org/img/w/'+last_list[x].icon+'.png" />');

	}
}
$("#change_gender").click(function() {
		humidity = 50;
		temp_list = [];
		best_humidity = [];
		Temperature_list = [];
		last_list = [];
		var gender = "male";
		var temper = 21;
	mygender = $(this).attr('data-gender');
	  if($('body').hasClass("male")){
	  	get_cities("female");
	  	$('body').removeClass('male').addClass('female');
	  	$('.change_gender').text("For Women");
	  } else {
		get_cities("male");
	  	$('body').addClass('male').removeClass('female');
	  	$('.change_gender').text("For Men");

	  };
	});


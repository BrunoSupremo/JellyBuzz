let timeout = false
let timeline_end = 30000
let timeline_position = 0
let timeline_direction = 1 // 1 = forward, 0 = stuck in place, -1 = reverse

let loop_type = "restart"

let start_button = document.querySelector("#start")
let restart_button = document.querySelector("#restart")

let begin_min_vibrate_on = document.querySelector("#begin .vibrate_on .min input")
let begin_max_vibrate_on = document.querySelector("#begin .vibrate_on .max input")
let begin_min_vibrate_off = document.querySelector("#begin .vibrate_off .min input")
let begin_max_vibrate_off = document.querySelector("#begin .vibrate_off .max input")
let end_min_vibrate_on = document.querySelector("#end .vibrate_on .min input")
let end_max_vibrate_on = document.querySelector("#end .vibrate_on .max input")
let end_min_vibrate_off = document.querySelector("#end .vibrate_off .min input")
let end_max_vibrate_off = document.querySelector("#end .vibrate_off .max input")

function start(){
	clearTimeout(timeout);
	timeline_position = 0
	vibrate_on(0)
	restart_button.style.display="initial"
}

function vibrate_on(timer){
	navigator.vibrate(timer);
	start_button.classList.add("vibrating");
	timeline_position += timer * timeline_direction
	timeout = setTimeout(function (){
		check_timeline()
		let amount_of_time_off = random_off_time();
		vibrate_off(amount_of_time_off)
	}, timer);
}
function vibrate_off(timer){
	start_button.classList.remove("vibrating");
	timeline_position += timer * timeline_direction
	timeout = setTimeout(function (){
		check_timeline()
		let amount_of_time_on = random_on_time();
		vibrate_on(amount_of_time_on)
	}, timer);
}

function stop(){
	clearTimeout(timeout);
	navigator.vibrate(0)
	start_button.classList.remove("vibrating");
	restart_button.style.display="none"
}

function check_timeline(){
	if(timeline_position <= 0){
		timeline_position = 0
		timeline_direction = 1
	}
	if(timeline_position >= timeline_end){
		if(loop_type == "restart"){
			timeline_position = 0
			timeline_direction = 1
		}
		if(loop_type == "continue"){
			timeline_position = timeline_end
			timeline_direction = 0
		}
		if(loop_type == "reverse"){
			timeline_position = timeline_end
			timeline_direction = -1
		}
	}
}

function save_settings(){
	localStorage.setItem("begin_min_vibrate_on", begin_min_vibrate_on.value)
	localStorage.setItem("begin_max_vibrate_on", begin_max_vibrate_on.value)
	localStorage.setItem("begin_min_vibrate_off", begin_min_vibrate_off.value)
	localStorage.setItem("begin_max_vibrate_off", begin_max_vibrate_off.value)
	localStorage.setItem("end_min_vibrate_on", end_min_vibrate_on.value)
	localStorage.setItem("end_max_vibrate_on", end_max_vibrate_on.value)
	localStorage.setItem("end_min_vibrate_off", end_min_vibrate_off.value)
	localStorage.setItem("end_max_vibrate_off", end_max_vibrate_off.value)

	let session_minutes = document.querySelector("#session #minutes")
	let session_seconds = document.querySelector("#session #seconds")
	localStorage.setItem("minutes", session_minutes.value)
	localStorage.setItem("seconds", session_seconds.value)
	timeline_end = session_minutes.value*60000 + session_seconds.value*1000

	let loop_restart = document.querySelector("#loop_restart")
	let loop_continue = document.querySelector("#loop_continue")
	let loop_reverse = document.querySelector("#loop_reverse")
	if(loop_restart.checked){
		localStorage.setItem("loop_type", "restart")
		loop_type = "restart"
	}
	if(loop_continue.checked){
		localStorage.setItem("loop_type", "continue")
		loop_type = "continue"
	}
	if(loop_reverse.checked){
		localStorage.setItem("loop_type", "reverse")
		loop_type = "reverse"
	}
}

function on_load(){
	if(localStorage.loop_type == undefined){
		return false
	}

	begin_min_vibrate_on.value = localStorage.getItem("begin_min_vibrate_on")
	begin_max_vibrate_on.value = localStorage.getItem("begin_max_vibrate_on")
	begin_min_vibrate_off.value = localStorage.getItem("begin_min_vibrate_off")
	begin_max_vibrate_off.value = localStorage.getItem("begin_max_vibrate_off")
	end_min_vibrate_on.value = localStorage.getItem("end_min_vibrate_on")
	end_max_vibrate_on.value = localStorage.getItem("end_max_vibrate_on")
	end_min_vibrate_off.value = localStorage.getItem("end_min_vibrate_off")
	end_max_vibrate_off.value = localStorage.getItem("end_max_vibrate_off")

	let session_minutes = document.querySelector("#session #minutes")
	let session_seconds = document.querySelector("#session #seconds")
	session_minutes.value = localStorage.getItem("minutes")
	session_seconds.value = localStorage.getItem("seconds")
	timeline_end = session_minutes.value*60000 + session_seconds.value*1000

	loop_type = localStorage.getItem("loop_type")
	let loop_restart = document.querySelector("#loop_restart")
	let loop_continue = document.querySelector("#loop_continue")
	let loop_reverse = document.querySelector("#loop_reverse")
	loop_restart.checked = loop_type == "restart"
	loop_continue.checked = loop_type == "continue"
	loop_reverse.checked = loop_type == "reverse"
}

function interpolate(valueStart, valueEnd, timeStart, timeEnd, time) {
	return Number(valueStart) + (time - timeStart) * ((valueEnd - valueStart) / (timeEnd - timeStart))
}

function random_off_time(){
	let mins_interpolated = interpolate(
		begin_min_vibrate_off.value, end_min_vibrate_off.value, 0, timeline_end, timeline_position)
	let maxs_interpolated = interpolate(
		begin_max_vibrate_off.value, end_max_vibrate_off.value, 0, timeline_end, timeline_position)

	let random_between_the_mins_and_maxs = interpolate(
		mins_interpolated, maxs_interpolated, 0, 1, Math.random())
	return random_between_the_mins_and_maxs
}
function random_on_time(){
	let mins_interpolated = interpolate(
		begin_min_vibrate_on.value, end_min_vibrate_on.value, 0, timeline_end, timeline_position)
	let maxs_interpolated = interpolate(
		begin_max_vibrate_on.value, end_max_vibrate_on.value, 0, timeline_end, timeline_position)

	let random_between_the_mins_and_maxs = interpolate(
		mins_interpolated, maxs_interpolated, 0, 1, Math.random())
	return random_between_the_mins_and_maxs
}
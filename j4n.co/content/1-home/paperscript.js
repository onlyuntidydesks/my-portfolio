
var window_width = window.innerWidth; 
var window_height = window.innerHeight;
var rect = new Path.Rectangle(0,0,window_width,window_height); 

var path = new Path();
var start = new Point(0, 0);
path.moveTo(start);
var path_points = []
path_points.push([0,0])

var sqr = 100; 
var delta_ratio= 1.5; 
var tolerance = 40; 
var j = 0; 
var i = 0;  


for (i; i < window_height; i+=sqr){
	if ((i/sqr)%2 == 0){
		for (j; j<=window_width; j+=sqr){
			path.lineTo(start + [j, i])	
			path_points.push([j,i])
		}
	} else {
		for (j; j>=0; j-=sqr){
			path.lineTo(start + [j, i])	
			path_points.push([j,i])
		}
	}
}

for (var i=0; i < window_width; i+=sqr){
	if ((i/sqr)%2 == 0){
		for (j; j< window_height; j+=sqr){
			path.lineTo(start + [i, j])	
			path_points.push([i, j])
		}
	} else {
		for (j; j>=0; j-=sqr){
			path.lineTo(start + [i, j])	
			path_points.push([i, j])
		}
	}
}


path.fillColor = 'rgba(255,255, 255, .5)'

path.fillColor = {
    gradient: {
        stops: [['rgba(255,255, 255, .5)', 0], ['rgba(255,255, 255, 0.8)', 0.5]],
        radial: false
    },
    origin: path.bounds.bottomCenter,
    destination: path.bounds.topCenter
};


rect.fillColor= {
    gradient: {
        stops: [['#333342', 0], ['#1D1D25', 1]],
        radial: false
    },
    origin: rect.bounds.bottomCenter,
    destination: rect.bounds.topCenter
};

path.original_path_points = path_points; 
path.affected_points = []; 

var hitOptions = {
	segments: true,
	stroke: true,
	fill: true,
	tolerance:tolerance
}

function onMouseMove(event, path_points) {


    var hitResult = project.hitTest(event.point, hitOptions);
    
    if (hitResult && hitResult.type == 'segment') {
    	var segment = hitResult.segment;

    	var points = []
    	
    	hitResult.item.segments.forEach(function(s, i){
    		if(s.point == segment.point) {
    			points.push(i); 
    		}
    	})

    	points.forEach(function(i){
	    	hitResult.item.segments[i].point += (event.delta / delta_ratio)
	    	if (hitResult.item.affected_points.indexOf(i) === -1 ){
	    		hitResult.item.affected_points.push(i)			    		
	    	}
    	})
    } 

}

function onFrame(event) {

	for (var i = path.affected_points.length - 1; i >= 0; i--) {
		var val = path.affected_points[i]; 
		var point =  path.segments[val].point 
		var original_location = path.original_path_points[val]
		var diff = point -  original_location; 
		diff = diff.round(); 
		path.segments[val].point  -= (diff / 300 ); 
		if (diff.isZero()){
			point = original_location; 
			path.affected_points.splice(i, 1);
		}
	}
}
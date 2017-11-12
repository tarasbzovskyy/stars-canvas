$ = jQuery;
$(document).ready(function() {


	function createCanvas() {
"use strict";
		var canvas = document.getElementById("canva"),
 			ctx = canvas.getContext('2d'),
 			w = canvas.width = window.innerWidth, //canv dimmention
      		h = canvas.height = window.innerHeight, //canv dimmention
      		dots = [], 
      		int = 0,
      		color = '#fff',
      		notZoom = true,
      		hue = 220,
      		max = 1000; // count of elements


  	    var canvasDots = document.createElement('canvas'),
    		ctx2 = canvasDots.getContext('2d');
        	canvasDots.width = 1000;
        	canvasDots.height = 1000;

        	var half = canvasDots.width/2,
        		gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
        		 gradient2.addColorStop(0.1, 'rgb(230, 230, 230)');
		        gradient2.addColorStop(0.2, 'hsl(' + hue + ', 61%, 33%)');
		        gradient2.addColorStop(0.3, 'hsl(' + hue + ', 64%, 6%)');
		        gradient2.addColorStop(0.5, 'hsl(' + hue + ', 71%, 5%');
        		gradient2.addColorStop(1, 'transparent');
		        ctx2.fillStyle = gradient2;
		        ctx2.beginPath();
		        ctx2.arc(half, half, half, 0, Math.PI * 2);
		        ctx2.fill();


	 	function orbit(x,y) {
      			var max = Math.max(x,y),
          		diameter = Math.round(Math.sqrt(max*max + max*max));
      			return diameter/2;
   		}

   		function random(min, max) {
		      if (arguments.length < 2) {
		        max = min;
		        min = 0;
		      }

		      if (min > max) {
		        var hold = max;
		        max = min;
		        min = hold;
		      }

      		  return Math.floor(Math.random() * (max - min + 1)) + min;
    	}

	    var Dot = function() {
		      this.orbitRadius = random(orbit(w,h));
		      // this.radius = random(10, this.orbitRadius) / 20;
		     // this.radius = 7; // size of each star *(dot)
		      this.radius = random(10,15);
		      this.locX = w / 2;
		      this.locY = h / 2;
		      this.randMax = random(0, max);
		      this.speed = random(this.orbitRadius) / 400000;
		      this.alpha = random(2, 8) / 8;
		      this.flip = false;
		      int++;
		      dots[int] = this;
		      // console.log(this.orbitRadius);
    	}

    	Dot.prototype.draw = function() {
		      var x = Math.sin(this.randMax) * this.orbitRadius + this.locX,
		          y = Math.cos(this.randMax) * this.orbitRadius + this.locY,
		          randInt = random(10);

		      if (randInt === 1 && this.alpha > 0 && this.flip == false) {
		        this.alpha -= 0.05;
		      } else if (randInt === 2 && this.alpha < 1 && this.flip == false) {
		        this.alpha += 0.05;
		      }

		      ctx.globalAlpha = this.alpha;
		        ctx.drawImage(canvasDots, x - this.radius / 100, y - this.radius / 100, this.radius, this.radius);
		      this.randMax -= this.speed;
   	 	}

 	    Dot.prototype.spin = function() {
		      var x = Math.sin(this.randMax) * this.orbitRadius + this.locX,
		          y = Math.cos(this.randMax) * this.orbitRadius + this.locY;

		      this.alpha = 1;
		      ctx.globalAlpha = this.alpha;
		        ctx.drawImage(canvasDots, x - this.radius / 10, y - this.radius / 10, this.radius, this.radius);
		      this.randMax -= this.speed;
   		}

    	for (var i = 0; i < max; i++) {
      		new Dot();
    	}

		Dot.prototype.stop = function(int) {
		      this.flip = true;
		      this.speed = 0;
	    }

	    Dot.prototype.continue = function(int) {
		      this.flip = false;
		      this.speed = random(this.orbitRadius) / 400000;
	    }	

		function begin() {
		        ctx.globalCompositeOperation = 'source-over'; // was before
		        ctx.globalAlpha = 0.8;
		        ctx.fillStyle = "#0B0A12";
		        if(notZoom) {
		          ctx.fillRect(0, 0, w, h);
		        }
		      ctx.globalCompositeOperation = 'lighter'; // was before
			// ctx.globalCompositeOperation = 'lighten'; // was after
			// ctx2.globalCompositeOperation = 'hard-light'; // was after

		      for (var i = 1, l = dots.length; i < l; i++) {
		        dots[i].draw();
		      }


		      window.requestAnimationFrame(begin);
	    }	

	    function reset() {
		      ctx.clearRect(0,0,canvas.height, canvas.width);
		      ctx2.clearRect(0,0,canvas.height, canvas.width);
		      dots = [];
		      createCanvas();
    	}

	
		begin();

		function zoomRotate() {
			notZoom = false;
			for (var i = 1, l = dots.length; i < l; i++) {
				dots[i].draw = dots[i].spin;
				dots[i].speed *= 10;
			}
		}

		$(window).resize(function() {
			clearTimeout(this.id);
			this.id = setTimeout(reset, 500);
		});

		 $('#canva').on('click',function(int) {

		 	if (!$(this).hasClass('pause')) {
		 		$(this).addClass('pause');
                 for (var i = 1, l = dots.length; i < l; i++) {
	             	dots[i].stop(i);
	       		};
				//zoomRotate()
			} else {
		 		$(this).removeClass('pause');
                 for (var i = 1, l = dots.length; i < l; i++) {
	             	dots[i].continue(i);
	       		};
				//begin();
		 	}
		 })

		// $('#canva').hover(function(int) {
		// 	if (!$(this).hasClass('pause')) {
		// 		$(this).addClass('pause');
		// 		for (var i = 1, l = dots.length; i < l; i++) {
		// 			ctx.globalCompositeOperation = 'lighten';
		// 			ctx2.globalCompositeOperation = 'hard-light';
		// 		}
		// 		ctx.globalCompositeOperation = 'lighten';
		// 		ctx2.globalCompositeOperation = 'hard-light';
        //
		// 	}
		// }, function(){
		// 	if ($(this).hasClass('pause')) {
		// 		$(this).removeClass('pause');
		// 		for (var i = 1, l = dots.length; i < l; i++) {
		// 			ctx.globalCompositeOperation = 'source-over';
		// 			ctx.globalCompositeOperation = 'lighter';
		// 		}
		// 		ctx.globalCompositeOperation = 'source-over';
		// 		ctx2.globalCompositeOperation = 'lighter';
		// 	}
		// })
	}

	//createCanvas()

		setTimeout(function(){
			$('.logo-loading').addClass('start');
		},300)

})
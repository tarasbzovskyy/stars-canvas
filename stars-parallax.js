$ = jQuery;
$(document).ready(function() {


	var Stars;
(function (Stars) {
    function random(min, max) {
        if (max === void 0) { max = 0; }
        if (min > max) {
            var t = min;
            min = max;
            max = t;
        }
        return min + Math.random() * (max - min);
    }
    var hue = 216,
        blinkRatio = .01,
        starSize = 200, // stars size
        speed = 1, // Speed (% of star radius)
        starCount = 1000;
    function hypotenuse(width, height) {
        return Math.sqrt(width * width + height * height);
    }
    var Star = (function () {
        function Star() {
            this.orbitRadiusPercent = Math.random();
            this.resize();
            this.radiusPercent = random(this.orbitRadius / this.maxOrbitRadius);
            this.radius = starSize * this.radiusPercent;
            this.timePassed = random(2 * Math.PI);
            // angle = angle to move half of the star 
            var angle = 2 * Math.asin(this.radius / (2 * this.orbitRadius));
            this.speed = random(angle / 32, angle / 64) * speed;
            this.alpha = random(.1, .4);
        }
        Star.prototype.draw = function (stars) {
            var x = Math.sin(this.timePassed) * this.orbitRadius - this.radius / 2, y = Math.cos(this.timePassed) * this.orbitRadius - this.radius / 2;
            x += (1 - this.radiusPercent) * stars.parallax.x;
            y += (1 - this.radiusPercent) * stars.parallax.y;
            stars.ctx.globalAlpha = this.alpha + (Math.random() > blinkRatio ? 0 : .6);
            stars.ctx.drawImage(this.canvas, x, y, this.radius, this.radius);
            this.timePassed += this.speed;
        };
        Star.prototype.resize = function () {
            this.orbitRadius = this.orbitRadiusPercent * this.maxOrbitRadius;
        };
        return Star;
    })();
    var Canvas = (function () {
        function Canvas(canvas) {
            this.stars = [];
            this.mouse = { x: 0, y: 0 };
            this.parallax = { x: 0, y: 0 };
            var self = this;
            this.canvas = canvas;
            this.ctx = canvas.getContext("2d");
            this.resize();
            // Create stars
            for (var i = 0; i < starCount; i++) {
                this.stars[this.stars.length] = new Star();
            }
            this.canvas.addEventListener('mousemove', function (e) {
                self.mouse.x = e.clientX;
                self.mouse.y = e.clientY;
            });
            this.canvas.addEventListener('click', function (e) {
                self.pause = !self.pause;
            });
            window.addEventListener('resize', this.resize.bind(this));
            this.pause = false;
        }
        Object.defineProperty(Canvas.prototype, "pause", {
            get: function () {
                return this._pause;
            },
            set: function (pause) {
                this._pause = pause;
                if (!pause)
                    this.animation();
            },
            enumerable: true,
            configurable: true
        });
        Canvas.prototype.resize = function () {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            Star.prototype.maxOrbitRadius = hypotenuse(this.canvas.width, this.canvas.height);
            for (var i = 0; i < this.stars.length; i++) {
                this.stars[i].resize();
            }
        };
        Canvas.prototype.animation = function () {
            if (this.pause)
                return;
            this.parallax.x += (this.mouse.x - this.parallax.x) / 60;
            this.parallax.y += (this.mouse.y - this.parallax.y) / 60;
            // this.ctx.globalCompositeOperation = 'destination-out';
            // this.ctx.globalCompositeOperation = 'xor';
            // this.ctx.globalCompositeOperation = 'multiply';
            // this.ctx.globalCompositeOperation = 'lighten'; // drawning line
            // this.ctx.globalCompositeOperation = 'hard-light'; //zbs
            // this.ctx.globalCompositeOperation = 'difference'; // COMETA SUKA !
            // this.ctx.globalCompositeOperation = 'hue'; // drawning not bad
            // this.ctx.globalCompositeOperation = 'saturation'; // drawning not bad too
            this.ctx.globalCompositeOperation = 'luminosity'; // drawning not bad too
            this.ctx.globalAlpha = .4;
            this.ctx.fillStyle = 'hsl(' + hue + ', 60%, 10%)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.globalCompositeOperation = 'lighter';
            for (var i = 0; i < this.stars.length; i++) {
                this.stars[i].draw(this);
            }
            window.requestAnimationFrame(this.animation.bind(this));
        };
        return Canvas;
    })();
    Stars.Canvas = Canvas;
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    // Star Resolution
    canvas.width = starSize;
    canvas.height = starSize;
    var radius = starSize / 2, gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(.08, '#fff');
    gradient.addColorStop(.1, 'hsl(' + hue + ', 60%, 20%)');
    gradient.addColorStop(.2, 'hsl(' + hue + ', 60%, 10%)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(radius, radius, radius, 0, Math.PI * 2);
    ctx.fill();
    Star.prototype.canvas = canvas;
    Star.prototype.ctx = ctx;
})(Stars || (Stars = {}));

var stars = new Stars.Canvas(document.getElementById('stars'));

})
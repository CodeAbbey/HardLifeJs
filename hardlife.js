function HardLife(opts) {
    this.size = 2;
    this.w = 251;
    this.h = 151;
    this.cells = [];
    if (typeof(opts) == 'object') {
        for (var key in opts) {
            this[key] = opts[key];
        }
    }
    this.init();
}

HardLife.prototype.init = function() {
    var canvas = document.getElementById('demo');
    this.setupGeometry(canvas);
    this.ctx = canvas.getContext('2d');
    this.ch = new CanvasHelper(canvas, this.ctx);
    this.initialSetup();
    this.draw();
}

HardLife.prototype.setupGeometry = function(canvas) {
    canvas.width = this.size * this.w;
    canvas.height = this.size * this.h;
}

HardLife.prototype.initialSetup = function() {
    this.pattern(0, 0, [0, 0, -1, 0, 0, -1, 0, 1, 1, 1]);
}

HardLife.prototype.pattern = function(x, y, p) {
    for (var i = 0; i < p.length; i += 2) {
        var px = p[i] + x;
        var py = p[i + 1] + y;
        this.cells[px + ' ' + py] = 1;
    }
}

HardLife.prototype.draw = function() {
    var ctx = this.ctx;
    ctx.fillStyle = '#000088';
    ctx.fillRect(0, 0, this.w * this.size, this.h * this.size);
    var cx = Math.floor(this.w / 2) * this.size;
    var cy = Math.floor(this.h / 2) * this.size;
    ctx.fillStyle = '#FFFF00';
    for (var c in this.cells) {
        var xy = c.split(' ');
        var x = cx + (xy[0] * this.size);
        var y = cy - (xy[1] * this.size);
        ctx.fillRect(x, y, this.size, this.size);
    }
}


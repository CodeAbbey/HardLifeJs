function HardLife(opts) {
    this.presets();
    this.size = 2;
    this.w = 251;
    this.h = 151;
    if (typeof(opts) == 'object') {
        for (var key in opts) {
            this[key] = opts[key];
        }
    }
    this.init();
}

HardLife.prototype.presets = function() {
    this.neighs = [];
    for (var i = 0; i < 9; i++) {
        var c = {x: i % 3 - 1, y: Math.floor(i / 3) - 1};
        if (c.x != 0 || c.y != 0) {
            this.neighs.push(c);
        }
    }
}

HardLife.prototype.init = function() {
    var canvas = document.getElementById('demo');
    this.setupGeometry(canvas);
    this.ctx = canvas.getContext('2d');
    this.ch = new CanvasHelper(canvas, this.ctx);
    this.initialSetup();
    this.draw();
    var self = this;
    canvas.onmousedown = function(e) {self.click(e)};
}

HardLife.prototype.setupGeometry = function(canvas) {
    canvas.width = this.size * this.w;
    canvas.height = this.size * this.h;
}

HardLife.prototype.initialSetup = function() {
    this.cells = [];
    this.count = 0;
    if (Math.random() > 0.5) {
        this.pattern(0, 0, [0, 0, -1, 0, 0, -1, 0, 1, 1, 1]);
    } else {
        this.pattern(0, 0, [0, 0, 1, 0, 1, 2, 3, 1, 4, 0, 5, 0, 6, 0]);
    }
    var delta = Math.floor(Math.random() * 20) + 50;
    var offs = Math.floor(Math.random() * 20) - 10;
    this.pattern(offs - delta, delta, [-2, 0, -1, 0, 0, 0, 0, 1, -1, 2]);
    this.moves = 0;
}

HardLife.prototype.pattern = function(x, y, p) {
    for (var i = 0; i < p.length; i += 2) {
        var px = p[i] + x;
        var py = p[i + 1] + y;
        var cell = px + ' ' + py;
        if (!this.cells[cell]) {
            this.cells[cell] = 1;
            this.count += 1;
        }
    }
}

HardLife.prototype.draw = function() {
    var ctx = this.ctx;
    ctx.font = "12pt Arial";
    ctx.textBaseLine = "bottom";
    ctx.textAlign = "left";
    ctx.fillStyle = '#000088';
    ctx.fillRect(0, 0, this.w * this.size, this.h * this.size);
    ctx.fillStyle = '#00C000';
    ctx.fillText(this.count, 0, this.h * this.size - 1);
    ctx.textAlign = "right";
    ctx.fillText(this.moves, this.w * this.size - 1, this.h * this.size - 1);
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

HardLife.prototype.step = function() {
    var dead = this.generateDead();
    var born = this.generateBorn();
    for (var dcell in dead) {
        delete this.cells[dcell];
        this.count -= 1;
    }
    for (var bcell in born) {
        this.cells[bcell] = 1;
        this.count += 1;
    }
    this.moves += 1;
    this.draw();
}

HardLife.prototype.generateDead = function() {
    var dead = [];
    for (var cell in this.cells) {
        var ns = this.countNeighs(cell);
        if (ns < 2 || ns > 3) {
            dead[cell] = 1;
        }
    }
    return dead;
}

HardLife.prototype.generateBorn = function() {
    var emneis = this.generateEmptyNeighs();
    var res = [];
    for (var nei in emneis) {
        if (this.countNeighs(nei) == 3) {
            res[nei] = 1;
        }
    }
    return res;
}

HardLife.prototype.generateEmptyNeighs = function() {
    var res = [];
    var self = this;
    for (var cell in this.cells) {
        this.enumNeighs(cell, function(x, y) {
            var xy = x + ' ' + y;
            if (!self.cells[xy]) {
                res[x + ' ' + y] = 1;
            }
        });
    }
    return res;
}

HardLife.prototype.countNeighs = function(cell) {
    var res = 0;
    var self = this;
    this.enumNeighs(cell, function(x, y) {
        if (self.cells[x + ' ' + y]) {
            res++;
        }
    });
    return res;
}

HardLife.prototype.enumNeighs = function(cell, f) {
    var xy = cell.split(' ');
    var x = xy[0] * 1;
    var y = xy[1] * 1;
    var res = 0;
    for (var i in this.neighs) {
        var nr = this.neighs[i];
        f(nr.x + x, nr.y + y);
    }
}

HardLife.prototype.run = function() {
    var self = this;
    var runner = function() {
        if (!self.running) {
            return;
        }
        self.step();
        setTimeout(runner, 50);
    }

    if (this.running) {
        delete this.running;
    } else {
        this.running = true;
        runner();
    }
}

HardLife.prototype.oneStep = function() {
    if (this.running) {
        return;
    }
    step();
}

HardLife.prototype.reset = function() {
    if (this.running) {
        this.run();
    }
    this.initialSetup();
    this.draw();
}

HardLife.prototype.click = function(event) {
    if (this.running) {
        return;
    }
    event.preventDefault();
    var pos = this.ch.posFromEvent(event);
    pos.x -= Math.floor(this.w / 2) * this.size;
    pos.y -= Math.floor(this.h / 2) * this.size;
    pos.x = Math.floor(pos.x / this.size);
    pos.y = - Math.floor(pos.y / this.size) + 1;
    var cell = pos.x + ' ' + pos.y;
    if (this.cells[cell]) {
        delete this.cells[cell];
        this.count -= 1;
    } else {
        this.cells[cell] = 1;
        this.count += 1;
    }
    this.draw();
}


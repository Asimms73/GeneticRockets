class Rocket {

  dirs = ['u', 'ur', 'l', 'dl', 'd', 'dr', 'r', 'ul'];
  genes = [];
  pos = createVector(width / 2, height * .95);
  vel = createVector();
  acc = createVector();
  f = .1;
  f45 = this.f / Math.sqrt(2);
  fitness = 0;
  completed = false;
  crashed = false;

  constructor(maxCount, target, genes) {
    this.maxCount = maxCount;
    this.target = target;
    if (genes) {
      this.genes = genes
    }
    else {
      for (let i = 0; i < this.maxCount; i++) {
        this.genes[i] = this.dirs[Math.floor(Math.random() * this.dirs.length)];
      }
    }
  }

  applyForce(x, y) {
    this.acc.add(createVector(x, y));
  }

  applyThrustUp(f) {
    this.applyForce(0, -f);
  }

  applyThrustRight(f) {
    this.applyForce(f, 0);
  }

  Thrust(currentCount) {
    switch (this.genes[currentCount]) {
      case 'u':
        this.applyThrustUp(this.f);
        break;
      case 'ur':
        this.applyThrustUp(this.f45);
        this.applyThrustRight(this.f45);
        break;
      case 'r':
        this.applyThrustRight(this.f);
        break;
      case 'dr':
        this.applyThrustRight(this.f45);
        this.applyThrustUp(-this.f45);
        break;
      case 'd':
        this.applyThrustUp(-this.f);
        break;
      case 'dl':
        this.applyThrustUp(-this.f45);
        this.applyThrustRight(-this.f45);
        break;
      case 'l':
        this.applyThrustRight(-this.f);
        break;
      case 'ul':
        this.applyThrustUp(this.f45);
        this.applyThrustRight(-this.f45);
        break;
    }
  }

  update(currentCount) {
    var d = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
    if (d < 16) {
      this.completed = true;
      this.pos = target.copy();
    }

    for( let square of squares){
      if(this.pos.x > square.x && this.pos.x < square.x + square.w
        && this.pos.y < square.y && this.pos.y > square.y + square.h){
          this.crashed = true;
      }
    }

    for (let c of circles) {
      if(dist(this.pos.x, this.pos.y, c.x, c.y) < (c.d/2)){
        this.crashed = true;
      }
  }


    if(!insideCanvas(this.pos.x, this.pos.y)){
      this.crashed = true;
    }

    this.Thrust(currentCount);

    if (!this.completed && !this.crashed) {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

  }

  show() {
    push();
    noStroke();
    fill(200);
    translate(this.pos.x, this.pos.y);
    rectMode(CENTER);
    rotate(this.vel.heading());
    rect(0, 0, 25, 5);
    pop();
  }

  calcFit() {
    var d = dist(this.pos.x, this.pos.y, this.target.x, this.target.y);
    this.fitness = map(d, 0, width, width, 0);

    if (this.completed) {
      this.fitness *= 10;
      console.log("Target Reached");
    }

    if(this.crashed){
      this.fitness *= .0001;
    }

    

  }

  crossover(partner) {
    var newGenes = [];
    var mid = floor(random(this.genes.length));
    for (let i = 0; i < this.genes.length; i++) {
      if (i > mid) {
        newGenes[i] = this.genes[i];
      } else {
        newGenes[i] = partner.genes[i];
      }
    }
    var newRocket = new Rocket(this.maxCount, this.target, newGenes);
    return newRocket;
  }

  mutate() {
    for (let i = 0; i < this.genes.length; i++) {
      if (random(1) < 0.01) {
        this.genes[i] = this.dirs[Math.floor(Math.random() * this.dirs.length)]
      }
    }
  }
}
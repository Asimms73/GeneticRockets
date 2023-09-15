class Pool {

    rockets = [];
    matingPool = [];

    constructor(popSize, maxCount, target) {
        this.popSize = popSize;
        this.maxCount = maxCount;
        this.target = target;
    }

    populate() {
        for (let i = 0; i < this.popSize; i++) {
            this.rockets[i] = new Rocket(this.maxCount, this.target);
        }
    }

    run(currentCount) {
        for (let i = 0; i < this.popSize; i++) {
            this.rockets[i].update(currentCount);
            this.rockets[i].show();
        }
    }

    evaluate() {
        this.matingPool = [];
        var maxFit = 0;

        
        for (let i = 0; i < this.popSize; i++) {
            this.rockets[i].calcFit(this.target);
            if (this.rockets[i].fitness > maxFit) {
                maxFit = this.rockets[i].fitness;
            }
        }


        for (let i = 0; i < this.popSize; i++) {
            this.rockets[i].fitness /= maxFit;
        }

        for (let i = 0; i < this.popSize; i++) {
            var n = this.rockets[i].fitness * 10;
            for (let j = 0; j < n; j++) {
                this.matingPool.push(this.rockets[i]);
            }
        }

        

        return maxFit;
    }

    selection() {
        var newRockets = [];

        for (let i = 0; i < this.rockets.length; i++) {
            var parentA = random(this.matingPool);
            var parentB = random(this.matingPool);
            var child = parentA.crossover(parentB);
            child.mutate();

            newRockets[i] = child;


        }

        this.rockets = newRockets;

    }
}
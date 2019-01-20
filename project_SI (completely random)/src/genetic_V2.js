
var GeneticAlgorithm = function(max_units, top_units){
	this.max_units = max_units;
	this.top_units = top_units;
	this.geneticText;
	if (this.max_units < this.top_units) this.top_units = this.max_units;
	
	this.Population = [];
	
}

GeneticAlgorithm.prototype = {

	reset : function(){
		this.iteration = 1;	
		this.mutateRate = 1; 
		this.best_population = 0; 
		this.best_fitness = 0; 
		this.best_score = 0;	
		this.index_best = 0;
	},
	
	// creates a new population
	createPopulation : function(){
		// clear any existing Populationn
		this.Population.splice(0, this.Population.length);
		
		for (var i=0; i<this.max_units; i++){
			var newUnit = new synaptic.Architect.Perceptron(4, 6, 3);
			//if (i==1) newUnit = synaptic.Network.fromJSON(data);
			
			// set additional parameters for the new unit
			newUnit.index = i;
			newUnit.fitness = 0;
			newUnit.score = 0;
			newUnit.isWinner = false;
			newUnit.isBest = false;
			
			// add the new unit to the population 
			this.Population.push(newUnit);
		}
	},
	
	activateBrain : function(player,geneticText,dist_to_target,dist_to_border,height_dist,height_dist_next_target){
		this.geneticText = geneticText;
		var inputs = [dist_to_target, dist_to_border,height_dist,height_dist_next_target];
		var outputs = this.Population[player.index].activate(inputs);	
		
		if(this.Population[player.index].isBest){ 
		player.isBest = true;
		console.log('player is best');
	} 

		if (outputs[1] > 0.5 && outputs[2] > 0.5 ) player.stopAll();
		else if (outputs[1] > 0.5) player.moveRight();
		else if (outputs[2] > 0.5) player.moveLeft();
		else player.stopAll();

		if (outputs[0] > 0.5) player.jump();

	},
	
	evolvePopulation : function(){

		var Winners = this.selection();
		Winners[0].isBest = true;
		if (this.mutateRate == 1 && Winners[0].fitness < 20){ 
			this.createPopulation();
		} else {
			this.mutateRate = 0.25; // else set the mutatation rate to the real value
		}

		// fill the rest of the next population with new units using crossover and mutation
		for (var i=this.top_units; i<this.max_units; i++){
			var parentA, parentB, offspring;
				
			if (i >= this.top_units && i  < this.top_units*2){
				// offspring is made by a crossover of two best winners
				parentA = Winners[0].toJSON();
				parentB = Winners[1].toJSON();
				offspring = this.crossOver(parentA, parentB);

			} else if (i < this.max_units-(this.top_units*2)  ){
				// offspring is made by a crossover of two random winners
				parentA = this.getRandomUnit(Winners).toJSON();
				parentB = this.getRandomUnit(Winners).toJSON();
				offspring = this.crossOver(parentA, parentB);
				
			} else {
				// offspring is a random winner
				offspring = this.getRandomUnit(Winners).toJSON();
			}

			// mutate the offspring
			offspring = this.mutation(offspring);
			
			// create a new unit using the neural network from the offspring
			var newUnit = synaptic.Network.fromJSON(offspring);
			newUnit.index = this.Population[i].index;
			newUnit.fitness = 0;
			newUnit.score = 0;
			newUnit.isWinner = false;
			newUnit.isBest = false;
			
			// update population by changing the old unit with the new one
			this.Population[i] = newUnit;
		}
		
		// if the top winner has the best fitness in the history, store its achievement!
		if (Winners[0].fitness > this.best_fitness){
			 /*var blob = new Blob( [  "var data = " + JSON.stringify( Winners[0].toJSON()) + " ; " ] , {type: "text/plain;charset=utf-8"});
			 saveAs(blob, "best_fitness.js");*/
				this.best_population = this.iteration;
				this.best_fitness = Winners[0].fitness;
				this.best_score = Winners[0].score;
				this.index_best = Winners[0].index;
	
		}
			this.geneticText.text='Best fitness overall: ' + this.best_fitness + ' Best Population:' + this.best_population
				+ ' Best Player overall: ' + this.index_best + " Current Population: " + this.iteration ;		
		// sort the units of the new population	in ascending order by their index
		this.Population.sort(function(unitA, unitB){
			return unitA.index - unitB.index;
		});
	},

	// selects the best units from the current population
	selection : function(){
		// sort the units of the current population	in descending order by their fitness
		var sortedPopulation = this.Population.sort(
			function(unitA, unitB){
				return unitB.fitness - unitA.fitness;
			}
		);
		
		// mark the top units as the winners!
		for (var i=0; i<this.top_units; i++) this.Population[i].isWinner = true;
		
		// return an array of the top units from the current population
		return sortedPopulation.slice(0, this.top_units);
	},
	

	crossOver : function(parentA, parentB) {
		var cutPoint = this.random(0, parentA.neurons.length-1);
		
		for (var i = cutPoint; i < parentA.neurons.length; i++){
			var biasFromParentA = parentA.neurons[i]['bias'];
			parentA.neurons[i]['bias'] = parentB.neurons[i]['bias'];
			parentB.neurons[i]['bias'] = biasFromParentA;
		}

		return this.random(0, 1) == 1 ? parentA : parentB;
	},
	
	// performs random mutations on the offspring
	mutation : function (offspring){

		for (var i = 0; i < offspring.neurons.length; i++){
			offspring.neurons[i]['bias'] = this.mutate(offspring.neurons[i]['bias']);
		}
		
		for (var i = 0; i < offspring.connections.length; i++){
			offspring.connections[i]['weight'] = this.mutate(offspring.connections[i]['weight']);
		}
		
		return offspring;
	},
	
	// mutates a gene
	mutate : function (gene){
		if (Math.random() < this.mutateRate) {
			var mutateFactor = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
			gene *= mutateFactor;
		}
		
		return gene;
	},
	
	random : function(min, max){
		return Math.floor(Math.random()*(max-min+1) + min);
	},
	
	getRandomUnit : function(array){
		return array[this.random(0, array.length-1)];
	},
	
	normalize : function(value, max){
		// clamp the value between its min/max limits
		if (value < -max) value = -max;
		else if (value > max) value = max;
		
		// normalize the clamped value
		return (value/max);
	}
}
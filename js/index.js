
angular.module('scheduler', []).value('config', {
	blocksize: 30,
	maxIterations: 100,
	exampleInputs: [[
			'0,2',
			'1,1'
		].join(';'), [
			'0,28',
			'2,14',
			'4,28'
		].join(';'), [
			'10,24',
			'1,1',
			'0,3'
		].join(';'), [
			'0,10',
			'0,3',
			'0,8',
			'0,2',
			'0,5',
			'0,5'
		].join(';'), [
			'2,10',
			'4,3',
			'5,8',
			'3,2',
			'10,5',
			'3,5',
			'4,3',
			'3,2'
		].join(';'), [
			'15,2',
			'12,6',
			'3,8',
			'4,8',
			'4,8',
			'7,8',
		].join(';'), [
			'16,2',
			'10,3',
			'14,2',
			'2,7',
			'15,1',
			'26,1',
			'26,1'
		].join(';')
	]
}).value('algorithms', {
	FCFS: function (jobs) {
		return jobs[0].work();
	},
	SRTF: function (jobs) {
		console.log('job options', _.map(jobs, 'remaining').join());
		return _.min(jobs, 'remaining').work(1);
	},
	SJF: function (jobs) {
		return _.min(jobs, 'remaining').work();
	},
	'RR:3': rrGenerator(3),
	'RR:4': rrGenerator(4),
	'RR:5': rrGenerator(5),
	complex: 'complex',
	randomJob: function (jobs) {
		return _.sample(jobs).work();
	},
	randomUnit: function (jobs) {
		return _.sample(jobs).work(1);
	}
});

function rrGenerator(time) {
	var idx = 0;
	console.log('time', time);
	return function (jobs) {
		console.log('RR', 'time', time, _.map(jobs, 'remaining').join());
		if (idx >= jobs.length) {
			idx = 0;
		}
		var current = jobs[idx];
		var duration = current.work(time);

		if (current.remaining) {
			idx++;
		}
		
		return duration;
	};
}

angular.module('scheduler').controller('MainCntl', function ($rootScope, Memory, config, algorithms, Job, Todo) {

	this.playInput = '0,10;4,5;12,4';
	var todo = this.todo;

	this.config = config;

	this.fitters = _.keys(algorithms);
	this.fitterInput = (this.fitters[0]);

	this.blocksize = config.blocksize;

	this.memory = Memory;

	this.todo = Todo.list;
	this.processes = Memory.processes;

	this.remove = Todo.remove.bind(Todo);

	this.add = function (inputSeqence) {
		Todo.add(inputSeqence);

		this.addInput = '';
	};

	this.populate = function (inputSeqence) {
		console.log('populating', inputSeqence);
		Todo.clear();
		inputSeqence.split(';').forEach(Todo.add.bind(Todo));
	};

	this.play = function (inputSeqence) {
		if (inputSeqence) {
			this.populate(inputSeqence);
		}

		this.memory.removeAll();

		var elapse;
		var options;
		var iteration = 0;
		var remaining = this.todo;
		console.log('using', this.fitterInput);
		var algo = algorithms[this.fitterInput];
		var subject;

		_.forEach(this.todo, function (e) {
			e.remaining = e.size;
		});

		if (this.fitterInput == "complex") { // Maybe another day
			_.forEach(remaining, function (e) {
				e.q = 1;
			});
			while (remaining.length && iteration<this.config.maxIterations) {
				options = _.filter(remaining, function (el) { return el.start<=iteration; });
				elapse = 0;

				if (subject = _.find(options, {q: 1})) {
					elapse = subject.work(8);
					if (subject.remaining) {
						subject.q++;
					}
				} else if (subject = _.find(options, {q: 2})) {
					elapse = subject.work(16);
					if (subject.remaining) {
						subject.q++;
					}
				} else if (subject = _.find(options, {q: 3})) {
					elapse = subject.work(1);
				}
				remaining = _.filter(remaining, 'remaining');
				if (elapse == 0) {
					Memory.add(null, 1);
					iteration += 1;
				} else {
					iteration += elapse;
				}
			}
		} else {
			while (remaining.length && iteration<this.config.maxIterations) {
				options = _.filter(remaining, function (el) { return el.start<=iteration; })
				elapse = 0;
				if (options.length) {
					elapse = algo(options);

					remaining = _.filter(remaining, 'remaining');
				}
				if (elapse == 0) {
					Memory.add(null, 1);
					iteration += 1;
				} else {
					iteration += elapse;
				}
			}
		}

		this.meanTime = Memory.getMeanTime(this.todo);

	};

});

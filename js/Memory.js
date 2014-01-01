(function (module) {

function Memory() {}

Memory.prototype = {
	processes: [],
	t: 0,
	add: function (job, time) {
		time = time || 1;

		if (job) {
			var last = this.processes.length && this.processes[this.processes.length-1];
			// console.log('adding', job, last);
			if (last && last.job == job) {
				last.time+=time;
			} else {
				this.processes.push({
					job: job,
					time: time,
					start: this.t,
					delay: - (last.start + last.time - this.t)
				});
			}
		}

		this.t += time;

		return job;
	},
	removeAll: function () {
		console.log('removing all', this.processes, this.processes.length);
		_.times(this.processes.length, function () {
			this.pop();
		}, this.processes);

		this.t = 0;
	},
	getMeanTime: function (jobs) {
		var waits = _.map(jobs, function (job) {
			var last = _.findLast(this, {job: job});
			var end = last.start + last.time;

			console.log('found', job, job.size);
			console.log('start', job.start, last.start);
			console.log('end', end);

			return end - job.start - job.size;
		}, this.processes);

		console.log(waits);

		var sum = _.reduce(waits, function(sum, num) {
		  return sum + num;
		});

		return (sum/jobs.length).toFixed(2);
	}
};

module.service('Memory', Memory);
	
})(angular.module('scheduler'));

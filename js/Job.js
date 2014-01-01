(function (module) {

module.factory('Job', function (Memory) {

	function Job(id, start, size) {
		console.log('new job', id, start, size);
		this.start = start;
		this.remaining = this.size = size;
		this.id = id;
	}

	Job.prototype = {
		id: null,
		start: null,
		size: null,
		remaining: null,
		work: function (time) {
			console.log(time);
			if (!time || time > this.remaining) {
				time = this.remaining;
			}
			console.log('work on', this.id, 'for', time, '  :::   Remaining', this.remaining);
			this.remaining -= time;

			Memory.add(this, time);

			return time;
		}
	};

	return Job;
});
	
})(angular.module('scheduler'));

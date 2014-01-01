(function (module) {

module.factory('Todo', function (Job) {
	var counter = 0;
	
	return {
		list: [],
		clear: function () {
			_.times(this.list.length, function () {
				this.pop();
			}, this.list);

			counter = 0;
		},
		add: function (inputSeqence) {
			var pair = inputSeqence.split(',').map(function (el) {
				return parseInt(el, 10);
			});

			var item = new Job(counter++, pair[0], pair[1]);

			this.list.push(item);

			return item;
		},
		remove: function (item) {
			var ind = this.list.indexOf(item);
			return this.list.splice(ind, 1);
		}
	};
});
	
})(angular.module('scheduler'));

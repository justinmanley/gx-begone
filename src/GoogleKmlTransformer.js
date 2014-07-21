var	augment = require("augment"),
	xpath = require("xpath");

var	Transformer = require("./Transformer");

module.exports = augment(Transformer, function(uber) {
	this.constructor = function(rules) {
		uber.constructor.call(this, rules);
		this.addTransformRule("gx:Track", "Placemark");
		this.addTransformRule("gx:MultiTrack", function(node) {
			var child;

			while (node.childNodes.length > 0) {
				child = node.firstChild;
				node.parentNode.insertBefore(child, node);
				node.removeChild(child);
			}

			node.parentNode.removeChild(node);
		});
	};

	this.select = xpath.useNamespaces({ "gx": "http://www.google.com/kml/ext/2.2" });
});
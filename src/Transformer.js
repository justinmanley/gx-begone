var augment = require("augment"),
	fs = require("fs"),
	_ = require("underscore"),
	xmldom = require("xmldom"),
	xpath = require("xpath");

module.exports = augment.defclass({

	constructor: function(rules) {
		this._transformRules = _.merge({}, rules);
	},

	begone: function(filename) {
		var data;

		if (!filename) {
			console.error('Filename must be provided');
			process.exit(1);
		}

		data = fs.readFileSync(filename, { encoding: 'utf8' });
		this._xml = new xmldom.DOMParser().parseFromString(data);
		this.transform();
		return this;
	},

	transform: function() {
		var applyTransformRule, nodes;
		for (var target in this._transformRules) {
			if (Object.prototype.hasOwnProperty.call(this._transformRules, target)) {
				applyTransformRule = this._transformRules[target];
				nodes = this.select("//" + target, this._xml);

				_.each(nodes, applyTransformRule, this);
			}
		}
		return this;
	},

	toXML: function() {
		var serializer = new xmldom.XMLSerializer();
		return serializer.serializeToString(this._xml);
	},

	select: function(predicate) {
		return xpath.select(predicate);
	},

	addTransformRule: function(selector, rule) {
		var transformRule;

		if (typeof rule === 'string') {
			transformRule = _.partial(this.renameNode, rule);
		} else {
			transformRule = rule;
		}

		this._transformRules[selector] = transformRule;
		return this;
	},

	renameNode: function(newTagName, node) {
		var	replacement = this._xml.createElement(newTagName),
			child;

		while (node.childNodes.length > 0) {
			child = node.lastChild;
			node.removeChild(node.lastChild);
			replacement.appendChild(child);
		}

		node.parentNode.replaceChild(replacement, node);
	}

});

_.mixin({
	merge: function(dest, src) {
		_.each(src, function(value, key) {
			dest[key] = value;
		});
		return dest;
	}
});
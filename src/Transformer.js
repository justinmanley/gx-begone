var augment = require("augment"),
	_ = require("underscore"),
	xmldom = require("xmldom"),
	xpath = require("xpath");

module.exports = augment.defclass({

	constructor: function(xmlstring, rules) {
		this._xml = new xmldom.DOMParser().parseFromString(xmlstring);
		this._transformRules = _.merge({}, rules);
	},

	begone: function() {
		this.transform();
		return this.toXML();
	},

	transform: function() {
		var applyTransformRule, nodes;
		for (var target in this._transformRules) {
			if (Object.prototype.hasOwnProperty.call(this._transformRules, target)) {
				applyTransformRule = this._transformRules[target];
				nodes = this.select(target);

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
		var select = xpath.useNamespaces(this._xml.documentElement._nsMap);
		return select("//" + predicate, this._xml);
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
			child = node.firstChild;
			node.removeChild(node.firstChild);
			replacement.appendChild(child);
		}

		node.parentNode.replaceChild(replacement, node);
	},

	deleteNode: function(node) {
		node.parentNode.removeChild(node);
		return this;
	},

	amputateNode: function(node) {
		var parent = node.parentNode,
			child;

		while (node.childNodes.length > 0) {
			child = node.firstChild;
			console.log(child.nodeName);
			node.removeChild(child);
			parent.insertBefore(node, child);
		}

		this.deleteNode(node);

		return this;
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
var Transformer = require("../src/Transformer"),
	expect = require("chai").expect,
	fs = require("fs");

describe("Transformer", function() {
	var transformer, xmlstring;

	beforeEach(function() {
		xmlstring = fs.readFileSync('test/test.kml', { encoding: 'utf8' });
		transformer = new Transformer(xmlstring);
	});

	describe("#select", function() {
		it("Should return a <gx:coord> node.", function() {
			var selection = transformer.select("gx:coord");
			expect(selection.length).to.equal(1);
			expect(selection[0].nodeName).to.equal('gx:coord');
		});
	});

	describe("#deleteNode", function() {
		it("Should remove <gx:MultiTrack> element and all its children from document.", function() {
			transformer.addTransformRule('gx:MultiTrack', function(node) {
				this.deleteNode(node);
			});

			var xml = transformer.begone();
			expect(xml).to.equal('<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">\n<Document>\n\n</Document>\n</kml>');
		});
	});

	describe("#amputateNode", function() {
		it("Should remove <gx:MultiTrack> element and append its children to the <Document> element.", function() {
			transformer.addTransformRule('gx:MultiTrack', function(node) {
				this.amputateNode(node);
			});

			var xml = transformer.begone();
			expect(xml).to.equal('<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">\n<Document>\n<name>test</name>\n<description>A test point</description>\n<Point>\n<gx:coord>1 10 0</gx:coord>	\n</Point>\n</Document>\n</kml>');
		});
	});
});
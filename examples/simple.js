var GoogleKmlTransformer = require("../src/GoogleKmlTransformer");

var kml = new GoogleKmlTransformer()
	.begone(process.argv[2])
	.toXML();

console.log(kml);
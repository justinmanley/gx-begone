var fs 						= require("fs"),
	GoogleKmlTransformer 	= require("../src/GoogleKmlTransformer");

var filename = process.argv[2],
	data;

if (!filename) {
	console.error('Filename must be provided');
	process.exit(1);
}
data = fs.readFileSync(filename, { encoding: 'utf8' });
console.log(data);

var kml = new GoogleKmlTransformer(data).begone();

console.log(kml);
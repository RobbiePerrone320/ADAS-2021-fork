// Written by Ryan Sheffler, November 2020.

// This sets up a few constants for the program to run at all.
const fs = require('fs');
const papa = require('papaparse');
const debug = false; // Set this to true for a bit more verbosity.
// This program supports arguments. The filename and headersize will default to the ones seen just below. Follow the run command with a filename to override this.
const args = process.argv.slice(2);
var FileName = "Level_Vent_Test_Run_10_10_2020";
var headerSize = 11;
if(args.length>0) {
	FileName = args[0];
}
if(args.length>1) {
	headerSize = parseInt(args[1]);
}
FileName.replace(".csv",""); // This is just a bit of safety. If the user includes the file extension, this scrubs it.

// This chunk of code checks to see if either stripped versions of the file or a final JSON already exist. If they do, it deletes them.
if(fs.existsSync((FileName+'_stripped.csv'))){
	fs.unlinkSync((FileName+'_stripped.csv'));
	console.log("Stripped CSV found and deleted"); 
}
if(fs.existsSync((FileName+'.json'))){
	fs.unlinkSync((FileName+'.json'));
	console.log("JSON found and deleted");
}

/* The following is some code to read in a CSV as an array, then strip it of some lines before saving it again.
 PapaParse unfortunately lacks an easy way to skip the top of a file, so this code takes the first [headerSize] lines and chucks them out of the window.
 It's a messy solution that will take a little while with large files, but this isn't an operation that is done often enough for that to really matter. */
fs.readFile((FileName+'.csv'), 'utf8', function(err, data)
{
    if (err)
    {
        // check and handle err
		console.log("error found: "+err);
    }
    // Get an array of comma separated lines`
    let lines = data.split('\n').slice(0);
    // Turn that into a data structure we can parse (array of arrays)
    let linesArr = lines.map(line=>line.split(','));
    // While we're on a line that is higher up than our header size, remove it.
	for(var i = 0; i<headerSize; i++){
		if(debug) { console.log("i is "+i+", removed element "+linesArr.shift()); }
		else { linesArr.shift(); }
	}
	// Then reassemble the array as a new string
    let output = linesArr.join("\n");
    // Write out new file
    fs.writeFileSync((FileName+'_stripped.csv'), output); // I add _stripped to the filename just to give it a new name and not overwrite the original. Pretty arbitrary.
	console.log("CSV stripped and created as ",(FileName+'_stripped.csv'));
});

/* This is the meat of the code, where a CSV actually becomes a JSON. 
 Due to JavaScript attempting to run code all at once, this code would normally run while the last block of code was also running. This meant it would look for the _stripped file that didn't exist yet, fail, and give up.
 This Interval is there to combat that. Rather than have it set a promise and wait on that and all that jazz, I just have it try every 1.5 seconds, and only actually even attempt to run if it can find the _stripped file without an error.
*/
var timer = setInterval(function (){
	fs.access((FileName+'_stripped.csv'), fs.constants.R_OK, function (err) {
            if (!err) {
                clearInterval(timer);
				const file = fs.createReadStream((FileName+'_stripped.csv'));
				var count = 0;
				
				papa.parse(file, { // That curly brace shows that we are now defining the configuration for PapaParse to run in.
					header: true,
					worker: false,
					// This step code cannot be run if you also want to use the results array on the complete flag. I left it here because it coul be useful to help debug.
					/* step: function(result) {
						count++;
						console.log(result['data']);
					}, */
					
					// After the parser has finished running through the file, this function will run. The console log writes should make it clear what's going on.
					complete: function(results, file) { 
						if(count<results.data.length){ count=results.data.length; }
						console.log("Parsing complete, read", count, "records.");
						fs.writeFile((FileName+".json"), JSON.stringify(results.data), function(err) {
							if (err) {
								console.log("Error writing file",err);
							}
							else {
								console.log("File written as",(FileName+'.json'));
							}
						});
					}
				});
            }
        });},
		1500);
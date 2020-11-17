parse.js is a JavaScript file responsible for translating sensor data from the LevelLogger program (written as a CSV file) into something the ADAS system can more easily digest (a JSON file).
As of the time of writing, this file can only be run manually, though it wouldn't be much of a stretch to make it automated. This process only needs to be run after a collection of data has been amassed by the LevelLogger software, which isn't as frequently as, say, weather service updates.

__How To Use__
parse.js is designed to be run on its own through Node.js in the command line.

*Prerequisites*
**YOU NEED NODE.JS TO RUN THIS FILE PROPERLY.** This should be ready by default on ADAS's host computer. Please check out nodejs.org for information on how to install it elsewhere.
Place the CSV file created by LevelLogger into the same file as parse.js. This will just make it easier for parse.js to find it.

*Selecting the File*
There are two ways to tell parse.js which file it should be parsing. Either:
1.) Open parse.js (any text editor should be able to do this). Right at the top, a variable named FileName is assigned. Simply change the text within the quotations to match the CSV file's name.
2.) Include the file name when running parse.js. This will be addressed next.

*Running parse.js*
Open Command Prompt (or whatever command line you have, PowerShell, for example, will also work) and navigate to the folder these files are in. 
To do this, either open the command line from the options in File Explorer, or copy the file path and use the command "cd [filepath]" in the command line.
Once you're there, simply type "node parse.js". A few new files should appear in the folder. Congrats, you have now parsed your file!

*Additional Function*
There are 2 possible arguments to add to the "node parse.js" command. These are written just after the command before you run it.
The first word after the command is the filename. If you put something here, parse.js will use this as the filename instead of whatever was written in the script itself. Do not use spaces in the filename or here.
The second is the header size. Within the CSV file, there are several lines before the actual data table. There should be 11 lines, but in case this is for some reason different, you can override that here. This should always be a number.
The full command syntax is "node parse.js [filename] [header size]". For example, "node parse.js Level_Vent_Test_Run_9.30.2020 11" is valid. Both arguments are optional, they're just meant to make running the script easier.
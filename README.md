How to get the grid arpeggiator working on your machine

Watch the video titled "how to get working" in the folder for a visual walkthrough

1. Install the most recent version of NodeJs - https://nodejs.org/en
2. Extract the contents of this folder into another folder located in a place that's easy to navigate to (like your desktop)
3. Open a terminal and use the command "cd directory/name of folder" without quotes. You can always use AI to help with this step
   Windows might look like "cd C:/users/Forrest/desktop/grid-arpeggiator"
   Mac might look like "cd Desktop/grid-arpeggiator"
4. Once you've cd'd into the folder, use the command "npm i" to install the libraries needed for the instrument to run
5. After installing the libraries, use the command "npm run dev" to start the instrument up.
   You should be able to ctrl/cmd click the link that pops up in terminal to open up your browser to the address where the instrument is running
6. To open up the Max patch, open the folder you originally extracted the contents of the zip file to, and open "arpeggiator.maxpat"
7. Turn on the ezdac~, and sound should play from the instrument.

# Strudel Demo

This project was about playing music/sound by using Strudel syntax

## Functions and bootstrap components

1. Play/Stop button: This button is used to play and stop the audio. It is a bootstrap button with a play and stop icon.
2. Volume slider: This slider is used to change the volume of the audio. It is a bootstrap slider
3. CPS selection: This selection is used to change the speed of the audio. It is a bootstrap selection
4. Instruments switches: These switches are used to mute and unmute the instruments. It is a bootstrap input switch
5. Show Graph button: D3 graph is used to show real-time cutoff frequency of the audio.
6. Save and Load button: These buttons are used to save and load the current audio configuration to a JSON file.
7. Alerts: Alerts are used to show messages to the user. It is a bootstrap alert with a message icon. When user successfully saved or loaded the configuration, an alert will be shown to the user. Or if user entered invalid input, an alert will be shown to the user.
8. Collapse: Bootstrap collapse is used to hide and show the D3 graph.
9. How to use page: This page is used to show the user how to use the project. It is a bootstrap card. Using react-router-dom to navigate to the how to use page.

## Explanations

### How did I implement the change of volume when the slider is moved?

I put the .gain() for every pattern in tunes.js and in PreprocessLogic.jsx, I multiply the gain value with the volume value.

### How did I implement the change of CPS when the selection is changed?

The script must have setcps(xxx) as a global method. I use regex to find and replace the setcps value by multiplying it with the selected CPS value.

### How did I implement the change of instruments when the switches are changed?

I put the instrument name with prefix _, mute is _ prefix, unmute is no prefix. I use regex to find and add/remove the prefix to the instrument name.

### Why creating another button for uploading files rather than using input (type=file)?

Because I want a custom button for uploading files to look good and have icon rather than using plain input (type=file) (styling css of this input file costs more effort).

### What kind of data was used to display in D3 graph?

I choose "cutoff" value to display in D3 graph. Because we already have the d3Data event to get the log data, and the log data contains the "cutoff" field. So I just need to add/remove "all(x => x.log())", and extract the "cutoff" value from the log data.

## Video

https://youtu.be/8-TEzifLzus

## References

- https://regexr.com/: for regex testing, I use to test and create Log pattern and setcps pattern for PreprocessLogic.

For saving and loading the configuration to a JSON file:

- https://www.geeksforgeeks.org/html/html-a-download-attribute/
- https://developer.mozilla.org/en-US/docs/Web/API/Blob#creating_a_blob
- https://developer.mozilla.org/en-US/docs/Web/API/Blob/text

# Strudel Demo

This project was about playing music/sound by using Strudel syntax

## Functions and bootstrap components

1. Play/Stop button: This button is used to play and stop the audio. It is a bootstrap button with a play and stop icon.
2. Volume slider: This slider is used to change the volume of the audio. It is a bootstrap slider with a volume icon.
3. CPS selection: This selection is used to change the speed of the audio. It is a bootstrap selection with a cps icon.
4. Instruments switches: These switches are used to mute and unmute the instruments. It is a bootstrap input switch with.
5. Show Graph button: D3 graph is used to show real-time cutoff frequency of the audio.
6. Save and Load button: These buttons are used to save and load the current audio configuration to a JSON file.
7. Alerts: Alerts are used to show messages to the user. It is a bootstrap alert with a message icon. When user successfully saved or loaded the configuration, an alert will be shown to the user. Or if user entered invalid input, an alert will be shown to the user.
8. Collapse: Bootstrap collapse is used to hide and show the D3 graph.
9. How to use page: This page is used to show the user how to use the project. It is a bootstrap card. Using react-router-dom to navigate to the how to use page.

## Decisions

### Why creating another button for uploading files rather than input (type=file)?

Because I want a custom button to look good rather than using plain input css (custom css of this input file costs more effort).

### What kind of data was used to display using D3 graph?

I choose "cutoff" value

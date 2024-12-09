# GFXlab1c
## Build gl-matrix
### Prerequisites
- Ubuntu Linux (other OS not tested)
- npm / node.js
### Build Process
Build glmatrix by cloning it from github (https://github.com/toji/gl-matrix) and going into the main directory of the repository and run: 
```bash
npm i gl-matrix
```
## Start Lab1c
Navigate into the lab1c directory and run:
```bash
python3 -m http.server
```
Then open the website in the Browser and open lab1c.html

## Claim
I did all requested tasks, except for the shadows. I tried shadow mapping and shadow projections, but both didn't work at all, so I removed them from the final version.

## Tested environments
- Ubuntu Linux with python webserver and Mozilla Firefox 132.0.2 (snap)
- Ubuntu Linux with python webserver and Chromium Version 131.0.6778.85 (Official Build) snap (64-bit)
- Windows 11 with python webserver (added option: --bind localhost) and Mozilla Firefox 133.0 (64-bit)

## Ghost model
ghost model from: PacMan Ghost by Hatch on Thingiverse: https://www.thingiverse.com/thing:557527

## Additional and general remarks
Ddidn't manage to implement shadows. The shadow map didn't read in the values correctly or wasn't transfered to the main shader correctly, the shadow projection likely had some errors in the shadow matrix and also didn't show any shadows
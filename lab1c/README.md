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
Navigate into the lab1b directory and run:
```bash
python3 -m http.server
```
Then open the website in the Browser and open lab1b.html

## Claim
I did all reqested tasks, including the following: T1, T2, T3(a,b,c,d), T4.
However local tanslation was implemente correctly after rotating input coordinates in translation by local coordinate system rotation.

## Tested environments
- Ubuntu Linux with python webserver and Mozilla Firefox 132.0 (snap)
- Ubuntu Linux with python webserver and Chromium Version 130.0.6723.116 (snap)
- Windows 11 with python webserver (slightly edited command: python -m http.server --bind localhost) Firefox 132.0.2

## Additional and general remarks
It would be possible to implement global tansformations differently by swapping the order of local and global transformation matrices in the shader, which has an effect on global scaling and rotating, effects on local coordinate system translations not tested.
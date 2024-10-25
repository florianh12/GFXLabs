# GFXlab1
## Build gl-matrix
### Prerequisites
- Ubuntu Linux (other OS not tested)
- npm / node.js
### Build Process
Build glmatrix by cloning it from github (https://github.com/toji/gl-matrix) and going into the main directory of the repository and run: 
```bash
npm i gl-matrix
```
## Start Lab1a
Navigate into the lab1a directory and run:
```bash
python3 -m http.server
```
Then open the website in the Browser and open lab1a.html

## Claim
I did all reqested tasks, including the following: T1, T2, T3(a,b,c,d), T4.
However local tanslation was implemente correctly after rotating input coordinates in translation by local coordinate system rotation.

## Tested environments
- Ubuntu Linux with python webserver and Mozilla Firefox 131.0.3

## Additional and general remarks
It would be possible to implement global tansformations differently by swapping the order of local and global transformation matrices in the shader, which has an effect on global scaling and rotating, effects on local coordinate system translations not tested.
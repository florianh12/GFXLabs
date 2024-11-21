# Pen & Paper (Lab2) 

## **Task 1:**  Define one or more APIs to specify oblique projections. You do not need to write the function; just decide which parameters the user must specify (and show what they represent). *(2 points)* 
```js
function oblique(alpha=90,phi=0,zNear=0.1,zFar=100.0) { ... }
function oblique(alpha=90,phi=0) { ... }
function oblique(alpha=90,phi=0,top=1.0,bottom=-1.0,left=-1.0,right=1.0,zNear=0.1,zFar=100.0) { ... }
```
The alpha is responsible for the y-rotation and the phi for the z-rotation of the parallel projectors for the objique projection. top, bottom, left and right specify the bounds of the view plane and zNear and zFar specify the bounds of the view volume.

## **Task 2:**  Can we obtain an isometric of a cube by a single rotation about a suitably chosen axis? Explain your answer. *(2 points)*

Yes, we can. If we have an Orthonormal projection, looking along the z-axis and rotate the cube along the axis between positive y- and negative z-axis, vector: (0,1,-1) or negative y-axis and positive z-axis (0,-1,1) for 90°, we obtain an isometric of a cube that hasn't been rotated previously.

## **Task 3:**  For many Virtual Reality installations, the COP can be at any point and the projection plane can be at any orientation. Derive the projection matrix for this general case. *(2 points)*


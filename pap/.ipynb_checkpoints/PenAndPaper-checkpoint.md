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

$$\alpha\dots Angle\ for\ Rotation\ around\ the\ z-Axis$$
$$\beta\dots Angle\ for\ Rotation\ around\ the\ x-Axis$$ 
$$\gamma\dots Angle\ for\ Rotation\ around\ the\ y-Axis$$ 
$$R\dots Rotation-Matrix$$
$$T\dots Translation-Matrix$$
$$M\dots Basic\ Projection-Matrix\ (Perspective)$$

<br>

$$
R_x = 
\begin{pmatrix}
1 & 0 & 0  & 0 \\
0 & \cos{\beta} & -\sin{\beta} & 0 \\
 0 & \sin{\beta} & \cos{\beta} & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}

R_y = 
\begin{pmatrix}
\cos{\gamma} & 0 & \sin{\gamma} & 0 \\
0 & 1 & 0  & 0 \\
-\sin{\gamma} & 0 & \cos{\gamma} & 0 \\
0 & 0 & 0 & 1  
\end{pmatrix}

R_z = 
\begin{pmatrix}
\cos{\alpha} & -\sin{\alpha} & 0 & 0 \\
\sin{\alpha} & \cos{\alpha} & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$

<br>

$$
T = 
\begin{pmatrix}
1 & 0 & 0 & x \\
0 & 1 & 0 & y \\
0 & 0 & 1 & z \\
0 & 0 & 0 & 1
\end{pmatrix} 
$$

<br>

$$
T^{-1} = 
\begin{pmatrix}
1 & 0 & 0 & -x \\
0 & 1 & 0 & -y \\
0 & 0 & 1 & -z \\
0 & 0 & 0 & 1
\end{pmatrix} 
$$

<br>

$$
M = 
\begin{pmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & \frac{1}{d} & 0
\end{pmatrix}
$$

<br>

$$
R^{-1} = R^{T} = (R_z R_x R_y)^{T} = R_y^{T} R_x^{T} R_z^{T} = 
\begin{pmatrix}
\cos{\gamma} & 0 & -\sin{\gamma} & 0 \\
0 & 1 & 0  & 0 \\
\sin{\gamma} & 0 & \cos{\gamma} & 0 \\
0 & 0 & 0 & 1  
\end{pmatrix}
\begin{pmatrix}
1 & 0 & 0  & 0 \\
0 & \cos{\beta} & \sin{\beta} & 0 \\
 0 & -\sin{\beta} & \cos{\beta} & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
\begin{pmatrix}
\cos{\alpha} & \sin{\alpha} & 0 & 0 \\
-\sin{\alpha} & \cos{\alpha} & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix} =
$$
$$
\begin{pmatrix}
\cos{\gamma} & 0 & -\sin{\gamma} & 0 \\
0 & 1 & 0  & 0 \\
\sin{\gamma} & 0 & \cos{\gamma} & 0 \\
0 & 0 & 0 & 1  
\end{pmatrix}
\begin{pmatrix}
\cos{\alpha} & \sin{\alpha} & 0  & 0 \\
-\sin{\alpha}\cos{\beta} & \cos{\alpha}\cos{\beta} & \sin{\beta} & 0 \\
 \sin{\alpha}\sin{\beta} & -\cos{\alpha}\sin{\beta} & \cos{\beta} & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
=
\begin{pmatrix}
\cos{\alpha}\cos{\gamma} - \sin{\alpha}\sin{\beta}\sin{\gamma} & \sin{\alpha}\cos{\gamma} + \cos{\alpha}\sin{\beta}\sin{\gamma} & -\cos{\beta}\sin{\gamma}  & 0 \\
-\sin{\alpha}\cos{\beta} & \cos{\alpha}\cos{\beta} & \sin{\beta} & 0 \\
 \cos{\alpha}\sin{\gamma} + \sin{\alpha}\sin{\beta}\cos{\gamma} & \sin{\alpha}\sin{\gamma} - \cos{\alpha}\sin{\beta}\cos{\gamma} & \cos{\beta}\cos{\gamma} & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$

<br>

$$
V = (TR)^{-1} = R^{-1} T^{-1} = \begin{pmatrix}
\cos{\alpha}\cos{\gamma} - \sin{\alpha}\sin{\beta}\sin{\gamma} & \sin{\alpha}\cos{\gamma} + \cos{\alpha}\sin{\beta}\sin{\gamma} & -\cos{\beta}\sin{\gamma}  & 0 \\
-\sin{\alpha}\cos{\beta} & \cos{\alpha}\cos{\beta} & \sin{\beta} & 0 \\
 \cos{\alpha}\sin{\gamma} + \sin{\alpha}\sin{\beta}\cos{\gamma} & \sin{\alpha}\sin{\gamma} - \cos{\alpha}\sin{\beta}\cos{\gamma} & \cos{\beta}\cos{\gamma} & 0 \\
0 & 0 & 0 & 1
\end{pmatrix} \begin{pmatrix}
1 & 0 & 0 & -x \\
0 & 1 & 0 & -y \\
0 & 0 & 1 & -z \\
0 & 0 & 0 & 1
\end{pmatrix}  =

$$
$$
 \begin{pmatrix}
\cos{\alpha}\cos{\gamma} - \sin{\alpha}\sin{\beta}\sin{\gamma} & \sin{\alpha}\cos{\gamma} + \cos{\alpha}\sin{\beta}\sin{\gamma} & -\cos{\beta}\sin{\gamma}  & (\sin{\alpha}\sin{\beta}\sin{\gamma} - \cos{\alpha}\cos{\gamma})*x - (\sin{\alpha}\cos{\gamma} + \cos{\alpha}\sin{\beta}\sin{\gamma})*y + \cos{\beta}\sin{\gamma}*z \\
-\sin{\alpha}\cos{\beta} & \cos{\alpha}\cos{\beta} & \sin{\beta} & \sin{\alpha}\cos{\beta}*x - \cos{\alpha}\cos{\beta}*y - \sin{\beta}*z \\
 \cos{\alpha}\sin{\gamma} + \sin{\alpha}\sin{\beta}\cos{\gamma} & \sin{\alpha}\sin{\gamma} - \cos{\alpha}\sin{\beta}\cos{\gamma} & \cos{\beta}\cos{\gamma} & -(\cos{\alpha}\sin{\gamma} + \sin{\alpha}\sin{\beta}\cos{\gamma})*x + (\cos{\alpha}\sin{\beta}\cos{\gamma} - \sin{\alpha}\sin{\gamma})*y - \cos{\beta}\cos{\gamma}*z \\
0 & 0 & 0 & 1
\end{pmatrix}
$$

<br>

$$
P = MV =
$$

$$
 \begin{pmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & \frac{1}{d} & 0
\end{pmatrix}\begin{pmatrix}
\cos{\alpha}\cos{\gamma} - \sin{\alpha}\sin{\beta}\sin{\gamma} & \sin{\alpha}\cos{\gamma} + \cos{\alpha}\sin{\beta}\sin{\gamma} & -\cos{\beta}\sin{\gamma}  & (\sin{\alpha}\sin{\beta}\sin{\gamma} - \cos{\alpha}\cos{\gamma})*x - (\sin{\alpha}\cos{\gamma} + \cos{\alpha}\sin{\beta}\sin{\gamma})*y + \cos{\beta}\sin{\gamma}*z \\
-\sin{\alpha}\cos{\beta} & \cos{\alpha}\cos{\beta} & \sin{\beta} & \sin{\alpha}\cos{\beta}*x - \cos{\alpha}\cos{\beta}*y - \sin{\beta}*z \\
 \cos{\alpha}\sin{\gamma} + \sin{\alpha}\sin{\beta}\cos{\gamma} & \sin{\alpha}\sin{\gamma} - \cos{\alpha}\sin{\beta}\cos{\gamma} & \cos{\beta}\cos{\gamma} & -(\cos{\alpha}\sin{\gamma} + \sin{\alpha}\sin{\beta}\cos{\gamma})*x + (\cos{\alpha}\sin{\beta}\cos{\gamma} - \sin{\alpha}\sin{\gamma})*y - \cos{\beta}\cos{\gamma}*z \\
0 & 0 & 0 & 1
\end{pmatrix} = 
$$

$$

\begin{pmatrix}
\cos{\alpha}\cos{\gamma} - \sin{\alpha}\sin{\beta}\sin{\gamma} & \sin{\alpha}\cos{\gamma} + \cos{\alpha}\sin{\beta}\sin{\gamma} & -\cos{\beta}\sin{\gamma}  & (\sin{\alpha}\sin{\beta}\sin{\gamma} - \cos{\alpha}\cos{\gamma})*x - (\sin{\alpha}\cos{\gamma} + \cos{\alpha}\sin{\beta}\sin{\gamma})*y + \cos{\beta}\sin{\gamma}*z \\
-\sin{\alpha}\cos{\beta} & \cos{\alpha}\cos{\beta} & \sin{\beta} & \sin{\alpha}\cos{\beta}*x - \cos{\alpha}\cos{\beta}*y - \sin{\beta}*z \\
 \cos{\alpha}\sin{\gamma} + \sin{\alpha}\sin{\beta}\cos{\gamma} & \sin{\alpha}\sin{\gamma} - \cos{\alpha}\sin{\beta}\cos{\gamma} & \cos{\beta}\cos{\gamma} & -(\cos{\alpha}\sin{\gamma} + \sin{\alpha}\sin{\beta}\cos{\gamma})*x + (\cos{\alpha}\sin{\beta}\cos{\gamma} - \sin{\alpha}\sin{\gamma})*y - \cos{\beta}\cos{\gamma}*z \\
\frac{\cos{\alpha}\sin{\gamma} + \sin{\alpha}\sin{\beta}\cos{\gamma}}{d} & \frac{\sin{\alpha}\sin{\gamma} - \cos{\alpha}\sin{\beta}\cos{\gamma}}{d} & \frac{\cos{\beta}\cos{\gamma}}{d} & \frac{-(\cos{\alpha}\sin{\gamma} + \sin{\alpha}\sin{\beta}\cos{\gamma})*x + (\cos{\alpha}\sin{\beta}\cos{\gamma} - \sin{\alpha}\sin{\gamma})*y - \cos{\beta}\cos{\gamma}*z}{d}
\end{pmatrix}
$$

## **Task 4:** Consider a satellite orbiting the earth. Its position above the earth is specified in polar coorindates. Find a model-view matrix that keeps the viewer looking at the earth. Such a matrix could be used to show the earth as it rotates. *(2 points)*
Assumption: polar coordinates refers to spherical coordinates.
Satellite position/rotation defined as $(r,\phi,\theta)$
$$r\dots Distance\ from\ Origin$$
$$\phi\dots Angle\ to\ z-Axis$$
$$\theta\dots Angle\ to\ y-Axis$$

<br>

If we convert the polar coordinates to the cartesian coordinates, we get (following the coordinate system that WebGL uses):

$$x = r*\sin{\theta}\sin{\phi}$$
$$y = r*\cos{\theta}$$
$$z = r*\sin{\theta}\cos{\phi}$$

<br>

$$
T = 
\begin{pmatrix}
1 & 0 & 0 & x \\
0 & 1 & 0 & y \\
0 & 0 & 1 & z \\
0 & 0 & 0 & 1
\end{pmatrix} = \begin{pmatrix}
1 & 0 & 0 & r*\sin{\theta}\sin{\phi} \\
0 & 1 & 0 & r*\cos{\theta} \\
0 & 0 & 1 & r*\sin{\theta}\cos{\phi} \\
0 & 0 & 0 & 1
\end{pmatrix}
$$

<br>

$$
T^{-1} = 
\begin{pmatrix}
1 & 0 & 0 & -x \\
0 & 1 & 0 & -y \\
0 & 0 & 1 & -z \\
0 & 0 & 0 & 1
\end{pmatrix} = \begin{pmatrix}
1 & 0 & 0 & -r*\sin{\theta}\sin{\phi} \\
0 & 1 & 0 & -r*\cos{\theta} \\
0 & 0 & 1 & -r*\sin{\theta}\cos{\phi} \\
0 & 0 & 0 & 1
\end{pmatrix}
$$

<br>

$$
R_y = 
\begin{pmatrix}
\cos{\phi} & 0 & \sin{\phi} & 0 \\
0 & 1 & 0  & 0 \\
-\sin{\phi} & 0 & \cos{\phi} & 0 \\
0 & 0 & 0 & 1  
\end{pmatrix}

R_z =
\begin{pmatrix}
\cos{\theta} & -\sin{\theta} & 0 & 0 \\
\sin{\theta} & \cos{\theta} & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix}
$$

<br>

$$
R^{-1} = R^T = (R_z R_y)^T = R_y^T R_z^T = \begin{pmatrix}
\cos{\phi} & 0 & -\sin{\phi} & 0 \\
0 & 1 & 0  & 0 \\
\sin{\phi} & 0 & \cos{\phi} & 0 \\
0 & 0 & 0 & 1  
\end{pmatrix}
\begin{pmatrix}
\cos{\theta} & \sin{\theta} & 0 & 0 \\
-\sin{\theta} & \cos{\theta} & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{pmatrix} =
$$

$$
 \begin{pmatrix}
\cos{\phi}\cos{\theta} & \cos{\phi}\sin{\theta} & -\sin{\phi} & 0 \\
-\sin{\theta} & \cos{\theta} & 0  & 0 \\
\sin{\phi}\cos{\theta} & \sin{\phi}\sin{\theta} & \cos{\phi} & 0 \\
0 & 0 & 0 & 1  
\end{pmatrix}
$$

<br>

$$
V = (TR)^{-1} = R^{-1} T^{-1} = \begin{pmatrix}
\cos{\phi}\cos{\theta} & \cos{\phi}\sin{\theta} & -\sin{\phi} & 0 \\
-\sin{\theta} & \cos{\theta} & 0  & 0 \\
\sin{\phi}\cos{\theta} & \sin{\phi}\sin{\theta} & \cos{\phi} & 0 \\
0 & 0 & 0 & 1  
\end{pmatrix}\begin{pmatrix}
1 & 0 & 0 & -r*\sin{\theta}\sin{\phi} \\
0 & 1 & 0 & -r*\cos{\theta} \\
0 & 0 & 1 & -r*\sin{\theta}\cos{\phi} \\
0 & 0 & 0 & 1
\end{pmatrix} = 
$$

$$
\begin{pmatrix}
\cos{\phi}\cos{\theta} & \cos{\phi}\sin{\theta} & -\sin{\phi} & -r*\sin{\phi}\cos{\phi}\sin{\theta}\cos{\theta} - r*\cos{\phi}\sin{\theta}\cos{\theta} + r*\sin{\phi}\cos{\phi}\sin{\theta} \\
-\sin{\theta} & \cos{\theta} & 0  & r*\sin{\phi}\sin^2{\theta} - r*\cos^2{\theta}\\
\sin{\phi}\cos{\theta} & \sin{\phi}\sin{\theta} & \cos{\phi} & -r*\sin^2{\phi}\sin{\theta}\cos{\theta} - r*\sin{\phi}\sin{\theta}\cos{\theta} - r*\cos^2{\phi}\sin{\theta} \\
0 & 0 & 0 & 1  
\end{pmatrix}
$$

$$V\dots model-view\ matrix$$

## **Task 5:**  Find the projection of a point onto the plane $ax + by + cz + d = 0$ from a light source located at infinity in the direction ($d_x,d_y,d_z$). *(2 points)* 

$$
\vec{d} = \begin{pmatrix}
d_x \\
d_y \\
d_z
\end{pmatrix}
$$

<br>

$$
P = \begin{pmatrix}
p_x \\
p_y \\
p_z
\end{pmatrix}
$$

<br>

$$
P_p = P + \alpha*\vec{d}
$$

<br>

$$a(p_x + \alpha*d_x) + b(p_y + \alpha*d_y) + c(p_z + \alpha*d_z) + d = 0$$
$$ap_x + a\alpha*d_x + bp_y + b\alpha*d_y + cp_z + c\alpha*d_z + d = 0$$
$$\alpha(ad_x + bd_y + cd_z) + ap_x + bp_y + cp_z + d = 0$$
$$\alpha(ad_x + bd_y + cd_z) = -(ap_x + bp_y + cp_z + d)$$
$$\mathbf{\alpha = -\frac{ap_x + bp_y + cp_z + d}{ad_x + bd_y + cd_z}}$$
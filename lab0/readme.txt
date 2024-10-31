Paragraph Edward Angel, Dave Shreiner-Interactive Computer Graphics. A Top-Down Approach with WebGL-Pearson (2014) 7th Edition:
    "The constant d is based on the distance to the neighbors and is determined by the res-
    olution of the texture image. The second constant s controls the amount of smooth-
    ing. For example, if s is set to 4, we are averaging with no change in the average color
    across the image. A larger value of s reduces the brightness of the resulting image." 
    (Chapter 7 Discrete Techniques, page 386)

WebGL(2) Tutorial link: https://webgl2fundamentals.org/webgl/lessons/webgl-fundamentals.html
    Improvement potential:
        The tutorial explains WebGL2 in a way that is easy to understand. However some ofthe code snippets shown 
        are on the website inconsistent. They are either not used in the final code or moved to unexpected locations.
        Also, since the shader sources are stored in multiline strings, they lack syntax highlighting and the webglUtils
        object referenced in all of the executeable code snippets refers to functions that were moved into a seperate file
        and manually bundled in a webglUtil object. Including one function only explained in a seperate tutorial (resizeCanvasToDisplaySize).

In order to start the program, it should be enough to open the lab0.html file in the browser. 
However it requires the styles.css and webgl-utils.js files to be in the same folder.
#ifndef SURFACE_H
#define SURFACE_H

#include "point3d.h"
#include "material.h"


struct Surface {
    Material material;
    Point3D position;

    //for no intersection in intersection class only
    Surface();

    Surface(Material material, Point3D position);
    
    ~Surface();

};


#endif //SURFACE_H
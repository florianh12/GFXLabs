#ifndef SURFACE_H
#define SURFACE_H

#include "point3d.h"
#include "parallellight.h"
#include "material.h"

struct RaySphereIntersection;


struct Surface {
    Material material;
    Point3D position;

    Surface(Material material, Point3D position);
    
    ~Surface();

};


#endif //SURFACE_H
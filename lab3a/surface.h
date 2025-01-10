#ifndef SURFACE_H
#define SURFACE_H

#include "point3d.h"
#include "color.h"

struct Surface {
    Color color;
    Point3D position;

    Surface(Color color, Point3D position);
    ~Surface();
};


#endif //SURFACE_H
#include "surface.h"
#include "material.h"
#include "point3d.h"
#include "raysphereintersection.h"

//for no intersection in intersection class only
Surface::Surface() {}

Surface::Surface(Material material, Point3D position) : material{material}, position{position} {}

Surface::~Surface() {}
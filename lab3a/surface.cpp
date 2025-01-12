#include "surface.h"
#include "raysphereintersection.h"

Surface::Surface(Material material, Point3D position) : material{material}, position{position} {}

Surface::~Surface() {}
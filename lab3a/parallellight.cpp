#include "parallellight.h"

 ParallelLight::ParallelLight(Color color, Vec3 direction) : Light{color}, direction{direction} {
    direction.normalize();
 }

ParallelLight::~ParallelLight() {};
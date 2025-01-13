#include "light.h"
#include "parallellight.h"

 ParallelLight::ParallelLight(Color color, Vec3 direction) : Light{color}, direction{direction} {
    this->direction.normalize();
 }

ParallelLight::~ParallelLight() {};
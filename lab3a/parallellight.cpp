#include "parallellight.h"

 ParallelLight::ParallelLight(Color col, Vec3 direction) : Light{col}, direction{direction} {
    direction.normalize();
 }

ParallelLight::~ParallelLight() {};
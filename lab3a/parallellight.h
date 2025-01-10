#ifndef PARALLELLIGHT_H
#define PARALLELLIGHT_H

#include "color.h"
#include "light.h"
#include "vec3.h"


struct ParallelLight : public Light
{
    Vec3 direction;

    ParallelLight(Color color, Vec3 direction);

    ~ParallelLight();
};



#endif //PARALLELLIGHT_H
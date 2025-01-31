#ifndef PARALLELLIGHT_H
#define PARALLELLIGHT_H

#include "vec3.h"
#include "color.h"
#include "light.h"


struct ParallelLight : public Light
{
    Vec3 direction;

    ParallelLight(Color color, Vec3 direction);

    ~ParallelLight();
};



#endif //PARALLELLIGHT_H
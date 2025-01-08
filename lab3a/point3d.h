#ifndef POINT3D_H
#define POINT3D_H

#include <string>
#include "vec3.h"

class Point3D {
        long double coordinates[3] = {0.0L,0.0L,0.0L};
    public:
        Point3D(long double x = 0.0L, long double y = 0.0L, long double z = 0.0L);

        //Print method
        std::string toString() const;

        //Operator Overrides
        Point3D operator+(const Vec3& other) const; // point + vec -> point
        Point3D& operator+=(const Vec3& other);
        Vec3 operator-(const Point3D& other) const; //Point - Point -> vec
        Point3D operator-(const Vec3& other) const; //Point - Vec -> Point
        Point3D& operator-=(const Vec3& other); // Point - Vec
        bool operator==(const Point3D& other) const;
        long double& operator[](int index);
        const long double& operator[](int index) const; 

        ~Point3D();
};

#endif //POINT3D_H
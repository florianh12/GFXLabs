#include "point3d.h"
#include <string>
#include <stdexcept>

Point3D::Point3D(long double x, long double y, long double z){
    coordinates[0] = x;
    coordinates[1] = y;
    coordinates[2] = z;
}


std::string Point3D::toString() const {
    return "(" + std::to_string(coordinates[0]) + ", " 
    + std::to_string(coordinates[1]) + ", " 
    + std::to_string(coordinates[2]) + ")\n";
}



// Operator Overrides
Point3D Point3D::operator+(const Vec3& other) const {
    return Point3D(
        coordinates[0] + other[0],
        coordinates[1] + other[1],
        coordinates[2] + other[2]
    );
}

Point3D& Point3D::operator+=(const Vec3& other) {
    coordinates[0] += other[0];
    coordinates[1] += other[1];
    coordinates[2] += other[2];

    return *this;
}

Vec3 Point3D::operator-(const Point3D& other) const {
    return Vec3(
        coordinates[0] - other.coordinates[0],
        coordinates[1] - other.coordinates[1],
        coordinates[2] - other.coordinates[2]
    );
}

Point3D& Point3D::operator-=(const Vec3& other) {
    coordinates[0] -= other[0];
    coordinates[1] -= other[1];
    coordinates[2] -= other[2];

    return *this;
}




bool Point3D::operator==(const Point3D& other) const {
    return coordinates[0] == other.coordinates[0] 
    && coordinates[1] == other.coordinates[1] 
    && coordinates[2] == other.coordinates[2];
}

long double& Point3D::operator[](int index) {
    double within_range = index / 3.0;

    if(within_range > 1.0 || within_range < -1.0) {
        throw std::runtime_error("Index: "+std::to_string(index)+" not in range 3 <-> -3!");
    }

    // enable access to last elements with -x syntax 
    if (index < 0) {
        index = 3 - index;
    }

    return coordinates[index];
}

const long double& Point3D::operator[](int index) const {
    double within_range = index / 3.0;
    
    if(within_range > 1.0 || within_range < -1.0) {
        throw std::runtime_error("Index: "+std::to_string(index)+" not in range 3 <-> -3!");
    }

    // enable access to last elements with -x syntax 
    if (index < 0) {
        index = 3 - index;
    }

    return coordinates[index];
} 


Point3D::~Point3D() {}

std::ostream& operator<<(std::ostream& o, const Point3D& point) {
    o << point.toString();

    return o;
}
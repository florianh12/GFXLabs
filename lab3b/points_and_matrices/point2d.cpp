#include "point2d.h"
#include <string>
#include <stdexcept>

Point2D::Point2D(long double x, long double y){
    coordinates[0] = x;
    coordinates[1] = y;
}


std::string Point2D::toString() const {
    return "(" + std::to_string(coordinates[0]) + ", " 
    + std::to_string(coordinates[1]) + ")\n";
}



// Operator Overrides

//uv calculation
Point2D Point2D::operator+(const Point2D& other) const {
    return Point2D(coordinates[0] + other.coordinates[0],
    coordinates[1] + other.coordinates[1]);
}

bool Point2D::operator==(const Point2D& other) const {
    return coordinates[0] == other.coordinates[0] 
    && coordinates[1] == other.coordinates[1];
}

long double& Point2D::operator[](int index) {
    double within_range = index / 2.0;

    if(within_range >= 1.0 || within_range < -1.0) {
        throw std::runtime_error("Index: "+std::to_string(index)+" not in range 2 <-> -3!");
    }

    // enable access to last elements with -x syntax 
    if (index < 0) {
        index = 2 + index;
    }

    return coordinates[index];
}

const long double& Point2D::operator[](int index) const {
    double within_range = index / 2.0;
    
    if(within_range >= 1.0 || within_range < -1.0) {
        throw std::runtime_error("Index: "+std::to_string(index)+" not in range 2 <-> -3!");
    }

    // enable access to last elements with -x syntax 
    if (index < 0) {
        index = 2 + index;
    }

    return coordinates[index];
} 

//uv calculation
Point2D operator*(const long double scalar, const Point2D& point) {
    return Point2D(scalar * point.coordinates[0], scalar * point.coordinates[1]);
}


Point2D::~Point2D() {}

std::ostream& operator<<(std::ostream& o, const Point2D& point) {
    o << point.toString();

    return o;
}
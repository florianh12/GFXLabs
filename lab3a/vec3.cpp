#include "vec3.h"
#include <string>
#include <stdexcept>
#include <cmath>

Vec3::Vec3(long double x, long double y, long double z){
    coordinates[0] = x;
    coordinates[1] = y;
    coordinates[2] = z;
}


// cross and dot product
long double Vec3::dot(const Vec3& other) const {
    return coordinates[0] * other.coordinates[0] 
    + coordinates[1] * other.coordinates[1] 
    + coordinates[2] * other.coordinates[2];
}

Vec3 Vec3::cross(const Vec3& other) const {
    return Vec3(
        coordinates[1] * other.coordinates[2] - coordinates[2] * other.coordinates[1],
        coordinates[2] * other.coordinates[0] - coordinates[0] * other.coordinates[2],
        coordinates[0] * other.coordinates[1] - coordinates[1] * other.coordinates[0]
        );
}

//vector norm and normalize function
long double Vec3::vec_norm() {
    return std::sqrt(coordinates[0] * coordinates[0] 
    + coordinates[1] * coordinates[1] 
    + coordinates[2] * coordinates[2]);
}
void Vec3::normalize() {
    long double norm = vec_norm();
    
    coordinates[0] /= norm;
    coordinates[1] /= norm;
    coordinates[2] /= norm;
}


std::string Vec3::toString() const {

    return "[" + std::to_string(coordinates[0]) + ", " 
    + std::to_string(coordinates[1]) + ", " 
    + std::to_string(coordinates[2]) + "]\n";

}



// Operator Overrides
Vec3 Vec3::operator+(const Vec3& other) const{
    return Vec3(
        coordinates[0] + other.coordinates[0],
        coordinates[1] + other.coordinates[1],
        coordinates[2] + other.coordinates[2]
    );
}

Vec3& Vec3::operator+=(const Vec3& other) {
    coordinates[0] += other.coordinates[0];
    coordinates[1] += other.coordinates[1];
    coordinates[2] += other.coordinates[2];

    return *this;
}

Vec3 Vec3::operator-(const Vec3& other) const {
    return Vec3(
        coordinates[0] - other.coordinates[0],
        coordinates[1] - other.coordinates[1],
        coordinates[2] - other.coordinates[2]
    );
}

Vec3& Vec3::operator-=(const Vec3& other) {
    coordinates[0] -= other.coordinates[0];
    coordinates[1] -= other.coordinates[1];
    coordinates[2] -= other.coordinates[2];

    return *this;
}

//dot product     
long double Vec3::operator*(const Vec3& other) const{
    return dot(other);
} 

// scalar poduct left
Vec3 Vec3::operator*(long double scalar) const {
    return Vec3(
        coordinates[0] * scalar,
        coordinates[1] * scalar,
        coordinates[2] * scalar
    );
} 

//cross product
Vec3 Vec3::operator%(const Vec3& other) const {
    return cross(other);
} 

bool Vec3::operator==(const Vec3& other) const {
    return coordinates[0] == other.coordinates[0] 
    && coordinates[1] == other.coordinates[1] 
    && coordinates[2] == other.coordinates[2];
}

long double& Vec3::operator[](int index) {
    double within_range = index / 3.0;

    if(within_range >= 1.0 || within_range < -1.0) {
        throw std::runtime_error("Index: "+std::to_string(index)+" not in range 2 <-> -3!");
    }

    // enable access to last elements with -x syntax 
    if (index < 0) {
        index = 3 + index;
    }

    return coordinates[index];
}

const long double& Vec3::operator[](int index) const {
    double within_range = index / 3.0;
    
    if(within_range >= 1.0 || within_range < -1.0) {
        throw std::runtime_error("Index: "+std::to_string(index)+" not in range 2 <-> -3!");
    }

    // enable access to last elements with -x syntax 
    if (index < 0) {
        index = 3 + index;
    }

    return coordinates[index];
} 

Vec3 operator*(long double scalar, const Vec3& vec) {
    return vec * scalar; 
}

Vec3::~Vec3() {}

std::ostream& operator<<(std::ostream& o, const Vec3& vec) {
    o << vec.toString();

    return o;
}
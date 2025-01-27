#ifndef MAT3_H
#define MAT3_H

#include "vec3.h"
#include "point3d.h"

//lib dependencies
#include <string>

class Mat3  {
    long double matrix[3][3] = {
        {1.0L,0.0L,0.0L},
        {0.0L,1.0L,0.0L},
        {0.0L,0.0L,1.0L}
    };
    
    public:
        Mat3() {};
        //initialize with long double matrix[3][3]
        Mat3(long double* matrix) : matrix{*matrix} {}
        
        //cross and dot product
        long double dot(const Vec3& other) const;
        long double dot(const Point3D& other) const;
        long double dot(const Mat3& other) const;

        //Print method
        std::string toString() const;

        //Operator Overrides
        Mat3 operator+(const Mat3& other) const;
        Mat3& operator+=(const Mat3& other);

        Mat3 operator-(const Mat3& other) const;
        Mat3& operator-=(const Mat3& other);

        Mat3 operator*(const Mat3& other) const; //will be the dot product
        Mat3 operator*(const Vec3& other) const;
        Mat3 operator*(const Point3D& other) const;
        Mat3 operator*(long double scalar) const; //will be the scalar poduct left

        Mat3 operator/(long double scalar) const;

        
        bool operator==(const Mat3& other) const;
        
        long double& at(int row, int column);
        long double& at(const int row, const int column) const;

        //will be the scalar poduct right
        friend Mat3 operator*(long double scalar, const Mat3& vec);
        
        ~Mat3() {}
};




#endif
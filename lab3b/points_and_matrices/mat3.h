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
        Mat3(Vec3 X, Vec3 Y, Vec3 Z) {
            matrix[0][0] = X[0];
            matrix[1][0] = X[1];
            matrix[2][0] = X[2];

            matrix[0][1] = Y[0];
            matrix[1][1] = Y[1];
            matrix[2][1] = Y[2];

            matrix[0][2] = Z[0];
            matrix[1][2] = Z[1];
            matrix[2][2] = Z[2];
        }
        
        // dot product
        Vec3 dot(const Vec3& other) const;
        Point3D dot(const Point3D& other) const;
        Mat3 dot(const Mat3& other) const;

        //Print method
        std::string toString() const;

        //Operator Overrides
        Mat3 operator+(const Mat3& other) const;
        Mat3& operator+=(const Mat3& other);

        Mat3 operator-(const Mat3& other) const;
        Mat3& operator-=(const Mat3& other);

        Mat3 operator*(const Mat3& other) const; //will be the dot product
        Vec3 operator*(const Vec3& other) const;
        Point3D operator*(const Point3D& other) const;
        Mat3 operator*(long double scalar) const; //will be the scalar poduct left

        Mat3 operator/(long double scalar) const;

        
        bool operator==(const Mat3& other) const;
        
        long double& at(int row, int column);

        //will be the scalar poduct right
        friend Mat3 operator*(long double scalar, const Mat3& mat);
        friend Mat3 operator/(long double scalar, const Mat3& mat);
        
        ~Mat3() {}
};




#endif
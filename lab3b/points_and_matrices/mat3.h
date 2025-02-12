#ifndef MAT3_H
#define MAT3_H

#include "vec3.h"
#include "point3d.h"

//lib dependencies
#include <string>
#include <cmath>

inline long double degToRad(long double deg) {
    return (deg * M_PI) / 180.0L;
}

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
        //lookat matrix
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
        //rotation matrix
        Mat3(char axis,long double angle) : Mat3()  {
            angle = degToRad(angle);
            
            if(axis == 'x') {

                matrix[1][1] = std::cos(angle);
                matrix[1][2] = -std::sin(angle);

                matrix[2][1] = std::sin(angle);
                matrix[2][2] = std::cos(angle);

            } else if (axis == 'y') {

                matrix[0][0] = std::cos(angle);
                matrix[0][2] = std::sin(angle);

                matrix[2][0] = -std::sin(angle);
                matrix[2][2] = std::cos(angle);

            } else if (axis == 'z') {
               
                matrix[0][0] = std::cos(angle);
                matrix[0][1] = -std::sin(angle);

                matrix[1][0] = std::sin(angle);
                matrix[1][1] = std::cos(angle);
 
            }
        }

        
        // dot product
        Vec3 dot(const Vec3& other) const;
        Point3D dot(const Point3D& other) const;
        Mat3 dot(const Mat3& other) const;

        //Transpose
        Mat3 T();

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

std::ostream& operator<<(std::ostream& o, const Mat3& mat3);



#endif
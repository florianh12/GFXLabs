#include "mat3.h"

// dot products
Vec3 Mat3::dot(const Vec3& other) const {
    return Vec3(matrix[0][0]*other[0] + matrix[0][1]*other[1] + matrix[0][2]*other[2],
    matrix[1][0]*other[0] + matrix[1][1]*other[1] + matrix[1][2]*other[2],
    matrix[2][0]*other[0] + matrix[2][1]*other[1] + matrix[2][2]*other[2]);
}

Point3D Mat3::dot(const Point3D& other) const {
    return Point3D(matrix[0][0]*other[0] + matrix[0][1]*other[1] + matrix[0][2]*other[2],
    matrix[1][0]*other[0] + matrix[1][1]*other[1] + matrix[1][2]*other[2],
    matrix[2][0]*other[0] + matrix[2][1]*other[1] + matrix[2][2]*other[2]);
}

Mat3 Mat3::dot(const Mat3& other) const {
    return Mat3({
                {
                    matrix[0][0]*other.matrix[0][0] + matrix[0][1]*other.matrix[1][0] + matrix[0][2]*other.matrix[2][0],
                    matrix[0][0]*other.matrix[0][1] + matrix[0][1]*other.matrix[1][1] + matrix[0][2]*other.matrix[2][1],
                    matrix[0][0]*other.matrix[0][2] + matrix[0][1]*other.matrix[1][2] + matrix[0][2]*other.matrix[2][2]
                },
                {
                    matrix[1][0]*other.matrix[0][0] + matrix[1][1]*other.matrix[1][0] + matrix[1][2]*other.matrix[2][0],
                    matrix[1][0]*other.matrix[0][1] + matrix[1][1]*other.matrix[1][1] + matrix[1][2]*other.matrix[2][1],
                    matrix[1][0]*other.matrix[0][2] + matrix[1][1]*other.matrix[1][2] + matrix[1][2]*other.matrix[2][2]
                },
                {
                    matrix[2][0]*other.matrix[0][0] + matrix[2][1]*other.matrix[1][0] + matrix[2][2]*other.matrix[2][0],
                    matrix[2][0]*other.matrix[0][1] + matrix[2][1]*other.matrix[1][1] + matrix[2][2]*other.matrix[2][1],
                    matrix[2][0]*other.matrix[0][2] + matrix[2][1]*other.matrix[1][2] + matrix[2][2]*other.matrix[2][2]
                }
            });
}


//Transpose
Mat3 Mat3::T()  {
    return Mat3({
        {matrix[0][0], matrix[0][1], matrix[0][2]},
        {matrix[1][0], matrix[1][1], matrix[1][2] },
        {matrix[2][0], matrix[2][1], matrix[2][2]}
    });
}

//Print method
std::string Mat3::toString() const {
    return "Mat3 [\n\t["+std::to_string(matrix[0][0])+", "+std::to_string(matrix[0][1])+", "+std::to_string(matrix[0][2])+"],"+
                "\n\t["+std::to_string(matrix[1][0])+", "+std::to_string(matrix[1][1])+", "+std::to_string(matrix[1][2])+"],"+
                "\n\t["+std::to_string(matrix[2][0])+", "+std::to_string(matrix[2][1])+", "+std::to_string(matrix[2][2])+"]\n]\n";
}

//Operator Overrides
Mat3 Mat3::operator+(const Mat3& other) const   {
    return Mat3({
        {matrix[0][0]+other.matrix[0][0],matrix[0][1]+other.matrix[0][1],matrix[0][2]+other.matrix[0][2]},
        {matrix[1][0]+other.matrix[1][0],matrix[1][1]+other.matrix[1][1],matrix[1][2]+other.matrix[1][2]},
        {matrix[2][0]+other.matrix[2][0],matrix[2][1]+other.matrix[2][1],matrix[2][2]+other.matrix[2][2]}
    });
}

Mat3& Mat3::operator+=(const Mat3& other) {
    matrix[0][0] += other.matrix[0][0];
    matrix[0][1] += other.matrix[0][1];
    matrix[0][2] += other.matrix[0][2];

    matrix[1][0] += other.matrix[1][0];
    matrix[1][1] += other.matrix[1][1];
    matrix[1][2] += other.matrix[1][2];

    matrix[2][0] += other.matrix[2][0];
    matrix[2][1] += other.matrix[2][1];
    matrix[2][2] += other.matrix[2][2];

    return *this;
}

Mat3 Mat3::operator-(const Mat3& other) const   {
    return Mat3({
        {matrix[0][0]-other.matrix[0][0],matrix[0][1]-other.matrix[0][1],matrix[0][2]-other.matrix[0][2]},
        {matrix[1][0]-other.matrix[1][0],matrix[1][1]-other.matrix[1][1],matrix[1][2]-other.matrix[1][2]},
        {matrix[2][0]-other.matrix[2][0],matrix[2][1]-other.matrix[2][1],matrix[2][2]-other.matrix[2][2]}
    });
}
Mat3& Mat3::operator-=(const Mat3& other)   {
    matrix[0][0] -= other.matrix[0][0];
    matrix[0][1] -= other.matrix[0][1];
    matrix[0][2] -= other.matrix[0][2];

    matrix[1][0] -= other.matrix[1][0];
    matrix[1][1] -= other.matrix[1][1];
    matrix[1][2] -= other.matrix[1][2];

    matrix[2][0] -= other.matrix[2][0];
    matrix[2][1] -= other.matrix[2][1];
    matrix[2][2] -= other.matrix[2][2];

    return *this;
}
//will be the dot product

Mat3 Mat3::operator*(const Mat3& other) const {
    return dot(other);
} 
Vec3 Mat3::operator*(const Vec3& other) const {
    return dot(other);
}
Point3D Mat3::operator*(const Point3D& other) const {
    return dot(other);
}
//will be the scalar poduct left

Mat3 Mat3::operator*(long double scalar) const {
    return Mat3({
        {matrix[0][0]*scalar,matrix[0][1]*scalar,matrix[0][2]*scalar},
        {matrix[1][0]*scalar,matrix[1][1]*scalar,matrix[1][2]*scalar},
        {matrix[2][0]*scalar,matrix[2][1]*scalar,matrix[2][2]*scalar}
    });
} 
Mat3 Mat3::operator/(long double scalar) const {
return Mat3({
        {matrix[0][0]/scalar,matrix[0][1]/scalar,matrix[0][2]/scalar},
        {matrix[1][0]/scalar,matrix[1][1]/scalar,matrix[1][2]/scalar},
        {matrix[2][0]/scalar,matrix[2][1]/scalar,matrix[2][2]/scalar}
    });
}


bool Mat3::operator==(const Mat3& other) const {
    return matrix[0][0] == other.matrix[0][0] && matrix[0][1] == other.matrix[0][1] && matrix[0][2] == other.matrix[0][2] && 
        matrix[1][0] == other.matrix[1][0] && matrix[1][1] == other.matrix[1][1] && matrix[1][2] == other.matrix[1][2] && 
        matrix[2][0] == other.matrix[2][0] && matrix[2][1] == other.matrix[2][1] && matrix[2][2] == other.matrix[2][2];
}

long double& Mat3::at(int row, int column) {
    return matrix[row][column];
}


//will be the scalar poduct right
Mat3 operator*(long double scalar, const Mat3& mat) {
    return mat * scalar;
}
Mat3 operator/(long double scalar, const Mat3& mat) {
    return mat / scalar;
}

std::ostream& operator<<(std::ostream& o, const Mat3& mat3) {
    o << mat3.toString();

    return o;
}
#ifndef VEC3_H
#define VEC3_H

#include <string>

class Vec3  {
        long double coordinates[3] = {0.0L,0.0L,0.0L};
    public:
        Vec3(long double x = 0.0L, long double y = 0.0L, long double z = 0.0L);

        //cross and dot product
        long double dot(const Vec3& other) const;
        Vec3 cross(const Vec3& other) const;
        
        //vector norm and normalize function
        long double vec_norm();
        void normalize();

        //Print method
        std::string toString() const;

        //Operator Overrides
        Vec3 operator+(const Vec3& other) const;
        Vec3& operator+=(const Vec3& other);
        Vec3 operator-(const Vec3& other) const;
        Vec3& operator-=(const Vec3& other);
        long double operator*(const Vec3& other) const; //will be the dot product
        Vec3 operator*(long double scalar) const; //will be the scalar poduct left
        Vec3 operator%(const Vec3& other) const; //will be the cross product
        bool operator==(const Vec3& other) const;
        long double& operator[](int index);
        const long double& operator[](int index) const; 

        //will be the scalar poduct right
        friend Vec3 operator*(long double scalar, const Vec3& vec);

        ~Vec3();
};

std::ostream& operator<<(std::ostream& o, const Vec3& vec);

#endif // VEC3_H
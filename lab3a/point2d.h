#ifndef POINT2D_H
#define POINT2D_H

#include <string>

class Point2D {
        long double coordinates[2] = {0.0L,0.0L};
    public:
        Point2D(long double x = 0.0L, long double y = 0.0L);

        //Print method
        std::string toString() const;

        //Operator Overrides
        bool operator==(const Point2D& other) const;
        long double& operator[](int index);
        const long double& operator[](int index) const; 

        ~Point2D();
};

std::ostream& operator<<(std::ostream& o, const Point2D& point);

#endif //POINT2D_H
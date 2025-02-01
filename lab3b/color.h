#ifndef COLOR_H
#define COLOR_H

#include <string>

struct Color
{
    long double r_normalized;
    long double g_normalized;
    long double b_normalized;

    Color();
    
    Color(long double r_normalized, long double g_normalized, long double b_normalized);

    std::string toString() const;

    Color& operator+=(const Color& other);
    Color operator+(const Color& other) const;
    Color& operator*=(const long double scalar);
    Color operator*(const Color& other) const;

    friend Color operator*(long double scalar, Color& col);
};

std::ostream& operator<<(std::ostream& o, const Color& color);


#endif //COLOR_H
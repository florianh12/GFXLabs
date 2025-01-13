#ifndef COLOR_H
#define COLOR_H

struct Color
{
    long double r_normalized;
    long double g_normalized;
    long double b_normalized;

    Color();
    
    Color(long double r_normalized, long double g_normalized, long double b_normalized);

    Color& operator+=(const Color& other);
    Color operator+(const Color& other) const;
    Color operator*(const Color& other) const;

    friend Color operator*(long double scalar, Color& col);
};


#endif //COLOR_H
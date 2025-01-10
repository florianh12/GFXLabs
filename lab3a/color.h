#ifndef COLOR_H
#define COLOR_H

struct Color
{
    unsigned char r;
    unsigned char g;
    unsigned char b;

    Color(double r_normalized, double g_normalized, double b_normalized);
};


#endif //COLOR_H
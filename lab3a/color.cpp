#include "color.h"
#include <cmath>

Color::Color() : r_normalized{0.0L}, g_normalized{0.0L}, b_normalized{0.0L} {}

Color::Color(long double r_normalized, long double g_normalized, long double b_normalized) {
    this->r_normalized = r_normalized > 1.0L ? 1.0L : r_normalized;
    this->g_normalized = g_normalized > 1.0L ? 1.0L : g_normalized;
    this->b_normalized = b_normalized > 1.0L ? 1.0L : b_normalized;
}

Color& Color::operator+=(const Color& other) {

    //normalized values
    r_normalized += other.r_normalized;
    g_normalized += other.g_normalized;
    b_normalized += other.b_normalized;

    //clamp to 1.0
    if (r_normalized > 1.0L)
    {
        r_normalized = 1.0L;
    }
    if (g_normalized > 1.0L)
    {
        g_normalized = 1.0L;
    }
    if (b_normalized > 1.0L)
    {
        b_normalized = 1.0L;
    }

    return *this;
}

Color Color::operator+(const Color& other) const {
    return Color(r_normalized + other.r_normalized,
    g_normalized + other.g_normalized,
    b_normalized + other.b_normalized);
}

Color operator*(long double scalar, Color& col) {
   return Color(scalar * col.r_normalized,
    scalar * col.g_normalized,
    scalar * col.b_normalized);
}

Color Color::operator*(const Color& other) const {
   return Color(r_normalized* other.r_normalized,
    g_normalized * other.g_normalized,
    b_normalized * other.b_normalized);
}
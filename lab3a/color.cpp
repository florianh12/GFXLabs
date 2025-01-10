#include "color.h"
#include <cmath>

Color::Color(double r_normalized, double g_normalized, double b_normalized) {
    r = static_cast<unsigned char>(std::round(r_normalized * 255));
    g = static_cast<unsigned char>(std::round(g_normalized * 255));
    b = static_cast<unsigned char>(std::round(b_normalized * 255));
}
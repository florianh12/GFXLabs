# min cmake version
cmake_minimum_required(VERSION 3.10)

project(lab3a)

# c++ standard
set(CMAKE_CXX_STANDARD 17)

# executeable target
add_executable(lab3a lab3a.cpp vec3.cpp point3d.cpp tinyxml2.cpp)
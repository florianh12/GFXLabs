# min cmake version
cmake_minimum_required(VERSION 3.10)

project(lab3b)

# c++ standard
set(CMAKE_CXX_STANDARD 17)

# executeable target
add_executable(lab3b lab3b.cpp vec3.cpp point3d.cpp tinyxml2.cpp ray3d.cpp color.cpp material.cpp camera.cpp sphere.cpp scene.cpp mesh.cpp point2d.cpp)
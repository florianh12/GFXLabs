# min cmake version
cmake_minimum_required(VERSION 3.10)

project(lab3b)

# c++ standard
set(CMAKE_CXX_STANDARD 17)


# include all cpp files in executable includeing main directory
file(GLOB_RECURSE SOURCES "${CMAKE_SOURCE_DIR}/*.cpp")

# exclude build directory
list(FILTER SOURCES EXCLUDE REGEX "${CMAKE_SOURCE_DIR}/build/.*")

# executeable target
add_executable(lab3b ${SOURCES})

target_include_directories(lab3b PRIVATE ${CMAKE_SOURCE_DIR} surfaces lights materials_and_colors external_libraries scenes_and_cameras points_and_matrices vectors_and_rays)
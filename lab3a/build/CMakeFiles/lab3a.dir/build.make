# CMAKE generated file: DO NOT EDIT!
# Generated by "Unix Makefiles" Generator, CMake Version 3.22

# Delete rule output on recipe failure.
.DELETE_ON_ERROR:

#=============================================================================
# Special targets provided by cmake.

# Disable implicit rules so canonical targets will work.
.SUFFIXES:

# Disable VCS-based implicit rules.
% : %,v

# Disable VCS-based implicit rules.
% : RCS/%

# Disable VCS-based implicit rules.
% : RCS/%,v

# Disable VCS-based implicit rules.
% : SCCS/s.%

# Disable VCS-based implicit rules.
% : s.%

.SUFFIXES: .hpux_make_needs_suffix_list

# Command-line flag to silence nested $(MAKE).
$(VERBOSE)MAKESILENT = -s

#Suppress display of executed commands.
$(VERBOSE).SILENT:

# A target that is always out of date.
cmake_force:
.PHONY : cmake_force

#=============================================================================
# Set environment variables for the build.

# The shell in which to execute make rules.
SHELL = /bin/sh

# The CMake executable.
CMAKE_COMMAND = /usr/bin/cmake

# The command to remove a file.
RM = /usr/bin/cmake -E rm -f

# Escaping for special characters.
EQUALS = =

# The top-level source directory on which CMake was run.
CMAKE_SOURCE_DIR = /home/hejzef44/GFX/GFXLabs/lab3a

# The top-level build directory on which CMake was run.
CMAKE_BINARY_DIR = /home/hejzef44/GFX/GFXLabs/lab3a/build

# Include any dependencies generated for this target.
include CMakeFiles/lab3a.dir/depend.make
# Include any dependencies generated by the compiler for this target.
include CMakeFiles/lab3a.dir/compiler_depend.make

# Include the progress variables for this target.
include CMakeFiles/lab3a.dir/progress.make

# Include the compile flags for this target's objects.
include CMakeFiles/lab3a.dir/flags.make

CMakeFiles/lab3a.dir/lab3a.cpp.o: CMakeFiles/lab3a.dir/flags.make
CMakeFiles/lab3a.dir/lab3a.cpp.o: ../lab3a.cpp
CMakeFiles/lab3a.dir/lab3a.cpp.o: CMakeFiles/lab3a.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/hejzef44/GFX/GFXLabs/lab3a/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_1) "Building CXX object CMakeFiles/lab3a.dir/lab3a.cpp.o"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/lab3a.dir/lab3a.cpp.o -MF CMakeFiles/lab3a.dir/lab3a.cpp.o.d -o CMakeFiles/lab3a.dir/lab3a.cpp.o -c /home/hejzef44/GFX/GFXLabs/lab3a/lab3a.cpp

CMakeFiles/lab3a.dir/lab3a.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/lab3a.dir/lab3a.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/hejzef44/GFX/GFXLabs/lab3a/lab3a.cpp > CMakeFiles/lab3a.dir/lab3a.cpp.i

CMakeFiles/lab3a.dir/lab3a.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/lab3a.dir/lab3a.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/hejzef44/GFX/GFXLabs/lab3a/lab3a.cpp -o CMakeFiles/lab3a.dir/lab3a.cpp.s

CMakeFiles/lab3a.dir/vec3.cpp.o: CMakeFiles/lab3a.dir/flags.make
CMakeFiles/lab3a.dir/vec3.cpp.o: ../vec3.cpp
CMakeFiles/lab3a.dir/vec3.cpp.o: CMakeFiles/lab3a.dir/compiler_depend.ts
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --progress-dir=/home/hejzef44/GFX/GFXLabs/lab3a/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_2) "Building CXX object CMakeFiles/lab3a.dir/vec3.cpp.o"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -MD -MT CMakeFiles/lab3a.dir/vec3.cpp.o -MF CMakeFiles/lab3a.dir/vec3.cpp.o.d -o CMakeFiles/lab3a.dir/vec3.cpp.o -c /home/hejzef44/GFX/GFXLabs/lab3a/vec3.cpp

CMakeFiles/lab3a.dir/vec3.cpp.i: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Preprocessing CXX source to CMakeFiles/lab3a.dir/vec3.cpp.i"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -E /home/hejzef44/GFX/GFXLabs/lab3a/vec3.cpp > CMakeFiles/lab3a.dir/vec3.cpp.i

CMakeFiles/lab3a.dir/vec3.cpp.s: cmake_force
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green "Compiling CXX source to assembly CMakeFiles/lab3a.dir/vec3.cpp.s"
	/usr/bin/c++ $(CXX_DEFINES) $(CXX_INCLUDES) $(CXX_FLAGS) -S /home/hejzef44/GFX/GFXLabs/lab3a/vec3.cpp -o CMakeFiles/lab3a.dir/vec3.cpp.s

# Object files for target lab3a
lab3a_OBJECTS = \
"CMakeFiles/lab3a.dir/lab3a.cpp.o" \
"CMakeFiles/lab3a.dir/vec3.cpp.o"

# External object files for target lab3a
lab3a_EXTERNAL_OBJECTS =

lab3a: CMakeFiles/lab3a.dir/lab3a.cpp.o
lab3a: CMakeFiles/lab3a.dir/vec3.cpp.o
lab3a: CMakeFiles/lab3a.dir/build.make
lab3a: CMakeFiles/lab3a.dir/link.txt
	@$(CMAKE_COMMAND) -E cmake_echo_color --switch=$(COLOR) --green --bold --progress-dir=/home/hejzef44/GFX/GFXLabs/lab3a/build/CMakeFiles --progress-num=$(CMAKE_PROGRESS_3) "Linking CXX executable lab3a"
	$(CMAKE_COMMAND) -E cmake_link_script CMakeFiles/lab3a.dir/link.txt --verbose=$(VERBOSE)

# Rule to build all files generated by this target.
CMakeFiles/lab3a.dir/build: lab3a
.PHONY : CMakeFiles/lab3a.dir/build

CMakeFiles/lab3a.dir/clean:
	$(CMAKE_COMMAND) -P CMakeFiles/lab3a.dir/cmake_clean.cmake
.PHONY : CMakeFiles/lab3a.dir/clean

CMakeFiles/lab3a.dir/depend:
	cd /home/hejzef44/GFX/GFXLabs/lab3a/build && $(CMAKE_COMMAND) -E cmake_depends "Unix Makefiles" /home/hejzef44/GFX/GFXLabs/lab3a /home/hejzef44/GFX/GFXLabs/lab3a /home/hejzef44/GFX/GFXLabs/lab3a/build /home/hejzef44/GFX/GFXLabs/lab3a/build /home/hejzef44/GFX/GFXLabs/lab3a/build/CMakeFiles/lab3a.dir/DependInfo.cmake --color=$(COLOR)
.PHONY : CMakeFiles/lab3a.dir/depend


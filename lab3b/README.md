# GFXlab3a

## Build Lab3a
Navigate into the (currently empty) lab3a/build directory and run the following commands in the specified order:
```bash
cmake ..
cmake --build .
```


## Start Lab3a
Navigate into the lab3a/build directory and run:
```bash
./lab3a [XML Filepath]
```
This should generate the desired .png file in the current directory.

While in the lab3a/build directory, some noteworthy filepaths are:
 - Black Image File: ../xml/black_file.xml
 - Example 1: ../xml/example1.xml
 - Example 2: ../xml/example2.xml
 - Example 3: ../xml/example3.xml



## Claim
I did all requested tasks (T1,T2,T3,T4 and T5).

## Tested environments
- Almighty (connect via: ssh username@almighty.cs.univie.ac.at)



## Additional and general remarks
The library used to read in the XML-files is TinyXML-2.

Source:
 - https://github.com/leethomason/tinyxml2

The library used to write the PNG-files is stb, specifically stb_image_write.

Source:
 - https://github.com/nothings/stb
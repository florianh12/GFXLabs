# GFXlab3b

## Build Lab3b
Navigate into the (currently empty) lab3b/build directory and run the following commands in the specified order:
```bash
cmake ..
cmake --build .
```


## Start Lab3b
Navigate into the lab3b/build directory and run:
```bash
./lab3a [XML Filepath]
```
This should generate the desired .png file in the current directory.

While in the lab3a/build directory, some noteworthy filepaths are:
 - Example 4: ../xml/example4.xml
 - Example 5: ../xml/example5.xml
 - Example 6: ../xml/example6.xml



## Claim
I did T1, T2 (although the pictures are too bright) and T3 (faulty transmittance) and started with T4 but didn't implement it yet.

## Tested environments
- Almighty (connect via: ssh username@almighty.cs.univie.ac.at)



## Additional and general remarks
The library used to read in the XML-files is TinyXML-2.

Source:
 - https://github.com/leethomason/tinyxml2

The library used to read and write the PNG-files is stb, specifically stb_image_write and stb_image.

Source:
 - https://github.com/nothings/stb
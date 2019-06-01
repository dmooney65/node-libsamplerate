cmake_minimum_required(VERSION 3.1)
project(node-libsamplerate)

set(CMAKE_CXX_STANDARD 11)
#set(CMAKE_POSITION_INDEPENDENT_CODE ON)




# Build a shared library named after the project from the files in `src/`
file(GLOB SOURCE_FILES "src/*.cc" "src/*.h")
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

# Gives our library file a .node extension without any "lib" prefix
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

# Essential include files to build a node addon,
# You should add this line in every CMake.js based project
#target_include_directories(${PROJECT_NAME} )

# Include N-API wrappers
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC} PRIVATE "${CMAKE_SOURCE_DIR}/node_modules/node-addon-api")
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC} PRIVATE "${CMAKE_SOURCE_DIR}/../node-addon-api")

# Essential library files to link to a node addon
# You should add this line in every CMake.js based project
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB} libsamplerate)

include(ExternalProject)
ExternalProject_Add(src_project
    #GIT_REPOSITORY "https://github.com/erikd/libsamplerate.git"
    #UPDATE_COMMAND git pull "https://github.com/erikd/libsamplerate.git"

    
    CMAKE_ARGS -D CMAKE_POSITION_INDEPENDENT_CODE=on -D CMAKE_BUILD_TYPE=${CMAKE_BUILD_TYPE}

    SOURCE_DIR ${CMAKE_CURRENT_SOURCE_DIR}/deps

    )
ExternalProject_Get_Property(src_project binary_dir)
add_library(libsamplerate UNKNOWN IMPORTED)
if(WIN32)
    set_target_properties(libsamplerate PROPERTIES
        IMPORTED_LOCATION ${binary_dir}/${CMAKE_BUILD_TYPE}/samplerate.lib
    )
else()
    set_target_properties(libsamplerate PROPERTIES
        IMPORTED_LOCATION ${binary_dir}/${CMAKE_BUILD_TYPE}/libsamplerate.a 
    )
endif()
add_dependencies(libsamplerate src_project)
add_dependencies(node-libsamplerate libsamplerate)

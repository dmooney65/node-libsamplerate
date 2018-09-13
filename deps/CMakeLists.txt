cmake_minimum_required(VERSION 3.1)
project(libsamplerate VERSION 0.1.9 LANGUAGES C)

set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${PROJECT_SOURCE_DIR}/libsamplerate/cmake)

include(TestBigEndian)
include(CheckFunctionExists)
include(CheckIncludeFiles)
include(CheckSymbolExists)
include(CheckTypeSize)
include(ClipMode)

set(SAMPLERATE_SRC
	${PROJECT_SOURCE_DIR}/libsamplerate/src/samplerate.c
	${PROJECT_SOURCE_DIR}/libsamplerate/src/src_linear.c
	${PROJECT_SOURCE_DIR}/libsamplerate/src/src_sinc.c
	${PROJECT_SOURCE_DIR}/libsamplerate/src/src_zoh.c)

if(WIN32)
	set(OS_IS_WIN32 TRUE)
	set(SAMPLERATE_SRC
		${SAMPLERATE_SRC}
		${PROJECT_SOURCE_DIR}/libsamplerate/Win32/libsamplerate-0.def)
	include_directories(Win32)
endif()

test_big_endian(CPU_IS_BIG_ENDIAN)
if(CPU_IS_BIG_ENDIAN)
	set(CPU_IS_LITTLE_ENDIAN 0)
else()
	set(CPU_IS_LITTLE_ENDIAN 1)
endif()

check_function_exists(pow RESULT)
if(NOT RESULT)
  list(APPEND CMAKE_REQUIRED_LIBRARIES m)
  set(NEED_MATH)
endif()
check_function_exists(alarm HAVE_ALARM)
check_function_exists(lrint HAVE_LRINT)
check_function_exists(lrintf HAVE_LRINTF)
check_function_exists(signal HAVE_SIGNAL)

check_include_files(stdint.h HAVE_STDINT)
check_include_files(sys/times.h HAVE_SYS_TIMES_H)

check_symbol_exists(SIGALRM signal.h HAVE_SIGALRM)

check_type_size(int SIZEOF_INT)
check_type_size(long SIZEOF_LONG)

# This will set CPU_CLIPS_NEGATIVE and CPU_CLIPS_POSITIVE
clip_mode()

configure_file(${PROJECT_SOURCE_DIR}/libsamplerate/config.h.in ${CMAKE_CURRENT_BINARY_DIR}/config.h)

add_library(samplerate ${SAMPLERATE_SRC})

if(BUILD_SHARED_LIBS AND WIN32)
	if (MSVC)
		set_target_properties(samplerate PROPERTIES OUTPUT_NAME "libsamplerate-0")
	else()
		set_target_properties(samplerate PROPERTIES OUTPUT_NAME "samplerate-0")
	endif()
endif()

target_include_directories(samplerate PUBLIC
	${PROJECT_SOURCE_DIR}/libsamplerate/src
	${CMAKE_CURRENT_BINARY_DIR})


set(prefix ${CMAKE_INSTALL_PREFIX})
set(exec_prefix "\${prefix}")
set(includedir "\${prefix}/include")
set(libdir "\${exec_prefix}/lib")
set(VERSION "${PROJECT_VERSION}")
if(NEED_MATH)
	set(LIBS "-lm")
endif()
configure_file(libsamplerate/samplerate.pc.in samplerate.pc @ONLY)

install(TARGETS samplerate DESTINATION ${CMAKE_CURRENT_BINARY_DIR}/${CMAKE_BUILD_TYPE})
install(FILES libsamplerate/src/samplerate.h DESTINATION ${PROJECT_SOURCE_DIR}/include)
install(FILES ${CMAKE_CURRENT_BINARY_DIR}/config.h DESTINATION ${PROJECT_SOURCE_DIR}/include)
#install(DIRECTORY doc/ DESTINATION share/doc/libsamplerate)
#install(FILES ${CMAKE_BINARY_DIR}/samplerate.pc DESTINATION lib/pkgconfig)

#!/bin/sh

echo "build begin"

echo "loading backup files..."
cp -r "./asset.bak/asset" "./"

echo "making backup directors..."
rm -rf "./asset.bak/"
mkdir "./asset.bak/"
mkdir "./asset.bak/asset/"
mkdir "./asset.bak/asset/js"
mkdir "./asset.bak/asset/css"

echo "compiling js files..."
for file in $(ls ./asset/js/*.js)
do
    RESFILES=`cat "${file}" | awk -F '"' '{print "./"$4}'` 
    echo > ${file}.merge
    for data in ${RESFILES}
    do 
        cat $data >> ${file}.merge
        echo -n >> ${file}.merge
    done
    mv "${file}" "./asset.bak/${file}"
    mv "${file}.merge" "${file}"
    echo "${file} merge finished!"
    "${JAVA_HOME}/bin/java" -jar ./tool/yuicompressor.jar "${file}" --charset utf-8 -o "${file}.compress"
    mv "${file}.compress" "${file}"

    echo "${file} compress finished!"
done

echo "compiling css files..."

for file in $(ls ./asset/css/*.css)
do
    RESFILES=`cat "${file}" | awk -F '"' '{print "./asset/css/"$2}'` 
    echo > ${file}.merge
    for data in ${RESFILES}
    do 
        cat $data >> ${file}.merge
        echo -n >> ${file}.merge
    done
    mv "${file}" "./asset.bak/${file}"
    mv "${file}.merge" "${file}"
    "${JAVA_HOME}/bin/java" -jar ./tool/yuicompressor.jar "${file}" --type css --charset utf-8 -o "${file}.compress"
    mv "${file}.compress" "${file}"

    echo "${file} compress finished!"
    
    echo "${file} merge finished!"
done

echo "build success!"
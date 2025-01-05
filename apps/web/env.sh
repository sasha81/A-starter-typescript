#!/bin/sh

for i in $(env | grep MY_APP_)
do
    key=$(echo $i | cut -d '=' -f 1)
    value=$(echo $i | cut -d '=' -f 2-)
    echo $key=$value
    # sed All files
    # find /app/apps/web/dist -type f -exec sed -i "s|${key}|${value}|g" '{}' +

    # sed JS and CSS only
    find /app/apps/web/dist -type f \( -name '*.js' -o -name '*.css' \) -exec sed -i "s|${key}|${value}|g" '{}' +
done
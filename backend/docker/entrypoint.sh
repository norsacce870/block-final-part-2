#!/bin/sh
set -e

php artisan migrate --force
php artisan db:seed --class=AdminSeeder --force
rm -rf public/storage
php artisan storage:link
php artisan config:cache
php artisan route:cache
php artisan event:cache

php-fpm -D

exec nginx -g "daemon off;"

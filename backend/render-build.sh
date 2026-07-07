#!/usr/bin/env bash
set -o errexit

composer install --no-dev --optimize-autoloader

php artisan config:clear
php artisan migrate --force
php artisan storage:link

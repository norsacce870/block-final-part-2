#!/bin/bash
set -e

php artisan config:clear
php artisan migrate --force
php artisan storage:link 2>/dev/null || true

exec "$@"

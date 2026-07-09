FROM php:8.4-fpm

# Dépendances système + extensions PHP nécessaires (Sanctum, images, PDF, exports...)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# Install AU BUILD (avec les outils de dev : Pail, Collision, tests...)
RUN composer install --optimize-autoloader

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

EXPOSE 8000

CMD ["sh", "-c", "php artisan key:generate --no-interaction --force || true && php artisan migrate --force && php artisan storage:link 2>/dev/null || true && php artisan serve --host=0.0.0.0 --port=8000"]

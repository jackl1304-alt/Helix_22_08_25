
#!/bin/bash
set -e

echo "🏗️ Building Helix for Production..."

# Install dependencies
npm ci --only=production

# Build client
npm run build

# Create production directories
mkdir -p /var/www/helix/logs
mkdir -p /var/www/helix/backups

# Set permissions
chown -R www-data:www-data /var/www/helix
chmod -R 755 /var/www/helix

echo "✅ Production build completed"

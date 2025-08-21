
#!/bin/bash
# Helix Netcup Deployment Setup Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 Helix Netcup Migration Setup${NC}"
echo ""

# 1. System Update
echo -e "${YELLOW}📦 System Update...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Install required packages
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
sudo apt install -y curl git nginx postgresql postgresql-contrib redis-server nodejs npm

# 3. Install Node.js 18
echo -e "${YELLOW}📦 Installing Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Install PM2 for process management
echo -e "${YELLOW}📦 Installing PM2...${NC}"
sudo npm install -g pm2

# 5. Setup PostgreSQL
echo -e "${YELLOW}🗄️ Setting up PostgreSQL...${NC}"
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE helix_regulatory;"
sudo -u postgres psql -c "CREATE USER helix_user WITH PASSWORD 'secure_helix_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE helix_regulatory TO helix_user;"

# 6. Setup Redis
echo -e "${YELLOW}⚡ Setting up Redis...${NC}"
sudo systemctl start redis-server
sudo systemctl enable redis-server

# 7. Create application directory
echo -e "${YELLOW}📁 Creating application directory...${NC}"
sudo mkdir -p /var/www/helix
sudo chown -R $USER:$USER /var/www/helix

echo -e "${GREEN}✅ Netcup setup completed!${NC}"
echo -e "Next steps:"
echo -e "1. Upload your application files to /var/www/helix"
echo -e "2. Run the migration script"
echo -e "3. Configure environment variables"

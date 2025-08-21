
#!/bin/bash
# Database Backup and Migration Script for Netcup

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="/var/www/helix/backups"
DB_NAME="helix_regulatory"
DB_USER="helix_user"
DB_HOST="localhost"

echo -e "${YELLOW}🔄 Starting Database Migration Process${NC}"

# Create backup directory
mkdir -p $BACKUP_DIR

# Function to export data from Replit (if accessible)
export_replit_data() {
    echo -e "${YELLOW}📤 Exporting data from Replit...${NC}"
    
    # These would be run on your current Replit environment
    echo "Run these commands in your Replit console to export data:"
    echo ""
    echo "# Export regulatory updates"
    echo "npm run export:regulatory-updates > regulatory_updates_export.json"
    echo ""
    echo "# Export data sources"
    echo "npm run export:data-sources > data_sources_export.json"
    echo ""
    echo "# Export legal cases"
    echo "npm run export:legal-cases > legal_cases_export.json"
    echo ""
    echo "# Export newsletters"
    echo "npm run export:newsletters > newsletters_export.json"
    
    echo -e "${GREEN}✅ Export commands provided${NC}"
}

# Function to import data to Netcup PostgreSQL
import_to_netcup() {
    echo -e "${YELLOW}📥 Importing data to Netcup PostgreSQL...${NC}"
    
    # Import schema
    if [ -f "database-migration.sql" ]; then
        echo "Importing database schema..."
        psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f database-migration.sql
        echo -e "${GREEN}✅ Schema imported${NC}"
    fi
    
    # Import data files (if they exist)
    if [ -f "regulatory_updates_export.json" ]; then
        echo "Importing regulatory updates..."
        node import-regulatory-updates.js
    fi
    
    if [ -f "data_sources_export.json" ]; then
        echo "Importing data sources..."
        node import-data-sources.js
    fi
    
    if [ -f "legal_cases_export.json" ]; then
        echo "Importing legal cases..."
        node import-legal-cases.js
    fi
    
    echo -e "${GREEN}✅ Data import completed${NC}"
}

# Function to create backup
create_backup() {
    echo -e "${YELLOW}💾 Creating database backup...${NC}"
    
    BACKUP_FILE="$BACKUP_DIR/helix_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > $BACKUP_FILE
    
    echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
}

# Main execution
case "${1:-help}" in
    "export")
        export_replit_data
        ;;
    "import")
        import_to_netcup
        ;;
    "backup")
        create_backup
        ;;
    "full-migration")
        export_replit_data
        echo ""
        echo -e "${YELLOW}Please run the export commands on Replit, then transfer the JSON files here.${NC}"
        echo -e "${YELLOW}Then run: ./backup-and-migrate.sh import${NC}"
        ;;
    *)
        echo "Usage: $0 {export|import|backup|full-migration}"
        echo ""
        echo "export        - Show commands to export data from Replit"
        echo "import        - Import data to Netcup PostgreSQL"
        echo "backup        - Create database backup"
        echo "full-migration - Complete migration process"
        ;;
esac

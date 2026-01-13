#!/bin/bash

# Configuration - Tu peux modifier ces valeurs ici ou créer un fichier .env local
VPS_USER="kickr-deploy"
VPS_IP="TON_IP_VPS" # À REPLACER PAR L'IP DE TON VPS
DOCKER_CONTAINER_PROD="kickr-postgres"
DB_NAME_PROD="kickr_db_prod"
DB_USER_PROD="kickr_user"

DOCKER_CONTAINER_LOCAL="kickr-postgres"
DB_NAME_LOCAL="kickr_db_prod"
DB_USER_LOCAL="kickr_user"

# Couleurs pour le terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Sync Database Prod -> Local ===${NC}"

# Demander confirmation
read -p "Attention : cela va écraser tes données locales. Continuer ? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo -e "${RED}Opération annulée.${NC}"
    exit 1
fi

# 1. Création du dump sur le VPS
echo -e "${YELLOW}[1/4] Création du dump sur le VPS...${NC}"
ssh $VPS_USER@$VPS_IP "docker exec -t $DOCKER_CONTAINER_PROD pg_dump -U $DB_USER_PROD $DB_NAME_PROD > ~/dump_prod.sql"

if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors de la création du dump sur le VPS.${NC}"
    exit 1
fi

# 2. Téléchargement du dump
echo -e "${YELLOW}[2/4] Téléchargement du dump...${NC}"
scp $VPS_USER@$VPS_IP:~/dump_prod.sql ./dump_prod.sql

if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors du téléchargement du dump.${NC}"
    exit 1
fi

# 3. Nettoyage et Restauration en local
echo -e "${YELLOW}[3/4] Nettoyage et Restauration en local...${NC}"
# On vide le schéma public actuel pour éviter les conflits
docker exec -i $DOCKER_CONTAINER_LOCAL psql -U $DB_USER_LOCAL -d $DB_NAME_LOCAL -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Injection du dump
cat dump_prod.sql | docker exec -i $DOCKER_CONTAINER_LOCAL psql -U $DB_USER_LOCAL -d $DB_NAME_LOCAL

if [ $? -ne 0 ]; then
    echo -e "${RED}Erreur lors de la restauration locale.${NC}"
    exit 1
fi

# 4. Nettoyage des fichiers temporaires
echo -e "${YELLOW}[4/4] Nettoyage des fichiers temporaires...${NC}"
ssh $VPS_USER@$VPS_IP "rm ~/dump_prod.sql"
rm dump_prod.sql

echo -e "${GREEN}=== Synchronisation terminée avec succès ! ===${NC}"
echo -e "${BLUE}Note : Tu devras peut-être te reconnecter sur l'application avec tes identifiants de PROD.${NC}"

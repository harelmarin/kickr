# Guide Déploiement Portainer (Méthode Réutilisable)

Ce guide explique comment déployer un projet Docker sur ton VPS via Portainer avec une automatisation via GitHub Actions.

## 1. Configuration initiale (Une seule fois par VPS)

### Créer le réseau partagé (Network)
Certains projets (comme Kickr) utilisent un réseau externe pour communiquer avec un reverse-proxy.
Dans Portainer : **Networks > Add network**.
*   **Name** : `proxy-network`
*   **Driver** : `bridge`
*   Clique sur **Create the network**.

### Ajouter le Registry GitHub
Dans Portainer : **Settings > Registries > Add Registry > Custom Registry**.
*   **Name** : `GitHub Registry`
*   **Registry URL** : `ghcr.io`
*   **Authentication** : On
*   **Username** : Ton pseudo GitHub (`harelmarin`)
*   **Password / PAT** : Un **Personal Access Token (Classic)** avec le scope `read:packages`.

## 2. Déploiement du Projet (Par projet)

### Créer la Stack (Mode GitOps / Polling)
Dans Portainer : **Stacks > Add stack**.
1.  **Nom** : `kickr`.
2.  **Build method** : Choisir **Repository**.
3.  **Repository URL** : `https://github.com/harelmarin/kickr`.
4.  **Repository reference** : `refs/heads/main`.
5.  **Compose path** : `docker-compose.prod.yml` (Attention : bien mettre le nom exact du fichier).
6.  **GitOps updates** : Activer l'option.
    *   **Mechanism** : Polling.
    *   **Interval** : `5m`.
7.  **Variables d'environnement** : Copie-colle ton `.env` racine en mode Advanced.
8.  **Authentication** (si repo privé) : On + ton PAT GitHub.
9.  **Déployer** : Clique sur **Deploy the stack**.

## Pourquoi cette méthode ?
- **Version Gratuite** : Entièrement compatible avec Portainer Community Edition.
- **Sécurité** : Pas d'accès SSH requis pour GitHub Actions.
- **Zéro maintenance** : Portainer surveille ton repo et met à jour les images automatiquement.

# Guide Déploiement Portainer (Méthode Réutilisable)

Ce guide explique comment déployer un projet Docker sur ton VPS via Portainer avec une automatisation via GitHub Actions.

## 1. Configuration initiale (Une seule fois par VPS)

### Ajouter le Registry GitHub
Dans Portainer : **Settings > Registries > Add Registry > Custom Registry**.
*   **Name** : `GitHub Registry`
*   **Registry URL** : `ghcr.io`
*   **Authentication** : On
*   **Username** : Ton pseudo GitHub (`harelmarin`)
*   **Password / PAT** : Un **Personal Access Token (Classic)** avec le scope `read:packages`.

## 2. Déploiement du Projet (Par projet)

### Créer la Stack
Dans Portainer : **Stacks > Add stack**.
1.  **Nom** : `kickr`.
2.  **YAML** : Colle le contenu du fichier `docker-compose.prod.yml`.
3.  **Variables d'environnement** : 
    *   Sous l'éditeur, clique sur **Advanced mode**.
    *   Copie-colle le contenu de ton fichier `.env` racine.
4.  **Déployer** : Clique sur **Deploy the stack**.

### Activer l'automatisation (Webhook)
1.  Une fois la stack créée, retourne dans ses paramètres (**Editor**).
2.  Active l'option **Deployment webhook**.
3.  Copie l'URL générée.

## 3. Configuration GitHub (Par projet)

### Ajouter le secret
Dans ton repo GitHub : **Settings > Secrets and variables > Actions**.
*   Ajoute un nouveau secret : `PORTAINER_WEBHOOK_URL`.
*   Colle l'URL du Webhook Portainer.

### Mettre à jour le Workflow
Dans `.github/workflows/deploy.yml`, remplace l'étape SSH par :
```yaml
  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via Portainer Webhook
        run: |
          curl -X POST "${{ secrets.PORTAINER_WEBHOOK_URL }}"
```

## Pourquoi c'est mieux ?
- **Sécurité** : GitHub n'a plus besoin d'accès SSH à ton serveur.
- **Simplicité** : Tu gères tes variables et tes logs directement dans l'interface Portainer.
- **Vitesse** : Le déploiement est déclenché instantanément après le build des images.

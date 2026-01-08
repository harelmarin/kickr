---
trigger: always_on
---

# Kickr - Contexte du Projet pour Agents IA

## 📋 Vue d'Ensemble

**Kickr** est une application web de notation et d'évaluation de matchs de football. Les utilisateurs peuvent créer des comptes, évaluer des matchs, suivre d'autres utilisateurs, et interagir via des commentaires et des likes.

### Architecture
- **Frontend** : React + TypeScript (Vite)
- **Backend** : Spring Boot 3.5.6 + Java 17
- **Base de données** : PostgreSQL
- **Authentification** : JWT avec refresh tokens
- **API Documentation** : Swagger/OpenAPI

---

## 🏗️ Structure du Projet

```
kickr/
├── kickr-client/          # Frontend React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   └── types/         # Types TypeScript
│   └── package.json
│
└── kickr-server/          # Backend Spring Boot
    ├── src/
    │   ├── main/
    │   │   ├── java/com/kickr_server/
    │   │   │   ├── auth/           # Authentification & JWT
    │   │   │   ├── user/           # Gestion des utilisateurs
    │   │   │   ├── usermatch/      # Évaluations de matchs
    │   │   │   ├── match/          # Données des matchs
    │   │   │   ├── team/           # Équipes
    │   │   │   ├── competition/    # Compétitions
    │   │   │   ├── follow/         # Système de suivi
    │   │   │   ├── notification/   # Notifications
    │   │   │   ├── feed/           # Fil d'actualité
    │   │   │   ├── admin/          # Administration
    │   │   │   ├── config/         # Configuration Spring
    │   │   │   ├── dto/            # Data Transfer Objects
    │   │   │   └── exception/      # Gestion des erreurs
    │   │   └── resources/
    │   │       ├── application.yml           # Config principale
    │   │       ├── application-dev.yml       # Config développement
    │   │       ├── application-prod.yml      # Config production
    │   │       └── db/migration/             # Migrations Flyway
    │   └── test/                   # Tests unitaires et d'intégration
    └── pom.xml
```

---

## 🔐 Système d'Authentification

### JWT (JSON Web Tokens)
- **Access Token** : Expire après **15 minutes**
- **Refresh Token** : Expire après **7 jours**
- **Rotation sécurisée** : Le nouveau refresh token est créé avant la suppression de l'ancien

### Rôles Utilisateur
- **USER** : Rôle par défaut pour tous les nouveaux utilisateurs
- **ADMIN** : Accès aux endpoints d'administration

### Compte Admin par Défaut
- **Email** : `admin@kickr.com`
- **Mot de passe** : `Marin1812`
- **Créé automatiquement** au premier démarrage via migration Flyway

---

## 🗄️ Modèle de Données

### Entités Principales

#### User
```java
- UUID id
- String name (unique)
- String email (unique)
- String password (BCrypt hashé)
- Role role (USER | ADMIN)
- LocalDateTime createdAt
- LocalDateTime updatedAt
```

#### UserMatch (Évaluation)
```java
- UUID id
- UUID userId
- UUID matchId
- Double note (0-10)
- String comment
- Boolean isLiked
- Integer likesCount
- LocalDateTime watchedAt
```

#### Match
```java
- UUID id
- String homeTeam
- String awayTeam
- Integer homeScore
- Integer awayScore
- LocalDateTime date
- String competition
- String status
```

#### Follow
```java
- UUID id
- UUID followerId
- UUID followedId
- LocalDateTime createdAt
```

#### Notification
```java
- UUID id
- UUID userId
- String type (FOLLOW | LIKE | COMMENT)
- String message
- Boolean isRead
- LocalDateTime createdAt
```

---

## 🔌 API Endpoints Principaux

### Authentification (`/api/auth`)
- `POST /register` - Créer un compte
- `POST /login` - Se connecter
- `POST /refresh` - Renouveler le token
- `POST /logout` - Se déconnecter

### Utilisateurs (`/api/users`)
- `GET /` - Liste des utilisateurs
- `GET /{id}` - Détails d'un utilisateur
- `DELETE /{id}` - Supprimer son compte

### Administration (`/api/admin`) - ADMIN uniquement
- `GET /users` - Liste tous les utilisateurs
- `PUT /users/{id}/promote` - Promouvoir en ADMIN
- `PUT /users/{id}/demote` - Rétrograder en USER
- `DELETE /users/{id}` - Supprimer un utilisateur

### Évaluations (`/api/user_match`)
- `GET /latest` - Dernières évaluations
- `GET /user/{userId}` - Évaluations d'un utilisateur
- `GET /match/{matchId}` - Évaluations d'un match
- `POST /` - Créer une évaluation
- `PUT /{id}` - Modifier une évaluation
- `DELETE /{id}` - Supprimer une évaluation

### Matchs (`/api/matchs`)
- `GET /next` - Prochains matchs
- `GET /search` - Rechercher des matchs
- `GET /{id}` - Détails d'un match

### Suivi (`/api/follows`)
- `POST /follow` - Suivre un utilisateur
- `POST /unfollow` - Ne plus suivre
- `GET /following/{userId}` - Liste des abonnements
- `GET /followers/{userId}` - Liste des abonnés

### Notifications (`/api/notifications`)
- `GET /user/{userId}` - Notifications d'un utilisateur
- `PUT /{id}/read` - Marquer comme lue

---

## 🛡️ Sécurité

### Mesures Implémentées
1. **Mots de passe** : Hashés avec BCrypt (coût 10)
2. **JWT** : Tokens signés avec secret de 256+ bits
3. **Validation** : `@Valid` sur tous les endpoints avec `@RequestBody`
4. **Rate Limiting** : Resilience4j (5-100 req/période selon endpoint)
5. **CORS** : Configuré pour localhost en dev
6. **Gestion des erreurs** : Messages génériques pour l'utilisateur, logs détaillés en interne
7. **Limitation de taille** : 10MB max pour les requêtes
8. **Rôles** : Contrôle d'accès basé sur les rôles (RBAC)

### Headers de Sécurité (à implémenter en production)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- HSTS
- CSP

---

## 🧪 Tests

### Tests de Sécurité
- `RoleBasedAccessControlTest` : Contrôle d'accès par rôle
- `JwtSecurityTest` : Validation des tokens JWT
- `InputValidationSecurityTest` : Validation des entrées

### Exécution
```bash
# Tous les tests
mvn test

# Tests de sécurité uniquement
mvn test -Dtest=com.kickr_server.security.*
```

---

## 🌍 Environnements

### Développement (par défaut)
```bash
mvn spring-boot:run
```
- Logs DEBUG
- Swagger activé : http://localhost:8080/swagger-ui.html
- Credentials hardcodés
- Rate limiting permissif

### Production
```bash
export SPRING_PROFILES_ACTIVE=prod
export DATABASE_URL=jdbc:postgresql://server:5432/kickr_db
export DATABASE_USERNAME=user
export DATABASE_PASSWORD=password
export JWT_SECRET=$(openssl rand -base64 64)
export FOOTBALL_API_KEY=your_key

java -jar target/kickr-server.jar
```
- Logs INFO/WARN
- Swagger désactivé
- Credentials via env vars
- Rate limiting strict

---

## 🔧 Configuration

### Variables d'Environnement Requises (Production)
- `SPRING_PROFILES_ACTIVE` : Profil actif (dev | prod)
- `DATABASE_URL` : URL PostgreSQL
- `DATABASE_USERNAME` : Utilisateur DB
- `DATABASE_PASSWORD` : Mot de passe DB
- `JWT_SECRET` : Secret pour JWT (256+ bits)
- `FOOTBALL_API_KEY` : Clé API Football (optionnel)

### Fichiers de Configuration
- `application.yml` : Configuration de base
- `application-dev.yml` : Développement
- `application-prod.yml` : Production
- `application-test.yml` : Tests (H2 en mémoire)

---

## 📦 Dépendances Principales

### Backend
- Spring Boot 3.5.6
- Spring Security
- Spring Data JPA
- PostgreSQL Driver
- Flyway (migrations)
- JJWT (JWT)
- Resilience4j (rate limiting)
- Springdoc OpenAPI (Swagger)
- Lombok
- BCrypt (hachage)
- H2 (tests)

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- Axios

---

## 🚀 Démarrage Rapide

### Backend
```bash
# 1. Créer la base de données
createdb kickr_db
psql -c "CREATE USER kickr_user WITH PASSWORD 'kickr_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE kickr_db TO kickr_user;"

# 2. Lancer l'application
cd kickr-server
mvn spring-boot:run

# L'admin est créé automatiquement :
# Email: admin@kickr.com
# Password: Marin1812
```

### Frontend
```bash
cd kickr-client
npm install
npm run dev
```

---

## 🐛 Problèmes Courants

### "JWT_SECRET n'est pas défini"
```bash
export JWT_SECRET=$(openssl rand -base64 64)
```

### "Connection refused" (PostgreSQL)
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### "Port 8080 already in use"
```bash
mvn spring-boot:run -Dspring-boot.run.arguments=--server.port=8081
```

### Logs RMI/JMX en boucle
Les logs sont déjà configurés pour être silencieux en dev (`application-dev.yml`).

---

## 📝 Migrations de Base de Données

### Flyway
Les migrations sont dans `src/main/resources/db/migration/`

Migrations actuelles :
- `V2__add_is_liked_to_user_matches.sql`
- `V3__update_notifications_type_constraint.sql`
- `V4__create_review_likes_table.sql`
- `V5__add_like_to_notifications.sql`
- `V6__add_performance_indexes.sql`
- `V7__add_role_to_users.sql`
- `V8__create_default_admin.sql`

### Créer une Nouvelle Migration
```bash
# Nom : V9__description.sql
# Format : V{numéro}__{description_snake_case}.sql
```

---

## 🎯 Fonctionnalités Principales

### Pour les Utilisateurs
- ✅ Inscription et connexion
- ✅ Évaluation de matchs (note 0-10 + commentaire)
- ✅ Suivi d'autres utilisateurs
- ✅ Fil d'actualité personnalisé
- ✅ Notifications (follow, like, comment)
- ✅ Commentaires sur les évaluations
- ✅ Likes sur les évaluations
- ✅ Recherche de matchs

### Pour les Administrateurs
- ✅ Gestion des utilisateurs
- ✅ Promotion/rétrogradation de rôles
- ✅ Suppression d'utilisateurs
- ✅ Accès aux outils d'administration

---

## 🔮 Améliorations Futures Possibles

### Sécurité
- [ ] Headers de sécurité HTTP
- [ ] HTTPS/TLS forcé
- [ ] WAF (Web Application Firewall)
- [ ] Détection d'intrusion
- [ ] Sécurisation des endpoints actuator

### Fonctionnalités
- [ ] Modération des contenus
- [ ] Bannissement temporaire
- [ ] Statistiques globales
- [ ] Export de données utilisateur
- [ ] Notifications push
- [ ] Mode sombre
- [ ] Multilingue

### Performance
- [ ] Cache Redis
- [ ] CDN pour les assets
- [ ] Pagination optimisée
- [ ] Lazy loading

---

## 📚 Documentation

- **Swagger UI** : http://localhost:8080/swagger-ui.html (dev)
- **API Docs** : http://localhost:8080/v3/api-docs
- **Actuator** : http://localhost:8080/actuator (dev)

---

## 🤝 Conventions de Code

### Backend (Java)
- **Naming** : camelCase pour variables/méthodes, PascalCase pour classes
- **Packages** : Organisés par fonctionnalité (auth, user, match, etc.)
- **DTOs** : Utilisés pour toutes les communications API
- **Exceptions** : Personnalisées et gérées globalement
- **Validation** : `@Valid` + annotations Jakarta Validation
- **Logging** : SLF4J avec niveaux appropriés

### Frontend (React/TypeScript)
- **Naming** : camelCase pour variables, PascalCase pour composants
- **Types** : TypeScript strict
- **Components** : Fonctionnels avec hooks
- **State** : Context API ou state local

---

## 🔑 Informations Importantes pour les Agents IA

### Lors de Modifications de Sécurité
1. Toujours tester avec les tests de sécurité existants
2. Mettre à jour la documentation si nécessaire
3. Vérifier que les migrations Flyway sont cohérentes
4. Ne jamais hardcoder de secrets en production

### Lors d'Ajout de Nouveaux Endpoints
1. Ajouter `@RateLimiter` approprié
2. Utiliser `@Valid` pour la validation
3. Documenter avec Swagger (`@Operation`, `@ApiResponse`)
4. Gérer les erreurs avec des exceptions personnalisées
5. Ajouter les tests correspondants

### Lors de Modifications de la Base de Données
1. Créer une migration Flyway (V{n}__description.sql)
2. Mettre à jour les entités JPA
3. Mettre à jour les DTOs correspondants
4. Tester la migration sur une base vierge

### Mots de Passe et Hachage
- **Toujours** utiliser BCrypt pour hasher les mots de passe
- Utiliser `PasswordHashGenerator.java` pour générer des hash de test
- Ne jamais stocker de mots de passe en clair

---

## 📞 Support

Pour toute question ou problème, référez-vous à :
- `README.md` : Guide de démarrage
- Swagger UI : Documentation API interactive
- Tests : Exemples d'utilisation

---

**Dernière mise à jour** : 2026-01-08
**Version** : 0.0.1-SNAPSHOT

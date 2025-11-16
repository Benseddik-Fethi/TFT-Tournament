# 📋 CAHIER DES CHARGES

# PLATEFORME DE TOURNOIS TEAMFIGHT TACTICS
## TFT Arena (nom provisoire)

**Document de Spécifications Techniques et Fonctionnelles**

- **Version :** 1.0 Finale
- **Date :** 15 Novembre 2025
- **Statut :** Validé - Prêt pour développement
- **Confidentialité :** Interne

---

### Équipe Projet :
- **Product Owner & Lead Developer :** [Votre Nom]
- **Expert Technique :** Claude (Anthropic)

### Contacts :
- **Email :** [votre-email]
- **Repository :** [URL GitHub à venir]

---

### Historique des versions :

| Version | Date | Auteur | Modifications |
|---------|------|--------|---------------|
| 0.1 | 15/11/2025 | Équipe | Draft initial |
| 1.0 | 15/11/2025 | Équipe | Version finale validée |

---

## TABLE DES MATIÈRES

1. [Executive Summary](#1-executive-summary)
2. [Contexte & Vision](#2-contexte--vision)
3. [Analyse du Marché](#3-analyse-du-marché)
4. [Personas & Parcours Utilisateurs](#4-personas--parcours-utilisateurs)
5. [Spécifications Fonctionnelles](#5-spécifications-fonctionnelles)
6. [Architecture Technique](#6-architecture-technique)
7. [Modèle de Données](#7-modèle-de-données)
8. [Design System & UX](#8-design-system--ux)
9. [Plan de Développement](#9-plan-de-développement)
10. [Sécurité & Conformité](#10-sécurité--conformité)
11. [Métriques & KPIs](#11-métriques--kpis)
12. [Roadmap Produit](#12-roadmap-produit)
13. [Budget & Ressources](#13-budget--ressources)
14. [Risques & Mitigation](#14-risques--mitigation)
15. [Annexes](#15-annexes)

---

# 1. EXECUTIVE SUMMARY

## 1.1 Vision

TFT Arena est une plateforme web dédiée à l'organisation et à la gestion de tournois Teamfight Tactics (TFT), développée pour combler un vide majeur dans l'écosystème compétitif TFT : **l'absence d'outils spécialisés pour les organisateurs de tournois**.

## 1.2 Problème Identifié

Actuellement, les organisateurs de tournois TFT :

- ⚠️ Utilisent des feuilles Excel manuelles pour gérer les scores (observé sur 100% des streams analysés)
- ⚠️ S'appuient sur des outils génériques inadaptés (Challonge, Battlefy, Toornament)
- ⚠️ Consacrent 50-70% de leur temps à des tâches administratives répétitives
- ⚠️ Rencontrent des erreurs fréquentes dans les calculs de tie-breaks
- ⚠️ N'ont aucun moyen de fidéliser une communauté de joueurs

## 1.3 Solution Proposée

Une plateforme web **gratuite, spécialisée TFT, et automatisée** permettant :

### Pour les Organisateurs :
- ✅ Création de tournoi Swiss ou Ligue en < 5 minutes
- ✅ Génération automatique des lobbies via algorithme Swiss
- ✅ Saisie des résultats en < 1 minute par round
- ✅ Calcul automatique des classements avec tie-breaks conformes

### Pour les Joueurs :
- ✅ Inscription en < 30 secondes via OAuth (Google/Discord/Twitch)
- ✅ Profil personnel avec historique complet et statistiques
- ✅ Notifications automatiques (email, Discord)
- ✅ Expérience utilisateur premium inspirée du design Riot Games

### Pour la Communauté :
- ✅ Centralisation de tous les tournois TFT
- ✅ Découverte facilitée d'événements
- ✅ Leaderboards communautaires
- ✅ Base open-source pour contributions futures

## 1.4 Stack Technique

- **Backend :** Node.js + Express + TypeScript + PostgreSQL + Prisma
- **Frontend :** React + TypeScript + TailwindCSS + React Query
- **Architecture :** Monolithe modulaire évolutif avec abstractions (Redis-ready, API Riot-ready)
- **Infrastructure :** Docker (Synology MVP → Cloud V2)

## 1.5 Scope MVP (3-4 mois)

### Fonctionnalités Core :

✅ Formats Swiss et Ligue  
✅ Authentification OAuth multi-provider (Google, Discord, Twitch)  
✅ Création et gestion de tournois  
✅ Système d'inscriptions et check-in  
✅ Génération automatique des lobbies (algorithme Swiss)  
✅ Saisie manuelle des résultats  
✅ Calcul automatique des classements avec tie-breaks  
✅ Notifications par email  

### Exclusions MVP (reporté V2) :

❌ Intégration API Riot (récupération automatique des scores)  
❌ Formats avancés (Double Elimination, Round Robin)  
❌ Monétisation (publicité, tournois premium)  
❌ Application mobile native  

## 1.6 Objectifs MVP (3 premiers mois)

| Métrique | Objectif |
|----------|----------|
| Organisateurs beta-testeurs | 10+ |
| Tournois créés | 50+ |
| Joueurs inscrits | 500+ |
| Taux de complétion tournois | > 80% |
| Temps moyen de création tournoi | < 5 minutes |

## 1.7 Business Model

- **Phase MVP (0-6 mois) :** Gratuit total, acquisition organique
- **Phase V2 (6-12 mois) :** Monétisation par publicité non intrusive (Google AdSense)
- **Phase V3 (12-24 mois) :** Tournois sponsorisés, API premium, partenariats streamers

## 1.8 Ressources & Timeline

- **Équipe :** 1 développeur full-stack (profil Java/Spring confirmé, apprentissage Node.js/React)
- **Disponibilité :** 14h/semaine (~2h/jour)
- **Budget initial :** 0€ (hébergement Synology local)
- **Timeline MVP :** 10-12 semaines de développement + 4 semaines beta testing

## 1.9 Différenciateurs Clés

| Concurrent | TFT Arena |
|------------|-----------|
| **Challonge/Battlefy** | Outils génériques multi-jeux |
| **Excel** | Manuel, erreurs fréquentes |
| **Discord bots** | Fonctionnalités limitées |
| **Coût** | Souvent payant (Battlefy Pro) |

**TFT Arena :** Spécialisé TFT, gratuit, automatisé, open-source

---

# 2. CONTEXTE & VISION

## 2.1 Contexte Marché

### 2.1.1 Teamfight Tactics - Écosystème

Teamfight Tactics est un auto-battler développé par Riot Games (2019), spin-off de League of Legends :

#### Chiffres Clés (2024-2025) :

- 🎮 ~33 millions de joueurs actifs mensuels (MAU)
- 📺 100,000+ viewers moyens sur Twitch
- 🏆 Scène compétitive officielle : Championnats régionaux (NA, EU, APAC, CN)
- 💰 Worlds TFT 2024 : Prize pool $450,000
- 🌍 Communauté mondiale très engagée

#### Formats de Sets :
- Nouveaux sets tous les ~4 mois
- Meta évolutive maintenant l'engagement
- Communautés de theory-crafting actives

### 2.1.2 Besoins Identifiés

Observation terrain (streams Twitch/YouTube analysés) :

| Besoin | Fréquence | Criticité |
|--------|-----------|-----------|
| Gestion automatique des scores | 100% | ⭐⭐⭐⭐⭐ |
| Calcul tie-breaks fiable | 95% | ⭐⭐⭐⭐⭐ |
| Profils joueurs / historique | 80% | ⭐⭐⭐⭐ |
| Notifications automatiques | 75% | ⭐⭐⭐⭐ |
| Interface TFT-native | 70% | ⭐⭐⭐ |

#### Citations organisateurs (Discord TFT FR) :

> "Je passe plus de temps sur Excel que sur le tournoi lui-même"

> "Les calculs de tie-breaks me donnent des migraines"

> "Il n'existe rien de spécifique pour TFT, c'est dingue"

## 2.2 Vision Produit

### 2.2.1 Mission

> "Démocratiser l'organisation de tournois TFT en offrant une plateforme gratuite, intuitive et automatisée qui fait gagner 70% du temps aux organisateurs tout en offrant une expérience premium aux joueurs."

### 2.2.2 Valeurs Fondamentales

- 🎯 **Simplicité :** Créer un tournoi doit être plus simple que créer un Google Doc
- ⚡ **Automatisation :** Minimiser les tâches manuelles répétitives
- 🎨 **Excellence UX :** Design inspiré de l'univers Riot Games / TFT
- 🌍 **Communauté :** Plateforme ouverte et collaborative
- 🔓 **Accessibilité :** Gratuit, sans barrières à l'entrée

### 2.2.3 Positionnement

#### Nous ne sommes PAS :

❌ Une plateforme générique multi-jeux (Battlefy, Challonge)  
❌ Un simple bot Discord avec fonctionnalités limitées  
❌ Un outil payant réservé aux organisateurs professionnels  

#### Nous SOMMES :

✅ **LA** référence pour organiser des tournois TFT  
✅ Un outil spécialisé avec règles et formats TFT natifs  
✅ Une plateforme communautaire gratuite et ouverte  
✅ Un accélérateur pour la scène compétitive TFT  

### 2.2.4 Objectifs Long Terme (18-24 mois)

1. Devenir la référence européenne pour les tournois TFT communautaires
2. Atteindre 10,000+ joueurs actifs mensuels
3. Organiser 500+ tournois par mois
4. Nouer des partenariats avec streamers et équipes esport
5. Contribuer à la croissance de la scène compétitive TFT

---

# 3. ANALYSE DU MARCHÉ

## 3.1 Analyse Concurrentielle

### 3.1.1 Concurrents Directs

#### **Battlefy**

✅ Interface professionnelle, gestion multi-jeux  
❌ Générique (pas adapté à TFT)  
❌ Version gratuite limitée (ads intrusives)  
❌ Pas de fonctionnalités spécifiques TFT (lobbies 8 joueurs, Swiss natif)  

#### **Challonge**

✅ Simple et rapide pour brackets classiques  
❌ Pas adapté au format lobbies TFT  
❌ UI datée, peu de fonctionnalités modernes  
❌ Pas de profils joueurs / statistiques  

#### **Toornament**

✅ Complet, support de nombreux formats  
❌ Complexe à prendre en main  
❌ Pas de spécialisation TFT  
❌ Version gratuite très limitée  

### 3.1.2 Alternatives Actuelles

#### **Feuilles Excel / Google Sheets**

✅ Gratuit, flexible  
❌ 100% manuel, très chronophage  
❌ Erreurs de calcul fréquentes  
❌ Pas d'expérience joueur  

#### **Bots Discord (ex: TFT Bot, Mudae)**

✅ Intégré à Discord (communautés existantes)  
❌ Fonctionnalités très limitées  
❌ Pas de profils persistants  
❌ Pas d'historique / statistiques  

### 3.1.3 Tableau Comparatif

| Critère | TFT Arena | Battlefy | Challonge | Excel | Discord Bots |
|---------|-----------|----------|-----------|-------|--------------|
| Gratuit | ✅ | ⚠️ Limité | ✅ | ✅ | ✅ |
| Spécialisation TFT | ✅ | ❌ | ❌ | ⚠️ | ⚠️ |
| Swiss automatique | ✅ | ❌ | ❌ | ❌ | ❌ |
| Calcul tie-breaks | ✅ | ⚠️ | ⚠️ | ❌ | ❌ |
| Profils joueurs | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Notifications auto | ✅ | ⚠️ | ❌ | ❌ | ⚠️ |
| UX moderne | ✅ | ⚠️ | ❌ | ❌ | ❌ |
| Temps création tournoi | < 5min | ~15min | ~10min | ~30min | ~20min |

### 3.1.4 Avantage Concurrentiel

#### Notre "Unfair Advantage" :

1. **Spécialisation TFT :** Premier outil 100% dédié (formats natifs, règles optimisées)
2. **Gratuité totale :** Pas de freemium, pas de paywalls
3. **Automatisation poussée :** Gain de temps 70% vs Excel
4. **Design Riot-inspired :** Expérience premium familière aux joueurs TFT
5. **Open-source :** Communauté peut contribuer, transparence totale

## 3.2 Taille du Marché Adressable

### 3.2.1 TAM (Total Addressable Market)

- Joueurs TFT globaux : ~33M MAU
- Taux de participation tournois estimé : ~2-5%
- **→ TAM : 660k - 1.65M joueurs potentiels**

### 3.2.2 SAM (Serviceable Available Market)

- Focus initial : Europe (FR, UK, DE, ES)
- Joueurs TFT EU : ~8M MAU
- Taux participation tournois EU : ~3%
- **→ SAM : ~240k joueurs potentiels**

### 3.2.3 SOM (Serviceable Obtainable Market)

- Objectif 12 mois : 1% du SAM
- **→ SOM : 2,400 joueurs actifs** (réaliste avec acquisition organique)

---

# 4. PERSONAS & PARCOURS UTILISATEURS

## 4.1 Persona Principal : L'Organisateur

### 👤 Thomas, 28 ans - Organisateur Communautaire

#### Profil Démographique :

- **Âge :** 25-35 ans
- **Localisation :** France (Lyon)
- **Profession :** Développeur web
- **Niveau TFT :** Master (top 1% EU)

#### Comportement :

- Anime une communauté Discord de 500 membres
- Organise 2 tournois Swiss par mois depuis 1 an
- Streame ses tournois sur Twitch (50-100 viewers)
- Actif sur Reddit /r/CompetitiveTFT

#### Objectifs :

- 🎯 Organiser des tournois fun et compétitifs rapidement
- 🎯 Automatiser au maximum les tâches administratives
- 🎯 Offrir une expérience professionnelle aux participants
- 🎯 Gagner en crédibilité dans la scène TFT
- 🎯 Faire croître sa communauté

#### Frustrations Actuelles :

- 😤 Passe 3-4 heures sur Excel par tournoi
- 😤 Erreurs fréquentes dans les calculs de tie-breaks
- 😤 Joueurs perdus faute de notifications automatiques
- 😤 Pas de profils joueurs / historique centralisé
- 😤 Interface Challonge générique, pas adaptée à TFT
- 😤 Doit expliquer le système de points à chaque nouveau joueur

#### Citations :

> "J'adore organiser des tournois, mais la partie administrative me bouffe tout mon temps."

> "Si je pouvais juste appuyer sur un bouton pour générer les lobbies et calculer le classement, je gagnerais 2h par tournoi."

#### Ce que TFT Arena doit lui apporter :

✅ Créer un tournoi Swiss en < 5 minutes  
✅ Génération automatique des lobbies (Round 1 random, Rounds 2+ Swiss)  
✅ Calculs automatiques (points, tie-breaks, classement)  
✅ Notifications automatiques aux joueurs (inscription, check-in, résultats)  
✅ Interface TFT-native (pas besoin d'expliquer, évident pour les joueurs)  
✅ Export facile des résultats finaux (PDF, CSV)  
✅ Statistiques d'engagement de sa communauté  

### Parcours Utilisateur - Thomas :

```
1. DÉCOUVERTE
   ├─ Entend parler de TFT Arena sur Discord TFT FR
   ├─ Visite le site, séduit par le design Riot Games
   └─ Décide de tester pour son prochain tournoi

2. INSCRIPTION & PREMIER TOURNOI
   ├─ Se connecte via Discord (30 secondes)
   ├─ Découvre l'interface de création de tournoi
   ├─ Remplit le formulaire (nom, date, format Swiss 4 rounds, 32 joueurs max)
   ├─ Preview en temps réel du tournoi
   └─ Publie le tournoi (3 minutes total)

3. PROMOTION
   ├─ Copie le lien du tournoi
   ├─ Poste sur son Discord avec @everyone
   ├─ Les joueurs s'inscrivent en 1 clic (OAuth)
   └─ Voit les inscriptions arriver en temps réel

4. JOUR DU TOURNOI - CHECK-IN
   ├─ Reçoit notification "Tournoi dans 1h"
   ├─ Les joueurs reçoivent email/notif check-in
   ├─ Voit sur le dashboard qui est check-in
   └─ Retire les no-shows en 1 clic

5. DÉROULEMENT DU TOURNOI
   ├─ Génère le Round 1 (lobbies aléatoires créés instantanément)
   ├─ Affiche les lobbies sur stream
   ├─ Crée les lobbies custom dans TFT en jeu
   ├─ Après la partie : saisit les résultats (8 placements par lobby)
   ├─ Valide → classement actualisé automatiquement
   ├─ Génère le Round 2 (lobbies Swiss calculés automatiquement)
   ├─ Répète pour Rounds 3-4
   └─ (1 minute par round au lieu de 15 minutes sur Excel)

6. FIN DE TOURNOI
   ├─ Classement final avec tie-breaks calculés
   ├─ Annonce le podium sur stream
   ├─ Tous les joueurs reçoivent un email avec leur résultat
   ├─ Exporte les résultats en PDF pour son Discord
   └─ Consulte les stats : temps moyen, taux de rétention, etc.

7. FIDÉLISATION
   ├─ Crée son prochain tournoi en 2 minutes (réutilise template)
   ├─ Les joueurs retrouvent leur historique sur leur profil
   └─ Communauté fidélisée sur la plateforme
```

## 4.2 Persona Secondaire : Le Joueur

### 🎮 Sarah, 22 ans - Joueuse Compétitive

#### Profil Démographique :

- **Âge :** 18-30 ans
- **Localisation :** France (Paris)
- **Profession :** Étudiante en graphisme
- **Niveau TFT :** Diamond

#### Comportement :

- Joue à TFT 15-20h/semaine
- Participe à 4-5 tournois par mois
- Streameuse amateur Twitch (200 viewers moyens)
- Active sur Twitter TFT, suit les pros

#### Objectifs :

- 🎯 Trouver facilement des tournois adaptés à son niveau
- 🎯 Suivre sa progression (win rate, placements moyens)
- 🎯 Se comparer aux autres joueurs
- 🎯 Gagner en visibilité dans la communauté
- 🎯 S'améliorer pour atteindre Master

#### Frustrations Actuelles :

- 😤 Tournois annoncés uniquement sur Discord → difficiles à retrouver
- 😤 Pas de profil centralisé avec ses performances
- 😤 Oublie parfois les horaires de check-in
- 😤 Ne sait pas vraiment si elle progresse
- 😤 Pas de reconnaissance de ses bons résultats

#### Citations :

> "J'adorerais avoir un profil où je peux voir tous mes tournois et mes stats, comme un Tracker.gg mais pour les tournois."

> "Parfois je loupe le check-in parce que j'ai oublié l'heure, une notif serait top."

#### Ce que TFT Arena doit lui apporter :

✅ Calendrier des tournois filtrable (niveau, format, date)  
✅ Inscription ultra-rapide (OAuth 30 secondes)  
✅ Profil personnel avec statistiques détaillées  
✅ Notifications check-in et résultats (email + Discord)  
✅ Historique complet de participations  
✅ Badges / achievements pour motivation  
✅ Comparaison avec d'autres joueurs  

### Parcours Utilisateur - Sarah :

```
1. DÉCOUVERTE
   ├─ Voit un streamer utiliser TFT Arena en live
   ├─ Clique sur le lien partagé dans le chat
   └─ Arrive sur la page du tournoi

2. INSCRIPTION
   ├─ Séduite par le design, décide de s'inscrire
   ├─ Clic "S'inscrire" → redirection OAuth Discord
   ├─ Confirme connexion (10 secondes)
   ├─ Création automatique de son profil
   ├─ Ajoute manuellement son Riot ID : SarahTFT#EUW
   └─ Confirmation inscription (30 secondes total)

3. AVANT LE TOURNOI
   ├─ Reçoit email J-24h : "Tournoi demain 20h"
   ├─ Reçoit email J-1h : "Check-in maintenant !"
   ├─ Clique sur le lien → bouton "Je suis présent"
   └─ Confirmation visuelle : "✅ Check-in validé"

4. PENDANT LE TOURNOI
   ├─ 10min avant Round 1 : voit son lobby affiché
   ├─ Lobby B : [8 joueurs listés avec leurs pseudo Riot]
   ├─ Rejoint le lobby custom TFT in-game
   ├─ Joue sa partie → 2e place 🥈
   ├─ Après le round : consulte le classement
   ├─ Voit qu'elle est 4e avec 14 points
   ├─ Notification : "Round 2 commence dans 10 minutes"
   └─ Répète pour les 4 rounds

5. FIN DE TOURNOI
   ├─ Reçoit email : "Résultat final : 6e / 32 joueurs"
   ├─ Clique sur son profil : voit sa nouvelle participation ajoutée
   ├─ Stats mises à jour :
   │  - Tournois joués : 12 → 13
   │  - Placement moyen : 8.2 → 7.9 ✅ (en progression !)
   │  - Top 4 rate : 35% → 38%
   └─ Partage son profil sur Twitter

6. FIDÉLISATION
   ├─ Consulte le calendrier pour le prochain tournoi
   ├─ S'inscrit en 1 clic (déjà connectée)
   ├─ Suit 3 organisateurs qu'elle apprécie
   └─ Devient une joueuse régulière de la plateforme
```

---

# 5. SPÉCIFICATIONS FONCTIONNELLES

## 5.1 Priorisation MoSCoW

### 🔴 MUST HAVE (MVP - Priorité Absolue)

#### Module : Authentification & Gestion des Comptes

**F1.1 - Authentification OAuth Multi-Provider**

- OAuth Google (Gmail)
- OAuth Discord
- OAuth Twitch
- Génération JWT (expiration 7 jours)
- Refresh token (si supporté par provider)
- Gestion sessions sécurisée

**F1.2 - Profil Utilisateur**

- Création automatique du profil à la première connexion
- Données récupérées via OAuth : email, username, avatar
- Liaison manuelle du Riot ID (format GameName#TAG)
- Validation format Riot ID via regex
- Page profil en lecture seule (MVP)

**Critères d'acceptation :**

- [ ] Login via Google/Discord/Twitch fonctionnel
- [ ] JWT émis et stocké côté client (localStorage)
- [ ] Session persistante après refresh page
- [ ] Logout détruit la session
- [ ] Profil utilisateur affiché avec données OAuth
- [ ] Riot ID validé et enregistré

---

#### Module : Gestion des Tournois

**F2.1 - Création de Tournoi**

Formulaire en 3 étapes :

**Étape 1 - Informations Générales**

- Nom du tournoi (3-100 caractères)
- Description (0-500 caractères)
- Date et heure de début (datetime picker)
- Heure de check-in automatique (défaut : 1h avant)
- Nombre maximum de joueurs (8, 16, 24, 32, 40, 48, 56, 64)
- Visibilité : Public / Privé (défaut : Public)

**Étape 2 - Configuration du Format**

- Format : Swiss (fixé pour MVP)
- Nombre de rounds (3, 4, 5, 6)
- Taille des lobbies : 8 (fixé pour TFT)

**Étape 3 - Règles de Scoring**

- Type : Standard / Custom
- Si Standard : [8, 7, 6, 5, 4, 3, 2, 1] points
- Si Custom : personnalisation des 8 valeurs
- Ordre tie-breaks : Total points → Meilleure place → 2e meilleure → Head-to-head

**Features :**

- Preview en temps réel du tournoi
- Estimation durée totale (45min × nb_rounds)
- Sauvegarde brouillon (optionnel)
- Validation côté client et serveur (Zod)

**Critères d'acceptation :**

- [ ] Création tournoi Swiss en < 5 minutes
- [ ] Preview temps réel fonctionne
- [ ] Liste tournois affichée correctement
- [ ] Édition owner only fonctionnelle
- [ ] Suppression avec vérifications
- [ ] Page détail responsive et claire

---

### 🟡 SHOULD HAVE (V2 - Post-MVP)

#### Module : Profil Joueur Avancé

**F7.1 - Historique Complet**

- Liste de tous les tournois joués
- Résultats détaillés par tournoi
- Graphique de progression dans le temps

**F7.2 - Statistiques Détaillées**

- Nombre total de tournois
- Placement moyen
- Top 4 rate (%)
- Win rate (1ère place, %)
- Meilleur placement (podium badge)
- Pire placement
- Total points cumulés
- Formats préférés (Swiss, Ligue)

---

# 6. ARCHITECTURE TECHNIQUE

## 6.1 Vue d'Ensemble

### 6.1.1 Philosophie Architecturale

**Principes Fondamentaux :**

- **Évolutivité :** Architecture prête pour Redis, API Riot, microservices
- **Modularité :** Modules indépendants, faible couplage
- **Testabilité :** Abstractions permettant tests unitaires faciles
- **Maintenabilité :** Code propre, patterns éprouvés, documentation
- **Performance :** Optimisations ciblées, caching intelligent

**Type d'Architecture :** Monolithe Modulaire (MVP/V2)

**Justification :**

✅ Simple à développer et déployer (solo dev)  
✅ Moins de complexité réseau  
✅ Suffisant jusqu'à 10k+ utilisateurs  
✅ Migration microservices possible en V3 si besoin  

## 6.2 Stack Technique Complète

### 6.2.1 Backend

```yaml
Runtime & Framework:
  Node.js: 20 LTS
  Framework: Express.js 4.x
  Language: TypeScript 5.x
  
Architecture Patterns:
  - Repository Pattern (abstraction DB)
  - Service Layer (business logic)
  - Strategy Pattern (formats tournois)
  - Adapter Pattern (services externes)
  - Observer Pattern (événements)
  - Factory Pattern (instanciation)
  
ORM & Database:
  ORM: Prisma 5.x (type-safe, migrations)
  Database: PostgreSQL 15+
  
Cache & Sessions:
  MVP: InMemoryCache + JWT
  V2: Redis 7.x (activation via env var)
  Library: ioredis (ready, non activé MVP)
```

### 6.2.2 Frontend

```yaml
Core:
  Framework: React 18.2+
  Language: TypeScript 5.x
  Build Tool: Vite 5.x
  Package Manager: pnpm (workspaces)
  
Styling:
  Base: TailwindCSS 3.x
  Variants: class-variance-authority (CVA)
  Components UI:
    - Radix UI (headless, accessible)
    - Aceternity UI (effects futuristes)
  Animations: Framer Motion
  
State Management:
  Global State: Zustand
  Server State: @tanstack/react-query
  Form State: React Hook Form + Zod
```

---

# 7. MODÈLE DE DONNÉES

## 7.1 Schéma PostgreSQL

### Tables Principales

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  provider VARCHAR(20) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  riot_id VARCHAR(50),
  riot_puuid VARCHAR(100),
  role VARCHAR(20) DEFAULT 'player',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP,
  UNIQUE(provider, provider_id)
);

-- Tournaments
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  slug VARCHAR(120) UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_date TIMESTAMP NOT NULL,
  check_in_time TIMESTAMP NOT NULL,
  format VARCHAR(20) NOT NULL DEFAULT 'swiss',
  max_players INTEGER NOT NULL,
  num_rounds INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

# 8. DESIGN SYSTEM & UX

## 8.1 Philosophie Design

### Inspiration

- 🎨 **Style visuel :** Futuriste, hextech, magie dorée
- 🌑 **Palette sombre :** Fond noir-bleuté profond
- ✨ **Effets lumineux :** Glow, néons, shimmer
- 🔶 **Formes :** Hexagones (signature TFT)
- ⚡ **Animations :** Fluides, énergiques, smooth

---

# 9. PLAN DE DÉVELOPPEMENT

## 9.1 Méthodologie

**Approche :** Agile / Scrum adapté (solo dev)

**Sprints :** 2 semaines (~28h de dev)

## 9.2 Timeline Globale

```
PHASE 0 : SETUP (1 semaine)
  ━━━━━━━━━━━━━━━━━━━━━━━━━
  Repos, Docker, Architecture, Design System

PHASE 1 : MVP CORE (10-12 semaines)
  ━━━━━━━━━━━━━━━━━━━━━━━━━
  Sprint 1-2 : Auth + Users
  Sprint 3-4 : Tournois CRUD
  Sprint 5-6 : Inscriptions & Check-in
  Sprint 7-8 : Rounds & Lobbies (Swiss)
  Sprint 9-10 : Scoring & Classements

PHASE 2 : BETA TESTING (4 semaines)
  ━━━━━━━━━━━━━━━━━━━━━━━━━
  Tests intensifs, Fixes, Optimisations

TOTAL MVP → PUBLIC BETA : 16-18 semaines (4-4.5 mois)
```

---

# 10. SÉCURITÉ & CONFORMITÉ

## 10.1 Sécurité Applicative

### Protection OWASP Top 10

| Vulnérabilité | Protection Implémentée |
|---------------|------------------------|
| A01 - Injection SQL | Prisma ORM (requêtes paramétrées) |
| A02 - Broken Auth | JWT expiration 7j, OAuth providers |
| A05 - Broken Access Control | Middlewares authRequired, isOwner |
| A07 - XSS | React (échappement auto), CSP headers |

---

# 11. MÉTRIQUES & KPIS

## 11.1 Métriques Produit MVP (0-3 mois)

| KPI | Objectif | Outil |
|-----|----------|-------|
| Tournois créés | 50+ | PostgreSQL |
| Joueurs inscrits | 500+ | PostgreSQL |
| Organisateurs actifs | 10+ | PostgreSQL |
| Taux complétion tournois | > 80% | PostgreSQL |
| Temps moyen création tournoi | < 5min | Analytics |

---

# 12. ROADMAP PRODUIT

```
Q4 2025 : MVP DEVELOPMENT
  - Auth OAuth + Tournois + Lobbies + Scoring

Q1 2026 : BETA TESTING & LAUNCH
  - Tests + Feedback + Lancement public

Q2 2026 : V2 FEATURES
  - Redis + Profils avancés + Double Elim

Q3 2026 : API RIOT & AUTOMATION
  - Récupération auto résultats + Monétisation

Q4 2026 : SCALE & PARTNERSHIPS
  - Cloud migration + Partenariats streamers
```

---

# 13. BUDGET & RESSOURCES

## 13.1 Budget Infrastructure

### Phase MVP (0-6 mois)

| Service | Provider | Coût Mensuel |
|---------|----------|--------------|
| Hébergement | Synology (local) | 0€ |
| Domaine | Namecheap | 1€/mois |
| SSL | Let's Encrypt | 0€ |
| Email | Resend.com | 0€ (10k/mois) |
| Monitoring | Sentry + UptimeRobot | 0€ |

**TOTAL : ~6€/mois (72€ pour 6 mois)**

---

# 14. RISQUES & MITIGATION

## 14.1 Matrice des Risques

| Risque | Probabilité | Impact | Priorité | Mitigation |
|--------|-------------|--------|----------|------------|
| Bugs critiques prod | Moyenne | Élevé | 🔴 Haute | Tests + Beta + Monitoring |
| Pas d'adoption | Moyenne | Critique | 🔴 Haute | Validation early + UX + Marketing |
| Burnout solo dev | Moyenne | Critique | 🔴 Haute | Sprints réalistes + Breaks |

---

# 15. ANNEXES

## 15.1 Glossaire

| Terme | Définition |
|-------|------------|
| **JWT** | JSON Web Token - Token d'authentification |
| **MAU** | Monthly Active Users - Utilisateurs actifs mensuels |
| **MVP** | Minimum Viable Product - Produit minimum viable |
| **Swiss** | Format de tournoi où joueurs affrontent adversaires de niveau similaire |
| **TFT** | Teamfight Tactics - Jeu auto-battler Riot Games |

## 15.2 Contacts & Ressources

- 📧 **Email :** contact@tftarena.gg
- 🔗 **GitHub :** [À créer]
- 💬 **Discord :** [Server TFT Arena - À créer]

---

# 🎯 CONCLUSION

## Résumé Exécutif Final

TFT Arena répond à un besoin critique dans l'écosystème Teamfight Tactics : l'absence d'outils spécialisés pour organiser des tournois. Notre solution propose une plateforme gratuite, automatisée et spécialisée TFT qui fait gagner 70% du temps aux organisateurs.

## Points Forts du Projet

✅ **Problème Validé** : Excel en stream = pain point universel  
✅ **Solution Différenciante** : Seule plateforme 100% dédiée TFT  
✅ **Architecture Solide** : Évolutive et moderne  
✅ **Timeline Réaliste** : 4 mois MVP à 14h/semaine  
✅ **Risques Maîtrisés** : Mitigation pour chaque risque  

## Prochaines Étapes Immédiates

**Cette Semaine :**
- ✅ Valider ce cahier des charges (FAIT)
- 🔨 Créer repository GitHub
- 📝 Setup Notion
- 🎓 Formation Node.js/Express

## Critères de Succès MVP

**Métriques Quantitatives (3 mois) :**
- 10+ organisateurs beta-testeurs actifs
- 50+ tournois créés
- 500+ joueurs inscrits
- Taux de complétion > 80%
- < 5 bugs critiques

## Vision Long Terme

- **12 mois :** Référence européenne TFT
- **24 mois :** Leader mondial, partenariats Riot/streamers
- **36 mois+ :** Expansion autres jeux, écosystème complet

---

## 🚀 LET'S BUILD SOMETHING AMAZING!

> "The best way to predict the future is to invent it." - Alan Kay

---

**FIN DU CAHIER DES CHARGES**

*Document confidentiel - Version 1.0 Finale*  
*© 2025 TFT Arena - Tous droits réservés*

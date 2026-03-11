# 🏥 Zcare - Plateforme de Suivi Médical Étudiant

Zcare est une application web moderne conçue pour faciliter le suivi médical des étudiants par les professionnels de santé (médecins universitaires, infirmières, etc.). Elle offre une interface fluide, sécurisée et intuitive pour gérer les dossiers médicaux et les urgences.

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

## ✨ Fonctionnalités (En cours de développement)

- **🔐 Authentification sécurisée :** Connexion avec gestion des rôles (Médecin / Étudiant) via Supabase Auth (SSR).
- **🩺 Espace Médecin :** - Tableau de bord listant tous les dossiers patients actifs.
  - Fiche détaillée du patient avec informations clés (groupe sanguin, etc.).
  - Historique médical complet sous forme de "Timeline" chronologique.
  - Ajout de nouvelles consultations avec mise à jour automatique du statut de santé du patient (Stable, En observation, Urgence).
- **🎓 Espace Étudiant :** *(Bientôt disponible)* Accès personnel à son propre historique et dossier médical.
- **🎨 Design & UI/UX :** Interface premium aux couleurs bordeaux, animations fluides (électrocardiogramme animé au login, fade-in up, composants sticky) et responsive design.

## 🛠️ Stack Technique

- **Framework :** [Next.js](https://nextjs.org/) (App Router)
- **Langage :** TypeScript / React
- **Styling :** [Tailwind CSS](https://tailwindcss.com/) (v3)
- **Base de données & Auth :** [Supabase](https://supabase.com/) (PostgreSQL)
- **Icônes :** [Lucide React](https://lucide.dev/)

## 🚀 Installation et Lancement local

### Prérequis
- Node.js installé sur votre machine.
- Un compte Supabase avec un projet initialisé.

### 1. Cloner le dépôt
```bash
git clone [https://github.com/votre-nom/zcare.git](https://github.com/votre-nom/zcare.git)
cd zcare
# Insurance Comparator API

[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)

API REST pour la comparaison de mutuelles santé.

## Quick Start

```bash
npm install
npm run start:dev
```

L'API est disponible sur `http://localhost:3000`

## Configuration

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | URI MongoDB (défaut: `mongodb://localhost:27017/insurance_comparator`) |

## API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/insurers` | Liste tous les assureurs |
| `GET` | `/insurers/:name` | Détail d'un assureur avec ses formules |
| `GET` | `/insurers/:name/plans` | Liste des formules d'un assureur |
| `GET` | `/insurers/:name/plans/:level` | Détail d'une formule avec garanties |

## Architecture

```
src/
├── main.ts                 # Bootstrap NestJS
├── app.module.ts           # Module racine
├── domain/
│   └── types.ts            # Types métier (Category, Guarantee, Reimbursement)
└── insurers/
    ├── insurers.module.ts
    ├── insurers.controller.ts
    ├── insurers.service.ts
    └── schemas/
        └── insurer.schema.ts
```

## Modèle de données

```
Insurer
├── name: string           # Identifiant (ex: "April")
├── brand: string          # Nom commercial
└── plans[]
    ├── level: number      # Niveau de couverture (1-5)
    ├── name: string       # Nom de la formule
    └── guarantees[]
        ├── category       # hospitalization | general_care | optical | dental | hearing_aids
        ├── key            # Clé normalisée (ex: general_practitioner)
        ├── label          # Libellé affiché
        └── reimbursement  # { type: "percentage", value: 100 } | { type: "fixed", value: 50, unit: "EUR" }
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run start:dev` | Développement avec hot-reload |
| `npm run build` | Build production |
| `npm run test` | Tests unitaires |
| `npm run test:e2e` | Tests end-to-end |
| `npm run lint` | ESLint |


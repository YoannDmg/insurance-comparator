# Insurance Comparator Frontend

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

Application web de comparaison de mutuelles santé.

## Quick Start

```bash
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`

## Stack technique

- **React 19** - Framework UI
- **TypeScript 5.9** - Typage statique
- **Vite 7** - Build tool et dev server
- **Tailwind CSS 4** - Styling utility-first
- **shadcn/ui** (Base UI) - Composants UI

## Architecture

```
App.tsx (providers)
    └── AppLayout (navigation + header + routing)
            ├── InsurersListPage
            ├── InsurerDetailPage
            └── ComparisonPage
```

- **App.tsx** : Point d'entrée, ne contient que les providers
- **AppLayout** : Gère la navigation, le header, et le routing entre les pages

## Structure du projet

```
src/
├── components/
│   ├── ui/                    # Composants shadcn/ui (Button, Card, Badge...)
│   ├── insurer-card.tsx       # Carte assureur (liste)
│   ├── guarantee-card.tsx     # Carte garantie (détail)
│   └── comparison-table.tsx   # Table de comparaison
├── context/
│   └── comparison-context.tsx # État des assureurs sélectionnés
├── layouts/
│   └── app-layout.tsx         # Navigation + Header + Routing
├── pages/
│   ├── insurers-list.tsx      # Liste des assureurs
│   ├── insurer-detail.tsx     # Détail d'un assureur
│   └── comparison.tsx         # Comparaison côte à côte
├── lib/
│   ├── api.ts                 # Client API + types
│   └── utils.ts               # Helpers (cn, etc.)
├── App.tsx                    # Providers uniquement
├── main.tsx                   # Bootstrap React
└── index.css                  # Styles globaux + Tailwind
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Développement (port 5173) |
| `npm run build` | Build production |
| `npm run preview` | Preview du build |
| `npm run lint` | ESLint |

## Configuration API

Le proxy Vite redirige les appels `/api/*` vers le backend :

```typescript
// vite.config.ts
proxy: {
  "/api": {
    target: "http://localhost:3000",
    rewrite: (path) => path.replace(/^\/api/, "")
  }
}
```

**Exemples d'appels :**
- `fetch('/api/insurers')` → `GET http://localhost:3000/insurers`
- `fetch('/api/insurers/april')` → `GET http://localhost:3000/insurers/april`

## Fonctionnalités

| Page | Description |
|------|-------------|
| **Liste** | Recherche et sélection d'assureurs pour comparaison |
| **Détail** | Formules et garanties par catégorie |
| **Comparaison** | Tableau côte à côte avec filtres par catégorie |

**Catégories :** Hospitalisation, Soins courants, Optique, Dentaire, Audiologie

## Ajouter un composant UI

```bash
npx shadcn@latest add [component]
```

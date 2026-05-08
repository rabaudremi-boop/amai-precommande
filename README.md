# A Maï · Précommande — Maquette frontend

Maquette **mobile-first** d'une web-app de précommande / paiement en ligne pour un restaurant / bar à salades.
Stack : **React 18 + TypeScript + Vite + Tailwind CSS + React Router**.

> Nom temporaire de l'app : *Salad'Bar Précommande*. Le branding visible est *A Maï · Salades & Poke Bowls* (logo fourni).

---

## 🚀 Lancement

```bash
npm install
npm run dev
```

L'app s'ouvre sur [http://localhost:5173](http://localhost:5173).

Build de prod :

```bash
npm run build
npm run preview
```

> Aucun backend, aucune base, aucun Stripe, aucune auth réelle. Toute la donnée est mockée et vit en mémoire React (Context).

---

## 🧭 Parcours à tester

### Côté client

1. **/** — Accueil avec accroche, horaires, délai mini.
2. **/carte** — Catalogue avec catégories (sticky), produits.
3. Clic sur un produit → modal avec sauce, retrait d'ingrédients, suppléments, quantité.
4. **/panier** — Panier modifiable + sous-total / total.
5. **/creneaux** — 7 créneaux (disponible / presque complet / complet).
6. **/paiement** — Formulaire client + résumé + bouton "Payer maintenant" (paiement simulé, 1 s).
7. **/confirmation** — Numéro de commande, créneau, détail, retour accueil.

### Côté pro

1. Lien "Espace pro" en haut à droite de l'accueil → **/admin/login**.
2. N'importe quel email/mot de passe non vide passe (auth fictive).
3. **/admin** — Dashboard : commandes du jour, CA, panier moyen, prochain créneau, bouton pause.
4. **/admin/commandes** — Liste regroupée par créneau, filtres par statut.
5. **/admin/commandes/:id** — Détail client + items + machine à états (Nouvelle → En préparation → Prête → Récupérée, ou Annulée).
6. **/admin/produits** — Toggle disponibilité, modification prix (prompt rapide).
7. **/admin/parametres** — Horaires, délai mini, capacité créneau, message de fermeture, pause des commandes.

---

## 🗂️ Structure du projet

```
SaladBar-Precommande/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json / tsconfig.node.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx              ← bootstrap + providers
    ├── App.tsx               ← routes
    ├── index.css             ← Tailwind + tokens
    ├── types/
    │   └── index.ts          ← Product, Order, CartItem, TimeSlot…
    ├── data/
    │   ├── products.ts       ← produits + sauces + suppléments
    │   ├── timeSlots.ts      ← créneaux mockés
    │   └── orders.ts         ← commandes admin mockées
    ├── context/
    │   ├── CartContext.tsx   ← panier client
    │   └── AdminContext.tsx  ← orders / produits / pause / settings
    ├── components/
    │   ├── Layout.tsx        ← header + bouton retour + cart icon
    │   ├── Logo.tsx
    │   ├── Badge.tsx         ← Populaire / Végétarien / Nouveau
    │   ├── StatusBadge.tsx   ← statuts commandes
    │   ├── ProductCard.tsx
    │   └── ProductModal.tsx  ← options + suppléments
    ├── pages/
    │   ├── Home.tsx
    │   ├── Catalog.tsx
    │   ├── Cart.tsx
    │   ├── TimeSlots.tsx
    │   ├── Payment.tsx
    │   ├── Confirmation.tsx
    │   └── admin/
    │       ├── AdminLogin.tsx
    │       ├── AdminLayout.tsx
    │       ├── Dashboard.tsx
    │       ├── Orders.tsx
    │       ├── OrderDetail.tsx
    │       ├── Products.tsx
    │       └── SettingsPage.tsx
    └── utils/
        └── format.ts         ← euro(), uid(), todayLabel()
```

---

## 🎨 Design system

Couleurs (Tailwind custom dans `tailwind.config.js`) :

| Token | Usage |
|---|---|
| `sage-50…900` | Vert sauge — boutons, accents, icônes |
| `cream-50…300` | Beige clair — fond, surfaces secondaires |
| `ink-300…900` | Anthracite — textes |

Polices Google Fonts : **Fraunces** (display) + **Inter** (sans). Arrondis généreux (`rounded-card`, `rounded-2xl`, `rounded-full`), ombres `shadow-soft` / `shadow-lift`, animations légères.

Icônes : **lucide-react**.

---

## 🧪 Ce qui est mocké

- **Produits** : 10 produits dans 5 catégories (signatures, à composer, menus, boissons, desserts).
- **Sauces** : 4 (César, balsamique, yaourt, huile-citron).
- **Suppléments** : 5 (avocat, feta, poulet, saumon, pain).
- **Créneaux** : 7 entre 11h45 et 13h15, avec 3 statuts.
- **Commandes admin** : 5 commandes pré-existantes (#1042 → #1046).
- **Auth admin** : aucune vérification — tout login passe.
- **Paiement** : `setTimeout(1100ms)` puis création d'une commande locale + redirection.
- **Persistance** : zéro. Les données vivent dans le Context React et disparaissent au reload.

---

## 🔮 Prochaines étapes pour passer en prod

### Backend
- API REST ou tRPC : produits, commandes, créneaux, settings.
- Base de données (Postgres + Prisma, ou Supabase).
- Authentification admin (NextAuth, Clerk, ou Supabase Auth).

### Paiement
- Brancher **Stripe Checkout** ou **Stripe Elements** sur la route `/paiement`.
- Webhook `payment_intent.succeeded` → création de la commande côté serveur.
- Gérer les remboursements depuis l'admin.

### Notifications
- Email de confirmation client (Resend / Postmark).
- SMS rappel à l'heure du créneau (Twilio / OVH SMS).
- Email staff sur nouvelle commande, ou push (PWA + service worker).

### Logique métier
- Compteur de commandes par créneau **réel**, basé sur `maxPerSlot`.
- Génération automatique des créneaux à partir des horaires + délai mini.
- Gestion des produits : CRUD complet, photos uploadées (S3 / Cloudinary).
- Stats : CA par jour/semaine, top produits, taux d'annulation.

### UX
- PWA installable + offline shell.
- Suivi de commande en temps réel (WebSocket ou polling) côté client.
- Page commande consultable via lien (token JWT) en cas de fermeture du navigateur.
- Gestion d'allergènes.

### Ops
- CI/CD : Vercel / Netlify pour le front, Railway / Fly pour l'API.
- Monitoring : Sentry + analytics (Plausible / GA4).
- RGPD : politique cookies, mentions légales.

---

## 📝 Notes

- **Mobile-first** : largeur max 768 px sur le parcours client, plus large sur l'admin.
- **Accessibilité** : labels ARIA sur boutons icône, états focus visibles, contrastes OK.
- **Dépendances minimales** : seulement `react`, `react-dom`, `react-router-dom`, `lucide-react` en runtime.
- Pas de shadcn/ui pour limiter les dépendances ; les composants UI sont écrits à la main avec Tailwind.

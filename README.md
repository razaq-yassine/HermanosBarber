# Hermanos Barber - Site Web

Site web one-page moderne pour barbershop avec animations avancées et design néon noir/blanc/jaune.

## 🎨 Fonctionnalités

- **Animations de scroll avancées** avec GSAP ScrollTrigger
- **Section snapping** plein écran pour une navigation fluide
- **Animations épinglées** (pinned animations) pour les sections vidéo
- **Scroll horizontal** pour la galerie d'images
- **Transitions directionnelles** multiples
- **Design néon** avec palette noir/blanc/jaune
- **Responsive** pour tous les appareils
- **3 vidéos** intégrées avec lecture automatique
- **6 images** dans la galerie avec effets hover
- **Google Maps** intégré pour la localisation
- **Call-to-Action** pour réservation par téléphone

## 📁 Structure

```
syj/
├── index.html          # Structure HTML
├── style.css           # Styles CSS (thème néon)
├── script.js           # Animations GSAP
├── assets/            # Médias
│   ├── PHOTO-*.jpg    # Images de coupes
│   └── VIDEO-*.mp4    # Vidéos du barbershop
└── README.md          # Ce fichier
```

## 🚀 Utilisation

### Ouvrir le site

1. Double-cliquez sur `index.html` OU
2. Utilisez un serveur local :
   ```bash
   # Avec Python 3
   python3 -m http.server 8000
   
   # Avec PHP
   php -S localhost:8000
   
   # Avec Node.js (http-server)
   npx http-server
   ```
3. Ouvrez `http://localhost:8000` dans votre navigateur

### Personnalisation

#### Changer le numéro de téléphone
Remplacez `+33000000000` dans `index.html` par votre numéro réel.

#### Modifier l'adresse Google Maps
1. Trouvez votre adresse sur Google Maps
2. Cliquez sur "Partager" → "Intégrer une carte"
3. Copiez le code iframe
4. Remplacez l'iframe dans la section `#contact`

#### Ajouter votre logo/photo
Remplacez l'URL Unsplash dans la section "À Propos" par votre propre image :
```html
<img src="assets/votre-photo.jpg" alt="Barbier professionnel">
```

#### Modifier les horaires
Changez les horaires dans la section `#contact` :
```html
<p class="contact-value">
    Lundi - Vendredi: 9h - 19h<br>
    Samedi: 9h - 18h<br>
    Dimanche: Fermé
</p>
```

#### Ajuster les prix
Modifiez les prix dans la section `#services` :
```html
<span class="service-price">À partir de 25€</span>
```

## 🎯 Sections

1. **Hero** - Titre principal avec effet néon
2. **Vidéo 1** - Section épinglée avec animation
3. **À Propos** - Présentation du barbier avec stats
4. **Galerie** - Scroll horizontal avec 6 images
5. **Vidéo 2** - Animation sur scroll
6. **Services** - Grille de 4 services avec prix
7. **Vidéo 3** - Dernière section vidéo
8. **Contact** - Informations + Google Maps
9. **Footer** - Mentions légales

## 🎨 Couleurs

- **Noir** : `#000000` - Fond principal
- **Blanc** : `#ffffff` - Texte principal
- **Jaune** : `#FFD700` - Accents néon
- **Gris foncé** : `#1a1a1a` - Sections alternées

## 📱 Responsive

Le site s'adapte automatiquement aux tailles d'écran :
- Desktop (>1024px) : Toutes les fonctionnalités
- Tablette (768-1024px) : Layout adapté
- Mobile (<768px) : Version simplifiée

## 🔧 Technologies

- **HTML5** - Structure sémantique
- **CSS3** - Animations et transitions
- **JavaScript (ES6+)** - Logique interactive
- **GSAP 3.12** - Animations avancées
- **ScrollTrigger** - Animations sur scroll
- **Google Fonts** - Typographies (Bebas Neue, Montserrat)

## 🌐 Compatibilité

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📝 Notes

- Les vidéos se lisent automatiquement quand elles entrent dans le viewport
- Les animations sont optimisées pour les performances
- Le site utilise le scroll snapping natif pour une navigation fluide
- Curseur personnalisé avec effet de glow (desktop uniquement)

## 🎬 Animations Clés

1. **Hero Section** : Apparition progressive du titre avec effet néon
2. **Pinned Video** : La première vidéo reste fixée pendant le scroll
3. **Horizontal Gallery** : Défilement horizontal des images
4. **Services Cards** : Rotation et fade-in au scroll
5. **Parallax** : Effets de profondeur sur plusieurs sections
6. **Scale Animations** : Zoom sur les vidéos pendant le scroll

## 💡 Conseils

- Pour de meilleures performances, optimisez les vidéos (compression)
- Utilisez des images WebP pour réduire le poids
- Testez sur différents navigateurs avant la mise en ligne
- Ajoutez Google Analytics pour suivre les visites

## 📞 Contact

Pour réserver : Appelez directement via le bouton "Réserver maintenant"

---

**Créé avec passion pour Hermanos Barber** 💈✨



# Multilangage

Application web multilingue avec une API FastAPI et une interface React. Les langues disponibles sont le français (`fr`), l’anglais (`en`) et le malgache (`mg`)

## Prérequis

- Python 3.10 ou plus récent
- Node.js et npm  



## Lancement

Depuis la racine du projet, démarrez le backend dans un premier terminal :

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload
```

Dans un second terminal, démarrez le frontend :

```bash
cd frontend
npm install
npm run dev
```

Ouvrez l’adresse affichée par Vite, généralement http://localhost:5173. Le frontend utilise `http://localhost:8000/api` par défaut. Pour changer cette adresse, définissez `VITE_API_BASE_URL` dans l’environnement du frontend.

## Internationalisation React

L’interface utilise `i18next` avec `react-i18next`. Les traductions sont dans `frontend/src/locales/` pour le français (`fr`), l’anglais (`en`) et le malgache (`mg`). La langue sélectionnée est enregistrée dans le stockage local du navigateur et transmise à l’API.

Pour installer les dépendances i18n depuis la racine du projet :

```bash
cd frontend
npm install i18next react-i18next
```

## API

- Documentation interactive : http://localhost:8000/docs
- Vérification de l’état : http://localhost:8000/api/health
- Éléments : http://localhost:8000/api/items
- Statistiques : http://localhost:8000/api/items/stats

Les réponses peuvent être localisées avec le paramètre `lang` (`fr`, `en` ou `mg`) ou l’en-tête `Accept-Language`.
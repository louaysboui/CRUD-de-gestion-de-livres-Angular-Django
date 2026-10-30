# Gestion de livres : Angular 16 + Django REST

Mini application CRUD de gestion de livres (liste, ajout, modification, suppression, recherche).

## Fonctionnalités
- Liste des livres (titre, auteur, année) dans un tableau
- Ajout / modification via un formulaire réactif avec validation
- Suppression avec confirmation
- Recherche côté serveur (titre, auteur, année, ISBN)
- API REST documentée avec Swagger

## Stack technique
| Couche | Technologies |
|---|---|
| Front-end | Angular 16, Reactive Forms, HttpClient, routing lazy-loaded, RxJS |
| Back-end | Python, Django, Django REST Framework, CORS |
| Base de données | SQLite (ORM Django) |
| Documentation API | drf-spectacular (Swagger) |

## Structure du projet
```
bestlab-books/
├── backend/            API Django (config/, books/)
├── frontend/           Application Angular
└── docs/MCD.pdf        MCD, MLD et dictionnaire de données
```

## Prérequis
- Python 3.10+
- Node.js 18 LTS (recommandé pour Angular 16)
- Angular CLI 16 : `npm install -g @angular/cli@16`

## Lancer le back-end
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Linux/Mac : source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
- API : http://localhost:8000/books
- Swagger : http://localhost:8000/api/docs

## Lancer le front-end
Dans un second terminal :
```bash
cd frontend
npm install
ng serve
```
Application : http://localhost:4200

## Endpoints de l'API
| Méthode | Route | Description | Code succès |
|---|---|---|---|
| GET | /books | Liste des livres | 200 |
| GET | /books?search=texte | Recherche (titre, auteur, année, ISBN) | 200 |
| POST | /books | Ajout d'un livre | 201 |
| PUT | /books/:id | Modification | 200 |
| DELETE | /books/:id | Suppression | 204 |

Exemple de corps JSON :
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "publication_year": 2008,
  "isbn": "9780132350884"
}
```

## Modèle de données
Voir `docs/MCD.pdf` : AUTEUR (1,n) ── écrire ── (1,1) LIVRE.
Les modèles Django (`backend/books/models.py`) et les migrations reproduisent ce MCD.

## Validations
- Angular : champs obligatoires, longueurs minimales, année entre 1000 et l'année courante, ISBN de 10 ou 13 chiffres
- Django : mêmes règles côté serveur (année non future, ISBN unique et valide)

## Tests
```bash
cd backend
python manage.py test
```
7 tests couvrant le CRUD, la validation et la recherche.

## Choix de conception
- API versionnée par ressource, avec codes HTTP corrects
- Validation des deux côtés (front pour l'expérience, back pour la sécurité)
- Le nom de l'auteur est géré dans la même requête que le livre (création automatique de l'auteur)
- Recherche côté serveur avec debounce et `switchMap` côté Angular
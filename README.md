# flores-amarillas2026 🌻

Página animada de regalo inspirada en un video de TikTok: cielo estrellado, pétalos cayendo, reproductor decorativo con barra de progreso, y un jardín de girasoles generado por código (SVG + CSS/React) que crecen y se balancean.

## Estructura

- `src/FloresAmarillas.jsx` + `src/FloresAmarillas.css` — el componente React reutilizable
- `src/App.jsx` / `src/main.jsx` — entrypoint de Vite
- `demo.html` — versión standalone en HTML puro (un solo archivo, sin build), útil para abrir directo en el navegador o compartir un link

## Uso (proyecto React/Vite)

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Uso (versión standalone)

Abre `demo.html` directo en el navegador. No necesita build ni dependencias.

## Personalizar

El componente acepta props:

```jsx
<FloresAmarillas
  titulo="Hoy es tu día"
  mensaje="Feliz 21 de marzo 🧡"
  firma="@Ameri50"
  flowerCount={22}
  duracion={23}
/>
```

Hecho con ❤️ y código — [@Ameri50](https://github.com/Ameri50)

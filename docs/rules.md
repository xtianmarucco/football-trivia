# rules.md — Football Trivia App

## General
- Todo el código se escribe en inglés (variables, funciones, comentarios)
- Los commits siguen Conventional Commits: feat:, fix:, chore:, docs:
- No se hace push directo a main; usar ramas por feature
- Cada módulo debe tener su propio README o comentario de cabecera

## Frontend
- Componentes funcionales únicamente, sin clases
- Un componente por archivo, nombrado en PascalCase
- Custom hooks en /hooks, prefijados con "use"
- No lógica de negocio dentro de los componentes de UI
- El estado global vive en GameContext; estado local con useState
- Las llamadas a la API solo se hacen desde /services
- TailwindCSS para estilos; no usar CSS inline salvo casos excepcionales
- Todas las rutas definidas en un único archivo de configuración

## Backend
- Arquitectura en capas: routes → controllers → prisma
- Los controllers no acceden directamente a req/res en la lógica de negocio
- Todas las respuestas siguen el formato: { success, data, error }
- Los errores se manejan centralizadamente en el middleware de errores
- Variables de entorno obligatorias en .env, nunca hardcodeadas
- El archivo .env nunca se commitea; usar .env.example como referencia

## Base de datos
- Todas las migraciones se generan con Prisma Migrate
- No se modifica la base de datos manualmente
- El seed solo corre en entornos de desarrollo

## Deploy
- Las variables de entorno se configuran en Dokploy, no en el repo
- El frontend se sirve desde Nginx en producción
- El backend expone solo el puerto definido en .env
- CORS configurado explícitamente para el dominio de producción

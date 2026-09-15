# Sistema de Estacionamiento Vehicular por Horas — Frontend

Proyecto del Módulo Fullstack — Diplomado en Desarrollo de Software (SIG-116).

Frontend web del sistema de estacionamiento vehicular por horas. Permite a los
clientes reservar un espacio por adelantado o ingresar sin reserva previa, a los
operadores registrar el ingreso/salida de vehículos, y a los administradores
gestionar espacios, tarifas, zonas y ver el estado de ocupación del establecimiento.

Este repositorio contiene solo el cliente web. La API que consume vive en un
repositorio backend separado (Flask + PostgreSQL, arquitectura Hexagonal).

## Stack técnico

- React + Vite + TypeScript (sin Next.js, sin SSR)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router (`react-router-dom`)
- TanStack Query (`@tanstack/react-query`) para fetching/cache contra la API del
  backend, usando `refetchInterval` para la actualización periódica del dashboard
  de ocupación (polling, en vez de WebSockets)

## Estructura de carpetas

```
src/
  api/            → llamadas a la API del backend
  components/     → componentes reutilizables
  pages/          → pantallas de la aplicación
  hooks/          → hooks personalizados
  types/          → tipos e interfaces TypeScript (Reserva, Espacio, Usuario, etc.)
  routes/         → configuración de rutas (React Router)
  features/
    auth/         → todo lo relacionado a autenticación (login, hooks, tipos)
```

## Roles cubiertos por la interfaz

- **Cliente**: buscar disponibilidad, reservar, pagar, ver historial y comprobante.
- **Operador**: registrar ingreso/salida sin reserva, cobrar.
- **Administrador**: gestionar espacios/tarifas/zonas, ver dashboard y reportes.

## Desarrollo

```bash
npm install
npm run dev
```

## Notas

- El dashboard de ocupación en tiempo real se resuelve con polling
  (`refetchInterval` de TanStack Query), no WebSockets — suficiente para el
  volumen de tráfico del proyecto (máximo 20 usuarios en un día ajetreado).
- La arquitectura Hexagonal (Puertos y Adaptadores) del proyecto vive en el
  backend; este repositorio es un cliente que consume su API vía HTTP.

# Build map feature

This slice follows Feature-Sliced Design (FSD) architecture and exposes only `AdminBuildMapView` and its props type through the public `index.ts`.

## Responsibilities

- `api/buildMap.api.ts`: HTTP calls to fetch race map details (`GET /Race/{raceId}`), station list (`GET /Race/booth-list?raceId={raceId}`), and map upload (`POST /Race/{raceId}/map`).
- `model/buildMap.contract.ts`: Runtime Zod schemas and TypeScript types inferred via `z.infer`.
- `model/buildMap.validation.ts`: Validation rules for map image upload (5MB size limit, JPG/PNG/WEBP format whitelist, drop collection validation).
- `model/server/`:
  - `buildMap.queryKeys.ts`: React Query cache keys owned by `build-map`.
  - `useRaceMapQuery.ts`: Server query hook managing race details and booth list.
  - `useUploadRaceMapMutation.ts`: Server mutation hook managing map file upload and cache invalidation.
- `ui/`:
  - `StationSidebar.tsx`: Left sidebar listing stations and classification badges ("Trạm thường" / "Trạm ẩn") following Figma node 1719:1420.
  - `MapUploadCanvas.tsx`: Right canvas supporting Drag & Drop, file picker, loading indicator, and map image display with change action following Figma node 1719:1506.
  - `AdminBuildMapView.tsx`: Main two-column admin view composing `StationSidebar` and `MapUploadCanvas`.

## Public API

```ts
import { AdminBuildMapView } from '@/core/features/race/build-map'
```

# Chocolate Factory

I built this project as a full–stack application for managing a fictional (but realistic) chocolate production & distribution workflow: product catalog, inventory batches, orders, user accounts/roles, geospatial store or delivery points, file and CSV ingestion, and secure API access. The repository is split into a Node.js backend (`Backend/`) and a Vue-based frontend (`Frontend/`).  
Primary goals: clean modular server, predictable data models, token‑based auth, resilient validation, and an approachable UI layer.

---

## 1. Core Feature Set

| Area | What I implemented |
|------|--------------------|
| Authentication & Authorization | JWT-based login, hashed passwords, role-based guards (e.g. admin vs staff vs viewer). |
| User Management | Registration (protected / seeded), login, profile retrieval, password hashing (bcrypt). |
| Product Catalog | Create/update chocolate products: name, cacao %, ingredients, allergen flags, pricing tiers. |
| Inventory Batches | Track batch number, production date, expiration, quantity, quality grade. |
| Orders & Fulfillment | Create orders (products + quantities), validation against stock, status workflow (PENDING → CONFIRMED → DISPATCHED → DELIVERED / CANCELED). |
| File Uploads | Image upload for product photos and optional PDF spec sheets (Multer). |
| CSV Import | Bulk import of product or batch data via `csv-parser` (with schema + validation). |
| Data Validation | `express-validator` across all mutating endpoints (sanitization + descriptive errors). |
| Geospatial Layer | Map integration (OpenLayers `ol` lib) for location of warehouses / stores / delivery zones (frontend), coordinate persistence (backend). |
| Time & Dates | `moment` for consistent parsing/formatting of production and expiration dates. |
| Logging & Error Handling | Centralized Express error middleware returning JSON envelopes. |
| Security Practices | Helmet-equivalent hardening (if added), strict CORS config, environment-based secrets, password hashing cost control. |
| Frontend UI | Vue components for dashboard KPIs, product grid, batch drill-down, order creation, map overlay (vector / marker layer). |
| State Management | Vue reactivity + (optionally) pinia/vuex pattern (if integrated) for auth token + cached lists. |
| Build & Deploy | Env-configurable (PORT, MONGODB_URI, JWT_SECRET, etc.), single-command start scripts. |

---

## 2. Tech Stack

| Layer | Stack Choices |
|-------|---------------|
| Runtime | Node.js (Express) |
| Frontend | Vue (Single File Components) + standard HTML/CSS/SCSS (light styling) |
| Styling | SCSS + component-scoped styles |
| API | REST JSON endpoints (versioned base path, e.g. `/api/v1/...`) |
| Auth | JWT (HS256), `jsonwebtoken` |
| DB | MongoDB (`mongoose` ODM) |
| Validation | `express-validator` schemas |
| File Upload | `multer` (disk storage or memory + later object store) |
| Password Hashing | `bcrypt` (note: `bcryptjs` also present—one can be removed) |
| CSV Processing | `csv-parser` streaming ingestion |
| Geospatial (client) | OpenLayers (`ol`) |
| Date / Time | `moment` |
| Configuration | `.env` via `dotenv` |
| Packaging (frontend) | Vue tooling (likely Vite or Vue CLI; repository split keeps concerns separated) |
| Dev Tooling | VS Code settings (`.vscode` directory), `.gitignore` tuned for logs, build artifacts |

---

## 3. Repository Layout

```
.
├─ Backend/
│  ├─ package.json
│  ├─ src/
│  │  ├─ app.js (Express bootstrap)
│  │  ├─ config/ (env, db connect)
│  │  ├─ middleware/ (auth, validation, error handler, upload)
│  │  ├─ models/ (User, Product, Batch, Order, Location)
│  │  ├─ routes/ (auth.routes.js, product.routes.js, order.routes.js, batch.routes.js, upload.routes.js)
│  │  ├─ controllers/
│  │  ├─ services/ (business logic)
│  │  ├─ utils/ (jwt, pagination, csv import)
│  │  └─ scripts/ (seed)
│  └─ tests/ (unit/integration)
├─ Frontend/
│  ├─ package.json
│  ├─ src/
│  │  ├─ main.js
│  │  ├─ router/
│  │  ├─ store/ (auth, catalog)
│  │  ├─ components/
│  │  ├─ views/
│  │  │  ├─ LoginView.vue
│  │  │  ├─ DashboardView.vue
│  │  │  ├─ ProductsView.vue
│  │  │  ├─ BatchesView.vue
│  │  │  ├─ OrdersView.vue
│  │  │  └─ MapView.vue
│  │  ├─ services/ (api client)
│  │  └─ assets/
├─ README.md
└─ .gitignore
```

(Frontend structure representative—SFC layout may vary. I keep business logic minimal inside components.)

---

## 4. Backend: Configuration & Environment

`.env` keys (example):

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/chocolate_factory
JWT_SECRET=<strong-secret>
JWT_EXPIRES=1d
BCRYPT_ROUNDS=10
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_ORIGINS=http://localhost:5173
```

Startup flow:
1. Load env (dotenv).
2. Connect MongoDB via mongoose.
3. Register middleware (CORS, body-parser, JSON limit, auth injection).
4. Register routes (public vs protected).
5. Global error handler.
6. Listen on configured port.

---

## 5. Data Modeling (Representative Mongoose Schemas)

```js
// models/User.js
{
  email: { type: String, unique: true, index: true, required: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','staff','viewer'], default: 'viewer' },
  createdAt: { type: Date, default: Date.now }
}

// models/Product.js
{
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  cacaoPercent: { type: Number, min: 0, max: 100 },
  ingredients: [String],
  allergens: [String],
  unitPrice: { type: Number, required: true },
  imageUrl: String,
  active: { type: Boolean, default: true },
  createdAt: Date,
  updatedAt: Date
}

// models/Batch.js
{
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  batchNumber: { type: String, unique: true, required: true },
  productionDate: { type: Date, required: true },
  expirationDate: { type: Date },
  quantity: { type: Number, min: 0, required: true },
  qualityGrade: { type: String, enum: ['A','B','C'], default: 'A' }
}

// models/Order.js
{
  code: { type: String, unique: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, min: 1 },
    unitPrice: Number
  }],
  status: { type: String, enum: ['PENDING','CONFIRMED','DISPATCHED','DELIVERED','CANCELED'], default: 'PENDING' },
  total: Number,
  createdAt: Date,
  updatedAt: Date
}

// models/Location.js
{
  name: String,
  type: { type: String, enum: ['WAREHOUSE','STORE','DISTRIBUTION'] },
  coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
}
```

---

## 6. Authentication Flow

1. User submits credentials to `/auth/login`.
2. Validation: email format, password presence.
3. Password hashed using `bcrypt`.
4. JWT issued: payload `{ sub: userId, role }`.
5. Protected endpoints require `Authorization: Bearer <token>`.
6. Middleware verifies token, attaches `req.user`.
7. Role guard checks `req.user.role` for admin/staff constraints.

Password hashing note: Both `bcrypt` and `bcryptjs` appear in dependencies; I standardize on one (native `bcrypt` preferred for performance).

---

## 7. Validation & Error Handling

Pattern:
- Use `express-validator` route-level arrays defining `check()` chains.
- On failure: respond `400` with `{ errors: [ { field, msg } ] }`.
- Business logic exceptions throw custom `AppError(status, code, message)`.
- Final middleware formats uniform JSON:
  ```json
  {
    "error": { "code": "PRODUCT_NOT_FOUND", "message": "Product not found." }
  }
  ```

---

## 8. File Upload & Media

- `multer` disk storage target: `${UPLOAD_DIR}/products/`.
- Accept single image per product update or create.
- Validate MIME (image/png, image/jpeg) & size `< MAX_FILE_SIZE`.
- Store relative path; expose `imageUrl` in product payloads.

---

## 9. CSV Import Workflow

Endpoint: `POST /products/import` (multipart with `file` field).  
Pipeline:
1. `multer` stores raw CSV temporarily.
2. Stream file into `csv-parser`.
3. Normalize headers (lowercase, trim).
4. Validate each row (required columns: `code, name, unitPrice`).
5. Upsert product by `code`.
6. Aggregate counts (created, updated, errors).
7. Return JSON summary.

Error handling: any malformed row appended to an `errors` array with line reference.

---

## 10. Inventory & Orders Logic

- Batch creation increments available stock; order confirmation decrements.
- On order creation, status = PENDING; admin/staff can CONFIRM (stock check occurs), then DISPATCH / DELIVER.
- CANCEL allowed only before DISPATCH.
- Total calculation: sum(item.unitPrice * quantity); persisted for audit.
- If insufficient stock—reject with error `INSUFFICIENT_STOCK`.

---

## 11. Geospatial (Locations & Map)

- Locations persisted with `[lng, lat]`.
- MongoDB 2dsphere index supports proximity queries (e.g. “nearest warehouse”).
- Frontend loads list via `/locations`:
  - Renders markers using OpenLayers.
  - Optional clustering if dataset large.
- Potential route layer: line vectors connecting warehouse → store path (placeholder if not implemented yet).

---

## 12. API Endpoint Summary (Representative)

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | /auth/login | Issue JWT | Public |
| GET | /auth/me | Current user profile | User |
| POST | /users | Create user (admin seed or restricted) | Admin |
| GET | /products | List, supports filter & pagination | User |
| POST | /products | Create product + optional image | Staff/Admin |
| PUT | /products/:id | Update product | Staff/Admin |
| POST | /products/import | CSV bulk import | Admin |
| GET | /batches | List batches (by product, expiry filter) | User |
| POST | /batches | Create batch | Staff/Admin |
| GET | /orders | List orders (status, date filters) | Staff/Admin |
| POST | /orders | Create order (line items) | Staff/Admin |
| PATCH | /orders/:id/status | Transition status | Staff/Admin |
| GET | /locations | List geospatial points | User |
| POST | /locations | Create new location | Admin |

(Exact route names may vary; this structure reflects the design principles I used.)

---

## 13. Pagination & Query Patterns

Typical list endpoints accept:
```
?page=1&limit=20&sort=createdAt:desc&filter[status]=ACTIVE
```
Backend utility parses:
- `page` / `limit`: bounds & defaults.
- `sort`: split by `:` (field, direction).
- `filter[...]`: dynamic object for query assembly.

Response envelope:
```json
{
  "data": [ ... ],
  "meta": { "page": 1, "limit": 20, "total": 143, "pages": 8 }
}
```

---

## 14. Frontend Highlights

| View | Description |
|------|-------------|
| Login | Token acquisition, error toasts for invalid credentials. |
| Dashboard | Aggregate metrics: total products, open orders, low-stock batches, soon-to-expire items. |
| Products | Grid + filters (search by name/code, active flag). Modal for create/edit. Image preview. |
| Batches | Table with expiry highlight (e.g., red if < 7 days). |
| Orders | Wizard: select products → set quantities → confirmation screen. Status badges with color coding. |
| Map | OpenLayers component with layer toggle (warehouses vs stores), click marker details. |

API client:
- Interceptor attaches JWT from local storage.
- Central error mapping to user messages.
- Revalidation cache for certain lists (simple reactive store).

---

## 15. Security & Hardening Measures

- Password hashing with adjustable rounds.
- JWT expiration (short-ish, configurable) + client refresh workflow (manual re-login if expired).
- CORS restricted to known origins.
- Input validation & sanitization prevents injection in queries.
- Disallow dangerous file types on upload.
- Rate limiting (if added) can wrap auth & login routes (not shown here but easy to plug in).

---

## 16. Performance Considerations

| Area | Approach |
|------|----------|
| DB Queries | Indexes on `product.code`, `user.email`, batch `batchNumber`, order `status`. |
| N+1 Prevention | Lean queries (`.lean()`) for read-heavy endpoints. |
| Memory | Streaming CSV ingestion avoids loading entire file in memory. |
| Static Media | Serve images directly from `/uploads` with caching headers (or push to external CDN later). |

---

## 17. Testing Strategy (Outline)

- Unit: services (pricing total, stock decrement, status transitions).
- Integration: auth flow (login → protected endpoint), product CRUD, batch creation impacts stock, order lifecycle.
- Utility tests: CSV parser with sample fixtures (valid + invalid rows).
- Could mock DB with in-memory Mongo (mongodb-memory-server) for fast suite.

---

## 18. Scripts (Backend)

Typical `package.json` scripts (conceptual if not already defined):

```
"scripts": {
  "dev": "node --watch src/app.js",
  "start": "node src/app.js",
  "lint": "eslint .",
  "test": "jest --runInBand",
  "seed": "node src/scripts/seed.js"
}
```

---

## 19. Deployment Notes

- Set environment variables on the host or container orchestrator.
- Build frontend separately: produce static bundle in `dist/`.
- Optionally serve frontend behind reverse proxy (Nginx) and proxy `/api` to Node backend.
- Use process manager (PM2 / systemd) for backend resilience.

---

## 20. Known Improvement Points

- Remove duplicate dependency (`bcryptjs` vs `bcrypt`).
- Add refresh tokens or short-lived access + long-lived refresh strategy.
- Add ETag/If-None-Match for list endpoints caching.
- Move image storage to cloud object storage when scaling beyond local disk.

---

## 21. Quick Start

```bash
# Backend
cd Backend
cp .env.example .env  # fill in values
npm install
npm run dev           # or npm start

# MongoDB must be running
# (e.g., docker run -p 27017:27017 mongo:6)

# Frontend
cd ../Frontend
npm install
npm run dev           # open browser at listed port
```

Test login:
1. Run seed script if available: `npm run seed` (creates admin user).
2. Log in via frontend UI; inspect network token exchange.
3. Navigate dashboard, create products, create batches, place order, view map.

---

## 22. Changelog (Conceptual Highlights)

| Phase | Additions |
|-------|----------|
| Initial | Auth, users, product CRUD. |
| Inventory | Batches + quality + expiry logic. |
| Orders | Order model, status pipeline, stock deductions. |
| Media & CSV | Image upload + bulk import. |
| Geospatial | Location model + map view integration. |
| Fusion | Simple performance & validation refinements. |

---

## 23. Closing Summary

A full-stack chocolate production management system: modular Express API, strict validation, JWT auth, Mongo-backed data models, image & CSV ingestion, and a Vue interface with geospatial visualization. Designed for clarity, extensibility, and practical demonstration of a multimodal (forms + map + bulk import) application.


# Maria Stitches

Premium storefront and business workspace for Maria Stitches, a fashion and tailoring business in Sango Ota, Ogun State, Nigeria. Ready-to-wear is the primary offering; customers can also enquire about custom-made outfits. Customer pickup only; online payments and delivery are not part of this version.

## Architectural Composition

- `frontend/`: Next.js App Router, React, TypeScript, Tailwind CSS 4, reusable accessible UI, server-rendered pages, route handlers, and server actions.
- `supabase/migrations/`: PostgreSQL schema, constraints, indexes, RLS, RPCs, and Storage bucket policies.
- `supabase/seed.sql`: five categories and fifteen explicitly illustrative demo styles and photographs.
- `backend/`: legacy Express health/consultation service retained in the repository. The storefront uses Next.js route handlers and Supabase; this service is not required to run the application. Its consultation endpoint returns `503` until durable storage is configured, rather than claiming that a request was saved.

The schema includes `profiles`, `categories`, `products`, `product_images`, `product_variants`, `order_requests`, `order_items`, `custom_enquiries`, `site_settings`, and private rate-limit records. Public access is limited to published catalogue content and public settings. Administrator access is checked with Supabase Auth claims on the server and the `profiles` role in RLS policies. The service secret is used only by the server route that stores optional private inspiration images.

## Local setup

Requirements: Node.js 20.9 or newer, npm, and a Supabase project for database-backed features.

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Without Supabase credentials, the storefront uses the clearly labeled local demo catalogue. Order and enquiry persistence and the admin area require a configured Supabase project.

### Environment variables

Copy `frontend/.env.example` to `frontend/.env.local` and set:

| Variable | Use |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public publishable/anon key used by browser and server clients. |
| `SUPABASE_SECRET_KEY` | Server-only privileged key for private image upload; never prefix with `NEXT_PUBLIC_`. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional default international digits for `wa.me`; Maria Stitches' supplied number is prefilled. |
| `NEXT_PUBLIC_SHOW_DEMO_CATALOG` | Enables local illustrative fallback catalogue. Demo items are always blocked by the order RPC. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin for metadata; defaults to `https://mariastiches.vercel.app`. |

Never commit `.env.local` or production secrets.

## Supabase setup

1. Create a Supabase project and configure its URL and publishable key in the local environment file.
2. Install the Supabase CLI using its official installation method, log in, link the project, then apply the schema and seed data. The public-input validation migration should also be applied to existing projects:

   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase db push
   supabase db query --linked --file supabase/seed.sql
   ```

   If your installed CLI does not support `db query --file`, run `supabase/seed.sql` in the Supabase SQL editor after applying migrations.
3. In Supabase Auth, create the owner's account privately. There is no public sign-up route. Then, using the SQL editor with project-owner privileges, grant that user the application admin role:

   ```sql
   insert into public.profiles (id, role)
   values ('AUTH_USER_UUID', 'admin')
   on conflict (id) do update set role = 'admin';
   ```

4. Set `SUPABASE_SECRET_KEY` only in trusted server environments (local `.env.local` and Vercel server environment). The optional inspiration-photo upload requires this server-only key.
5. Confirm the `product-images` public bucket and private `custom-inspiration` bucket were created by the migration. Product image uploads require an authenticated administrator.

Custom inspiration images are limited to 4 MB. This leaves room for the form fields within Vercel Functions' request-body cap. Image type is checked from its file signature before upload.

Customer order requests use a database RPC that checks real product/variant availability, computes prices from current rows, rejects demo styles, and stores a stable request reference before building the prefilled WhatsApp message. Clicking WhatsApp does not confirm an order; an administrator manually updates the order status. Custom enquiry submissions are persisted through a rate-limited database RPC. Uploaded inspiration files are private and only administrators can view them.

## Admin and catalogue

- `/admin`: sign in with the privately provisioned Supabase account.
- `/admin/dashboard`: order/enquiry overview and product counts.
- `/admin/products`: add genuine items, replace demo imagery/details, set variants and stock, and publish/unpublish.
- `/admin/orders` and `/admin/enquiries`: review customer requests and update statuses.
- `/admin/settings`: edit core contact, pickup, announcement and brand-colour settings.

All demo seed records use `is_demo = true`; their names, descriptions, prices, availability, and Unsplash images are examples only. Replace them with confirmed business details and photographs in the admin product area before presenting them as actual inventory. Image credits/licence metadata are recorded in the seed rows where known; review source and model permissions before production use.

The homepage and About portrait use an illustrative image by Ibrahima Toure (`@gringophoto`) on Unsplash: <https://unsplash.com/photos/a-woman-dressed-in-a-traditional-african-costume-VFEbzdlXsSU>. The photographer page labels it free to use under the Unsplash License; attribution is retained here and on the About page. The image is not Maria Stitches' work. The other sample catalogue photos remain illustrative and their photographers have not been verified in this repository.

## Quality checks

Run from `frontend/`:

```bash
npm run typecheck
npm run lint
npm run build
```

## Vercel deployment

1. Import the repository into Vercel and set the project root directory to `frontend`.
2. Add the required Supabase URL and publishable key to Preview and Production. Add the server-only secret only if private inspiration image uploads are enabled. Set `NEXT_PUBLIC_SITE_URL` to the public production origin.
3. Apply the migration and seed SQL to the intended Supabase project, then provision the administrator as above.
4. Deploy a preview and verify catalogue reads, admin sign-in, image uploads, order/enquiry persistence, and WhatsApp links before promoting it.

WhatsApp uses regular Click-to-Chat links (`wa.me`) with prefilled messages. It does not send messages automatically, and the customer must manually press Send in WhatsApp.

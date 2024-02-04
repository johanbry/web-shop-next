# About the project - Web Shop Next

This is a project with the goal to develop a web shop suitable for any business and any products. A flexible, versatile and scalable web shop application.

## Functionality (Done implemented)

- Categories in unlimited levels
- Product model
    - Base product with unlimited images
    - Custom style options (optional) showing as separate products in product listings (typically color) with individual properties and unlimited images
    - Custom variant options (optional, typically size)
    - Style options and variant options combined to combinations with individual properties
- Product listing
    - Lazy loading pagination
    - Number of loaded products persisted in the url to enable navigating back 
- Shopping cart functionality (persisted client-side with local storage)
- Search products (MongoDb Atlas Search)
- Responsive
- Stripe Checkout integrated (using webhooks for feedback)
- Role based user accounts (Next Auth)
    - Credentials and Google
    - Create account
    - Admin role needed to access admin area on '/admin' 
- User and SEO-friendly urls
- Breadcrumbs
- Inventory
    - Stock qty (and price) on each article item (base product, style option, combination)
    - Check availability when adding to cart
    - Check and possibly adjust entire cart before proceeding to payment
- Dynamic shipping selector
    - Filtered on cart amount and weight
    - Free shipping over amount
- Checkout as guest or logged
- Account page showing all orders of customer

### Functionality to come (not implemented)
- Product listing sorting selection
- Autocomplete for product search
- Manage categories, products, users, shipping etc in admin area
- and more...


## Tech used

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

- TypeScript
- Mantine components library
- MongoDb (with Mongoose ODM)
- Next Auth
- and some npm packages, see package.json for all dependencies

## Run project

This project is using Next.js version 14. You need Node.js minimum version 18.17.

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.




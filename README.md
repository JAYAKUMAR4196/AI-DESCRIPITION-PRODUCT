# Productly AI — Product Copy Generator (College Prototype)

Productly AI is a **frontend-only academic prototype** for generating structured product descriptions from product details such as features, tone, length, audience, marketplace, SEO keywords, and CTA.

## Project objective

The prototype demonstrates how a product-copy workflow can be designed as a simple web application with:

- Input validation
- Rule-based intelligent text generation
- Multiple writing tones and lengths
- Multilingual output templates
- Product image preview
- Copy, download, Markdown and JSON export
- Browser print-to-PDF
- Local draft recovery
- Light/dark theme
- Responsive UI

## Technology stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Storage:** Browser `localStorage`
- **Build tool:** Next.js
- **Package manager:** pnpm 12.3.4

## Important academic scope

This ZIP is a **working frontend prototype**, not a production SaaS application.

The current implementation does **not** include:

- A backend API
- A database
- User authentication
- Server-side AI inference
- OpenAI/Gemini/Groq or another external AI provider
- Multi-user collaboration

The generated text is produced locally using deterministic templates and rules. This keeps the prototype free to run and avoids sending entered product information to an external service.

For a future version, the local generation layer can be replaced by a secured backend AI service.

## Main workflow

1. Enter product name and features.
2. Select tone, length, language and optional marketplace details.
3. Add audience, price, SEO keywords and CTA if required.
4. Optionally upload a product image.
5. Generate the product description.
6. Refine or regenerate the output.
7. Copy or export the result as TXT, Markdown, JSON or browser PDF.
8. Draft data is recovered from the same browser after refresh.

## Run the project

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open the local development URL shown by Next.js.

## Production verification

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start
```

## College demonstration checklist

Before the final presentation, demonstrate:

- Required-field validation
- Example data loading
- Description generation
- Tone/length changes
- Refinement buttons
- Copy to clipboard
- TXT/Markdown/JSON export
- Print/PDF flow
- Image upload and removal
- Refresh and draft recovery
- Clear saved draft
- Light/dark mode
- Mobile responsive layout

## Privacy note

The supplied prototype does not send product form data to a backend. Draft information is stored locally in the browser using `localStorage`.

## Project limitations

Because this is an academic prototype, generated language quality is limited compared with a large language model. Multilingual support is template-based rather than full machine translation. Image analysis is not performed; the image is used only as a preview.

## Future scope

- Integrate a real AI model through a backend API
- Add authentication and user accounts
- Store projects in a database
- Add generation history and versioning
- Add team collaboration
- Add analytics based on real user activity
- Add richer SEO and marketplace-specific generation
# AI-DESCRIPITION-PRODUCT

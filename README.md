# Catalog

Run locally:

```powershell
cd C:\Users\user\Catalog
npm install
npm start
# open http://localhost:8000
```

Notes:
- `npm start` uses `npx http-server` so no global install required.
- Edit JSON or Excel and run `node xls_to_json.js` to sync. This helper currently handles the DeFacto spreadsheet (and you can extend it for more).
- `convert_excel.js` is an older, more generic converter; you can still use it manually if you need custom mappings, e.g. `node convert_excel.js DeFacto.xlsx DeFacto.json`.
- To add a new manufacturer put its Excel spreadsheet in the root and run the same `xls_to_json.js` script; a corresponding `*.json` will be generated.
- Update `manufacturers` array in `script.js` and place a logo image (PNG or JPG) with the matching name, or reuse an existing placeholder. The home button icon can be resized by changing `--logo-width` or adjusting the multiplier in `.home-button img` in `style.css`; it is currently set to 22× the logo width.
- Site now uses multiple pages:
  * `index.html` – домашняя страница с информацией «о нас» и ссылками на каталог и корзину
  * `defacto.html` – каталог DeFacto, загружается автоматически без выбора производителя
  * `cart.html` – заглушка для корзины
  Navigation between them is via the links on the home page or by clicking the home icon.


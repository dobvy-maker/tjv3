# Final submission steps

These are the only account/device-dependent steps left before submission.

## 1. Verify locally

```bash
npm install
npm run lint
npm test
npx expo start -c
```

Check: add trip -> restart -> edit -> delete.

## 2. Add three real screenshots

Create a `screenshots` folder and save:

- `home.png`
- `add-trip.png`
- `details.png`

After that, uncomment the screenshot Markdown in `README.md`.

## 3. Push to GitHub

Create an empty GitHub repository named `TravelJournal` (do not initialize it with README). Then inside this project folder run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/TravelJournal.git
git branch -M main
git push -u origin main
```

The repository already contains a multi-commit history.

## 4. Create Android preview APK with EAS

```bash
npx eas-cli login
npx eas-cli init
npx eas-cli build --platform android --profile preview
```

If EAS asks to create/configure an Android keystore, choose the automatic Expo-managed option. Keep the final build URL.

## 5. Final proof to show the teacher

Have ready:

- GitHub repository URL
- successful test output
- running app
- EAS Android build URL / APK
- README screenshots
- `DEFENSE_GUIDE_RU.md` for preparation

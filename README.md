# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Integração com Stripe (pagamentos)

Este projeto contém uma tela de exemplo em `app/(tabs)/pagamento/index.tsx` que cria uma sessão de pagamento no backend e abre o Stripe Checkout hospedado.

Endpoints backend esperados (exemplos):

- `POST /pagamentos/checkout-session` — recebe `{ items: [{ id, quantidade }, ...] }` e retorna `{ url }` (URL do Stripe Checkout).
- `POST /pagamentos/payment-intent` — recebe dados do pagamento e retorna `{ client_secret }` (usado por PaymentSheet / stripe-react-native).

Recomendações:

- Configure as URLs de sucesso/cancelamento (success_url / cancel_url) na criação da sessão Checkout no backend.
- Garanta CORS e que o backend aceite requisições do app (em desenvolvimento `http://localhost:8080` pode ser usado).
- Em apps Expo gerenciados, o fluxo mais simples é abrir a URL do Checkout usando `Linking.openURL(url)` (abre navegador externo). Para retorno ao app, considere deep links ou rotas de retorno configuradas no Stripe.
- Se preferir uma experiência nativa (PaymentSheet), use `@stripe/stripe-react-native` — isso requer builds nativos (EAS) e configuração das chaves de publishable no app.

### Stripe Checkout (recomendado — sem dependência nativa)

Usamos o Stripe Checkout hospedado por padrão: o app envia os itens ao backend, o backend cria uma Checkout Session e retorna `{ url }`. O frontend abre essa URL com `Linking.openURL(url)` ou `expo-web-browser`.

Vantagens:
- Não exige dependências nativas nem builds EAS para funcionar.
- Simples de implementar e mantém a equipe livre de configuração nativa.

Se no futuro quiser uma experiência nativa (PaymentSheet), podemos reavaliar e adicionar `@stripe/stripe-react-native` quando estiverem prontos para builds EAS.

Se quiser, eu posso:

- Implementar confirmação via `PaymentIntent` + `@stripe/stripe-react-native` (requer EAS/development build), ou
- Ajustar o payload enviado ao backend para incluir endereço, frete e impostos.


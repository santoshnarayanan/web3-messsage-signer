
---

# 📄 `frontend/README.md`

```md
# Frontend – Web3 Message Signer & Verifier

This is the frontend React app for the Web3 Message Signer & Verifier project.  
It uses **React + Vite + TypeScript** with **Dynamic.xyz headless SDK** for authentication and embedded wallet support.

---

## 🚀 Features
- Headless Email OTP authentication via Dynamic
- Automatic embedded wallet provisioning
- Message signing via embedded wallet
- Signature verification via backend API
- Local history of signed messages (saved in localStorage)
- React + Vite + TypeScript + Vitest

---

## 📦 Installation

```bash
cd frontend
npm install
```


## 🛠 Development

Start Vite dev server:
```bash
npm run dev
```

## Frontend runs at:
`http://localhost:5173`

## ⚙️ Environment Variables

Create a `.env` file in the `frontend/` folder with:

```env
VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_sandbox_env_id
VITE_API_URL=http://localhost:4000


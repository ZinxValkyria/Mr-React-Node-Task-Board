# Simple React Node App

A full-stack web application with a React frontend and Express.js backend.

## Project Structure

```
simple-react-node-app/
├── client/          # React + Vite frontend
├── server/          # Express.js backend
└── README.md
```

## Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web framework
- **CORS** - Cross-Origin Resource Sharing

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd simple-react-node-app
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

### Running Locally

In separate terminals:

**Client (development server with hot reload):**
```bash
cd client
npm run dev
```
The frontend will be available at `http://localhost:5173`

**Server:**
```bash
cd server
npm start
```
The backend API will be available at `http://localhost:3000`

### Development Scripts

**Client:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

**Server:**
- `npm test` - Run tests (not yet configured)

## Building for Production

### Client
```bash
cd client
npm run build
```
Output will be in `client/dist/`

### Server
Build is typically handled by your hosting provider or deployment pipeline.

## Environment Variables

Create `.env` files in each directory as needed:

**client/.env** (if needed):
```
VITE_API_URL=http://localhost:3000
```

**server/.env** (if needed):
```
PORT=3000
NODE_ENV=development
```

## CI/CD Pipeline

This project includes GitHub Actions workflows for:
- **Testing** - Linting and code validation
- **Scanning** - Dependency vulnerability scanning
- **Deployment** - Automated deployment on main branch

See `.github/workflows/` for workflow definitions.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Create a pull request

## License

ISC

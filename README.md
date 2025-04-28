# 🐱 Ammo Cat - Tactical Feline Gear

Welcome to Ammo Cat, a modern e-commerce website for premium tactical gear for cats.

## 📋 Overview

Ammo Cat is a Next.js-powered website selling tactical equipment and accessories for feline companions. The project features a responsive design with Tailwind CSS and TypeScript.

## 🚀 Features

- Modern, responsive design
- Product catalog with categories
- Dynamic product pages
- Dark mode support
- Mobile-friendly navigation
- Newsletter subscription

## 🛠️ Technologies

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [ESLint](https://eslint.org/) - Code linting

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/ammo-cat.git
cd ammo-cat
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📂 Project Structure

```
ammo-cat/
├── src/
│   ├── app/           # App Router components and pages
│   ├── components/    # Reusable UI components
│   ├── lib/           # Utility functions and libraries
│   └── styles/        # Global styles
├── public/            # Static files
├── README.md          # Project documentation
└── package.json       # Project dependencies and scripts
```

## 🔍 Project Roadmap

- [ ] Add product detail pages
- [ ] Implement cart functionality
- [ ] Add authentication
- [ ] Integrate payment processing
- [ ] Create admin dashboard

## 🚀 Deployment

### GitHub Deployment

1. Create a new repository on GitHub
2. Initialize your local repository and push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/ammo-cat.git
git push -u origin main
```

### Vercel Deployment

1. Sign up or log in to [Vercel](https://vercel.com/)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. Click "Deploy"
6. Your site will be deployed and available at a Vercel URL

For continuous deployment, Vercel will automatically rebuild and deploy your site when you push changes to your GitHub repository.

## 📄 License

This project is licensed under the MIT License.

## 👏 Acknowledgements

- Inspiration from tactical gear websites
- Next.js documentation and community
- Tailwind CSS for the styling framework

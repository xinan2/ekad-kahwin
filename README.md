# 💍 Ekad Kahwin - Wedding Invitation App

A beautiful, modern digital wedding invitation app built with Next.js, featuring bilingual support (English/Malay), admin management, and RSVP functionality.

## ✨ Features

### 🎯 Core Features
- **Digital Wedding Invitation**: Beautiful, responsive wedding invitation page
- **3D Flip Animation**: Elegant flip effect to reveal formal invitation card
- **Bilingual Support**: Full English and Malay language support
- **Admin Dashboard**: Complete admin panel for managing wedding details
- **RSVP Management**: Guest RSVP system with phone number validation
- **Mobile Responsive**: Optimized for all device sizes

### 🎨 Design Features
- **Modern UI**: Clean, elegant design with green color scheme
- **Custom Icons**: Beautiful custom SVG icons throughout the app
- **Smooth Animations**: CSS transitions and transform effects
- **Typography**: Carefully chosen fonts for readability and elegance

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **Server Actions**: Modern Next.js server actions for form handling
- **PostgreSQL Database**: Production-ready database with Drizzle ORM
- **Form Validation**: Zod schema validation with React Hook Form
- **Session Management**: Secure admin authentication with iron-session

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Authentication**: [iron-session](https://github.com/vvo/iron-session)
- **Icons**: Custom SVG icons
- **Deployment**: Ready for [Vercel](https://vercel.com/)

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ekad-kahwin
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add:
   ```env
   SECRET_COOKIE_PASSWORD=''
   HCAPTCHA_SECRET_KEY=''
   NEXT_PUBLIC_HCAPTCHA_SITE_KEY=''
   DATABASE_URL=''
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Setup

**⚠️ IMPORTANT: Complete admin setup before using the app!**

### First-Time Setup

1. **Navigate to admin setup**
   ```
   http://localhost:3000/admin/setup
   ```

2. **Create admin account**
   - Enter your desired username
   - Create a strong password
   - Submit the form

3. **Login to admin panel**
   ```
   http://localhost:3000/admin/login
   ```

4. **Configure wedding details**
   ```
   http://localhost:3000/admin/edit-wedding-details
   ```

### Admin Features

- **Wedding Details Management**: Edit all wedding information
- **RSVP Monitoring**: View all guest responses and statistics
- **Bilingual Content**: Manage both English and Malay content
- **Invitation Card Content**: Customize formal invitation text

## 📱 Usage

### For Guests

1. **View Invitation**: Visit the main page to see the wedding invitation
2. **Flip to Formal Card**: Click the floating invitation button to see the formal invitation
3. **RSVP**: Fill out the RSVP form with name, phone, and number of attendees
4. **Language Toggle**: Switch between English and Malay using the language selector

### For Admins

1. **Login**: Access the admin panel at `/admin/login`
2. **Edit Details**: Update wedding information at `/admin/edit-wedding-details`
3. **View RSVPs**: Monitor guest responses at `/admin/rsvp`
4. **Logout**: Use the logout button when finished

## 🗂️ Project Structure

```
ekad-kahwin/
├── app/                          # Next.js App Router
│   ├── (protected)/              # Protected admin routes
│   │   └── admin/                # Admin panel pages
│   ├── (public)/                 # Public pages
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── icons/                    # Custom SVG icons
│   ├── ui/                       # UI components
│   └── *.tsx                     # Feature components
├── lib/                          # Utilities and core logic
│   ├── actions/                  # Server actions
│   ├── db/                       # Database schema and connection
│   │   ├── schema.ts             # Drizzle schema & Zod validation
│   │   └── connect.ts            # Database connection
│   ├── auth.ts                   # Authentication & database
│   └── utils.ts                  # Utility functions
├── locales/                      # Internationalization
│   ├── en.json                   # English translations
│   └── ms.json                   # Malay translations
└── drizzle/                      # Database migrations
```

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for theme customization
- Update CSS classes in components for design changes
- Color scheme uses green variants (green-50 to green-900)

### Content
- Edit translation files in `/locales/` for text changes
- Update default wedding details in `lib/auth.ts`
- Customize form validation in `lib/schemas/`

### Database
- PostgreSQL database with Drizzle ORM
- Schema defined in `lib/db/schema.ts`
- Migrations handled by Drizzle Kit

## 🔄 Database Management

The app uses Drizzle ORM for database management:

1. **Schema Definition**: Database tables defined in `lib/db/schema.ts`
2. **Migrations**: Generated and applied using Drizzle Kit
3. **Type Safety**: Full TypeScript support for database operations
4. **Connection**: PostgreSQL connection via connection pooling

### Database Operations
```bash
# Generate migrations after schema changes
npx drizzle-kit generate

# Apply migrations to database
npx drizzle-kit push

# View database in Drizzle Studio (optional)
npx drizzle-kit studio
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy

3. **Set Environment Variables**
   ```env
   SECRET_COOKIE_PASSWORD=your-production-secret-key
   DATABASE_URL=your-postgresql-connection-string
   HCAPTCHA_SECRET_KEY=your-hcaptcha-secret
   NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-hcaptcha-site-key
   ```

### Deployment Platforms
The app can be deployed for free on:
- Netlify (NextJS App)
- Neon (Postgres DB)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify environment variables are set
3. Ensure admin setup is completed
4. Check database permissions

## 🏗️ Development

### Development Standards
- **Form Implementation**: Follow `STANDARD_FORM_IMPLEMENTATION.md`
- **TypeScript**: Strict mode enabled
- **Code Style**: ESLint and Prettier configured
- **Components**: Reusable, well-typed components

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

---

Built with ❤️ for beautiful wedding celebrations 💒

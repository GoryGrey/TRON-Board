# TRON Board (波场论坛) - TRON-First Crypto Message Board

## Overview

TRON Board is a modern TRON-first crypto message board. The platform provides a space for discussions around the TRON ecosystem and broader cryptocurrency topics, with a unique aesthetic that blends cyberpunk elements with traditional forum design. While built primarily for the TRON ecosystem, TRON Board welcomes discussions, bounties, predictions, and research about all blockchain networks.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Database Structure](#database-structure)
- [Authentication](#authentication)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Features

- **Board System**: Multiple discussion boards for different topics
- **Post and Comment System**: Create, read, update, and delete posts and comments
- **User Authentication**: Sign up, login, and profile management
- **Cyberpunk UI**: Unique visual design with scanline effects and neon elements
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Default dark theme with cyberpunk aesthetics
- **Real-time Updates**: Live updates for new posts and comments
- **Search Functionality**: Search across posts and comments
- **User Profiles**: View user activity and information

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Next.js API routes, Server Actions
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## Architecture

The application follows a modern Next.js App Router architecture with a mix of server and client components:

### Key Directories

- `/app`: Next.js App Router pages and layouts
- `/components`: Reusable React components
- `/lib`: Utility functions and database operations
- `/contexts`: React context providers
- `/public`: Static assets

### Component Structure

- **Layout Components**: Header, Footer, Layout
- **Page Components**: Home, Board, Post, Profile
- **UI Components**: Buttons, Cards, Forms
- **Feature Components**: PostCard, CommentSection, UserAvatar

## Database Structure

The application uses Supabase with the following main tables:

### Tables

1. **users**
   - id (UUID, PK)
   - username (string)
   - email (string)
   - avatar_url (string)
   - created_at (timestamp)

2. **boards**
   - id (UUID, PK)
   - name (string)
   - description (string)
   - slug (string)
   - created_at (timestamp)
   - updated_at (timestamp)

3. **posts**
   - id (UUID, PK)
   - title (string)
   - content (text)
   - user_id (UUID, FK to users.id)
   - board_id (UUID, FK to boards.id)
   - created_at (timestamp)
   - updated_at (timestamp)

4. **comments**
   - id (UUID, PK)
   - content (text)
   - user_id (UUID, FK to users.id)
   - post_id (UUID, FK to posts.id)
   - parent_id (UUID, FK to comments.id, nullable)
   - created_at (timestamp)
   - updated_at (timestamp)

## Authentication

The application uses Supabase Authentication with the following features:

- Email/Password authentication
- Social login (optional)
- JWT tokens for session management
- Protected routes for authenticated users
- Role-based access control

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/your-username/tronboard.git
   cd tronboard
   \`\`\`

# SpendWise 

A comprehensive personal finance management application that empowers users to take control of their finance health through intelligent expense tracking, budget management, and goal setting.

![SpendWise](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Ruby](https://img.shields.io/badge/ruby-2.7.4-red.svg)
![Rails](https://img.shields.io/badge/rails-6.1.3-red.svg)
![React](https://img.shields.io/badge/react-18.0+-blue.svg)

## 🎯 Project Overview

SpendWise is a modern, full-stack personal finance application designed to help individuals manage their money effectively. Built with a Ruby on Rails API backend and a React frontend, it provides a seamless experience for tracking expenses, managing budgets, and achieving financial goals.

  ## 🚀 Features

### Budget Management
- **Create and manage budgets** for different financial goals
- **Set financial targets** for each budget
- **Track progress** towards your financial objectives
- **User-specific budgets** with secure access control

### Transaction Tracking
- **Record expenses** with detailed descriptions
- **Categorize transactions** for better organization
- **Track spending patterns** across different categories
- **Date-based transaction filtering**

### Category Management
- **Create custom spending categories**
- **Organize transactions** by category
- **Flexible category system** for personalized financial tracking

### User Authentication
- **Secure user registration** and login
- **JWT-based authentication** for API security
- **User-specific data isolation**
- **Role-based access control**

## 🏗️ Tech Stack

### Backend (API)
- **Ruby on Rails 6.1.3** - Web framework
- **PostgreSQL** - Database
- **Devise + JWT** - Authentication
- **JSONAPI Serializer** - API responses
- **RSpec** - Testing framework
- **Puma** - Web server

### Frontend
- **React** - User interface
- **Create React App** - Development environment
- **Modern JavaScript (ES6+)**

### DevOps & Tools
- **Rack CORS** - Cross-origin resource sharing
- **Spring** - Application preloader
- **Bootsnap** - Fast boot times

## 🏗️ Architecture

SpendWise follows a modern client-server architecture:

```
┌─────────────────────────────────────────────────┐
│                React Frontend                   │
│          (Port 3001 - Development)              │
│                                                 │
│  - Component-based UI                           │
│  - State Management                             │
│  - API Integration                              │
└──────────────────┬──────────────────────────────┘
                   │
                   │ HTTP/JSON API
                   │ JWT Authentication
                   │
┌──────────────────▼──────────────────────────────┐
│           Rails API Backend                     │
│          (Port 3000 - Development)              │
│                                                 │
│  - RESTful API Endpoints                        │
│  - Business Logic                               │
│  - Authentication & Authorization               │
└──────────────────┬──────────────────────────────┘
                   │
                   │ ActiveRecord ORM
                   │
┌──────────────────▼──────────────────────────────┐
│              PostgreSQL Database                │
│                                                 │
│  - User Data                                    │
│  - Budgets & Transactions                       │
│  - Categories                                   │
└─────────────────────────────────────────────────┘
```

**For detailed architecture documentation, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**

## 🚀 Quick Start

### Prerequisites

- Ruby 2.7.4
- Rails 6.1.3+
- PostgreSQL
- Node.js & npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Limeload/SpendWise.git
   cd SpendWise
   ```

2. **Backend Setup**
   ```bash
   # Install dependencies
   bundle install
   
   # Setup database
   rails db:create
   rails db:migrate
   rails db:seed
   
   # Start Rails server
   rails server
   ```
   The API will be available at `http://localhost:3000`

3. **Frontend Setup**
   ```bash
   # Navigate to client directory
   cd client
   
   # Install dependencies
   npm install
   
   # Start React development server
   npm start
   ```
   The frontend will be available at `http://localhost:3001`

## 🧪 Testing

```bash
# Backend tests
bundle exec rspec

# Frontend tests
cd client && npm test
```

### Database Commands
```bash
# Create database
rails db:create

# Run migrations
rails db:migrate

# Seed database
rails db:seed

# Reset database
rails db:reset
```

### Development Scripts
```bash
# Start both frontend and backend
./bin/start

# Setup development environment
./bin/setup
```

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | User authentication |
| POST | `/signup` | User registration |
| DELETE | `/logout` | User logout |

### Budget Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/budgets` | List user budgets |
| POST | `/api/v1/budgets` | Create new budget |
| GET | `/api/v1/budgets/:id` | Get specific budget |
| PATCH | `/api/v1/budgets/:id` | Update budget |
| DELETE | `/api/v1/budgets/:id` | Delete budget |

### Transaction Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/budgets/:budget_id/transactions` | List transactions |
| POST | `/api/v1/budgets/:budget_id/transactions` | Create transaction |
| GET | `/api/v1/budgets/:budget_id/transactions/:id` | Get transaction |
| PATCH | `/api/v1/budgets/:budget_id/transactions/:id` | Update transaction |
| DELETE | `/api/v1/budgets/:budget_id/transactions/:id` | Delete transaction |

### Category Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | List categories |
| POST | `/api/v1/categories` | Create category |
| GET | `/api/v1/categories/:id` | Get category |
| PATCH | `/api/v1/categories/:id` | Update category |
| DELETE | `/api/v1/categories/:id` | Delete category |

## 🗄️ Database Schema

### Users
- `email` - Unique user email
- `encrypted_password` - Securely hashed password
- `name` - User's full name
- `role` - User role for authorization
- `jti` - JWT token identifier

### Budgets
- `name` - Budget name
- `financial_goal` - Target amount
- `user_id` - Foreign key to users

### Transactions
- `amount` - Transaction amount
- `description` - Transaction details
- `date` - Transaction datetime
- `budget_id` - Foreign key to budgets
- `category_id` - Foreign key to categories

### Categories
- `name` - Unique category name
- `user_id` - Foreign key to users

## 🔒 Security

- Password encryption using bcrypt
- JWT-based stateless authentication
- CORS configuration for secure cross-origin requests
- Input validation and sanitization
- User-specific data isolation
- Role-based access control

## 🌐 Deployment

### Environment Variables

```bash
RAILS_MASTER_KEY      # Rails credentials key
DATABASE_URL          # PostgreSQL connection string
JWT_SECRET_KEY        # JWT secret for token signing
```

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow Ruby style guide for backend code
- Use ESLint/Prettier for frontend formatting
- Write tests for new features
- Update documentation for API changes

## 📋 Project Status

### Completed Features
✅ User authentication and authorization  
✅ Budget creation and management  
✅ Transaction tracking  
✅ Category management  
✅ RESTful API design  
✅ React frontend interface  

### Roadmap
-  **Dashboard analytics with spending insights**
-  **Budget vs actual spending comparisons**
-  **Recurring transaction support**
-  **Export functionality for financial data**
-  **Mobile app using React Native**
-  **Multi-currency support**
-  **Enhanced financial goal tracking and visualization**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 💬 Support

If you need help:
- Check the [documentation](docs/)
- Search [existing issues](https://github.com/Limeload/SpendWise/issues)
- Create a [new issue](https://github.com/Limeload/SpendWise/issues/new) with detailed information

**Made with ❤️ for better financial management**

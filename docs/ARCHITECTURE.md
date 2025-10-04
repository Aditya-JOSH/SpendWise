# SpendWise Architecture

## Table of Contents
1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Data Flow](#data-flow)
6. [Database Design](#database-design)
7. [Security Architecture](#security-architecture)
8. [API Design](#api-design)
9. [Technology Stack](#technology-stack)

---

## Overview

SpendWise is a full-stack personal finance management application built using a modern client-server architecture. The system separates concerns between a RESTful Rails API backend and a React-based frontend, communicating via JSON over HTTP.

### Design Philosophy

- **Separation of Concerns**: Clear boundary between presentation (React) and business logic (Rails)
- **API-First Design**: Backend exposes RESTful APIs that can be consumed by multiple clients
- **Stateless Authentication**: JWT tokens for scalable, stateless session management
- **Data Security**: User-specific data isolation with role-based access control
- **Modularity**: Component-based frontend and service-oriented backend

---

## System Architecture

### High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                           │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              React Frontend Application              │      │
│  │                                                      │      │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │      │
│  │  │   Auth   │  │  Budget  │  │   Transaction    │    │      │
│  │  │Components│  │Components│  │   Components     │    │      │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │      │
│  │                                                      │      │
│  │  ┌─────────────────────────────────────────────┐     │      │
│  │  │         State Management Layer              │     │      │
│  │  └─────────────────────────────────────────────┘     │      │
│  │                                                      │      │
│  │  ┌─────────────────────────────────────────────┐     │      │
│  │  │         API Service Layer                   │     │      │
│  │  │  (Axios/Fetch with JWT interceptors)        │     │      │
│  │  └─────────────────────────────────────────────┘     │      │
│  └──────────────────────────────────────────────────────┘      │
└───────────────────────┬────────────────────────────────────────┘
                        │
                        │ HTTPS/JSON
                        │ JWT Bearer Token
                        │
┌───────────────────────▼────────────────────────────────────────┐
│                      API GATEWAY LAYER                         │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                  Rack Middleware                     │      │
│  │  - CORS Configuration                                │      │
│  │  - Request Logging                                   │      │
│  │  - Rate Limiting (Future)                            │      │
│  └──────────────────────────────────────────────────────┘      │
└───────────────────────┬────────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────────────┐
│                   APPLICATION LAYER                            │
│                  (Ruby on Rails API)                           │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                   Controllers                        │      │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │      │
│  │  │  Auth    │  │  Budget  │  │   Transaction    │    │      │
│  │  │Controller│  │Controller│  │   Controller     │    │      │
│  │  └──────────┘  └──────────┘  └──────────────────┘    │      │
│  │  ┌──────────┐                                        │      │
│  │  │ Category │                                        │      │
│  │  │Controller│                                        │      │
│  │  └──────────┘                                        │      │
│  └──────────────────────────────────────────────────────┘      │
│                       │                                        │
│  ┌────────────────────▼──────────────────────────────────┐     │
│  │              Authentication Layer                     │     │
│  │  - Devise (User Management)                           │     │
│  │  - JWT Token Generation & Validation                  │     │
│  │  - Authorization & Access Control                     │     │
│  └───────────────────────────────────────────────────────┘     │
│                       │                                        │
│  ┌────────────────────▼──────────────────────────────────┐     │
│  │                  Business Logic                       │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐     │     │
│  │  │   User   │  │  Budget  │  │   Transaction    │     │     │
│  │  │  Model   │  │  Model   │  │     Model        │     │     │
│  │  └──────────┘  └──────────┘  └──────────────────┘     │     │
│  │  ┌──────────┐                                         │     │
│  │  │ Category │                                         │     │
│  │  │  Model   │                                         │     │
│  │  └──────────┘                                         │     │
│  └───────────────────────────────────────────────────────┘     │
│                       │                                        │
│  ┌────────────────────▼──────────────────────────────────┐     │
│  │              Serialization Layer                      │     │
│  │  - JSONAPI Serializer                                 │     │
│  │  - Response Formatting                                │     │
│  └───────────────────────────────────────────────────────┘     │
└───────────────────────┬────────────────────────────────────────┘
                        │
                        │ ActiveRecord ORM
                        │
┌───────────────────────▼────────────────────────────────────────┐
│                     DATA LAYER                                 │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                PostgreSQL Database                   │      │
│  │                                                      │      │
│  │  ┌──────┐  ┌────────┐  ┌────────────┐  ┌──────────┐  │      │
│  │  │Users │  │Budgets │  │Transactions│  │Categories│  │      │
│  │  │Table │  │ Table  │  │   Table    │  │  Table   │  │      │
│  │  └──────┘  └────────┘  └────────────┘  └──────────┘  │      │
│  │                                                      │      │
│  │  - Indexes for performance                           │      │
│  │  - Foreign key constraints                           │      │
│  │  - Data validation at DB level                       │      │
│  └──────────────────────────────────────────────────────┘      │
└────────────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### Rails API Structure

The Rails backend follows the MVC (Model-View-Controller) pattern, adapted for API-only mode:

```
spendwise/
├── app/
│   ├── controllers/
│   │   ├── application_controller.rb
│   │   ├── users
│   │   |── api/
│   │     
│   │   
│   │       
│   │      
│   │           
│   │           
│   │
│   ├── models/
│   │   ├── user.rb                # User model with Devise
│   │   ├── budget.rb              # Budget model
│   │   ├── transaction.rb         # Transaction model
│   │   └── category.rb            # Category model
│   │
│   |
│   │  
│   │   
│   │   
│   │
│   └── services/                  # Business logic services
│       └── (future service objects)
│
├── config/
│   ├── routes.rb                  # API routing
│   ├── database.yml               # Database configuration
│   └── initializers/
│       ├── cors.rb                # CORS configuration
│       └── devise.rb              # Authentication config
│
├── db/
│   ├── migrate/                   # Database migrations
│   └── schema.rb                  # Database schema
│
└── spec/                          # RSpec tests
    ├── models/
    ├── controllers/
    └── requests/
```

### Key Backend Components

#### 1. Controllers
- Handle HTTP requests and responses
- Implement authorization checks
- Delegate business logic to models
- Format responses using serializers

#### 2. Models
- Encapsulate business logic
- Define associations and validations
- Interact with database via ActiveRecord
- Implement scopes and custom methods

#### 3. Serializers
- Transform model data into JSON
- Control API response structure
- Include/exclude attributes based on context
- Handle associations serialization

#### 4. Authentication Layer
- **Devise**: User registration and management
- **JWT**: Token generation and validation
- Custom authentication logic in controllers

---

## Frontend Architecture

### React Application Structure (Preferred File Structure & Naming)

```
client/
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   ├── budgets/
│   │   │   ├── BudgetList.jsx
│   │   │   ├── BudgetForm.jsx
│   │   │   └── BudgetDetail.jsx
│   │   │
│   │   ├── transactions/
│   │   │   ├── TransactionList.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── TransactionItem.jsx
│   │   │
│   │   ├── categories/
│   │   │   ├── CategoryList.jsx
│   │   │   └── CategoryForm.jsx
│   │   │
│   │   └── common/
│   │       ├── Header.jsx
│   │       ├── Navigation.jsx
│   │       └── Footer.jsx
│   │
│   ├── services/
│   │   ├── api.js              # Axios configuration
│   │   ├── authService.js      # Authentication API calls
│   │   ├── budgetService.js    # Budget API calls
│   │   ├── transactionService.js
│   │   └── categoryService.js
│   │
│   ├── context/                # React Context for state
│   │   ├── AuthContext.jsx
│   │   └── BudgetContext.jsx
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useBudgets.js
│   │
│   ├── utils/
│   │   ├── helpers.js
│   │   └── validators.js
│   │
│   ├── App.js                  # Main application component
│   └── index.js                # Application entry point
│
└── package.json
```

### Frontend Component Hierarchy

```
App
├── AuthProvider
│   ├── PublicRoutes
│   │   ├── Login
│   │   └── Signup
│   │
│   └── PrivateRoutes
│       ├── Dashboard
│       │   ├── Header
│       │   ├── Navigation
│       │   └── Main Content
│       │
│       ├── BudgetList
│       │   ├── BudgetItem
│       │   └── BudgetForm
│       │
│       ├── TransactionList
│       │   ├── TransactionItem
│       │   └── TransactionForm
│       │
│       └── CategoryList
│           ├── CategoryItem
│           └── CategoryForm
```

---

## Data Flow

### Authentication Flow

```
1. User Login Request
   │
   ├─> React: User submits credentials
   │
   ├─> API: POST /login
   │   └─> Sessions Controller
   │       └─> Devise Authentication
   │           └─> Generate JWT Token
   │
   ├─> Response: { token, user }
   │
   └─> React: Store token in memory/context
       └─> Set Authorization header for future requests

2. Authenticated Request
   │
   ├─> React: API call with Authorization: Bearer <token>
   │
   ├─> API: Rack Middleware validates JWT
   │   └─> Extract user from token
   │       └─> Set current_user
   │
   ├─> Controller: Process request with current_user
   │
   └─> Response: Protected resource data
```

### CRUD Operation Flow (Example: Budget Creation)

```
┌─────────────┐
│   React     │  1. User fills BudgetForm
│  Component  │     and clicks "Create Budget"
└──────┬──────┘
       │
       │ 2. onSubmit handler triggered
       │
┌──────▼──────┐
│   Service   │  3. budgetService.createBudget(data)
│    Layer    │     - Adds JWT token to headers
└──────┬──────┘     - Makes POST request
       │
       │ 4. POST /api/v1/budgets
       │    Body: { name, financial_goal }
       │
┌──────▼──────────┐
│     Rails       │  5. Routes to BudgetsController#create
│   Controller    │     - Authenticates user via JWT
└──────┬──────────┘     - Authorizes access
       │
       │ 6. current_user.budgets.create(params)
       │
┌──────▼──────┐
│    Model    │  7. Budget model validations
│             │     - Validates presence of name
└──────┬──────┘     - Associates with user
       │
       │ 8. Save to database
       │
┌──────▼──────┐
│  Database   │  9. INSERT INTO budgets
│             │     RETURNING *
└──────┬──────┘
       │
       │ 10. Budget record
       │
┌──────▼───────────┐
│   Serializer     │  11. BudgetSerializer formats response
│                  │      - Includes relevant attributes
└──────┬───────────┘      - Formats associations
       │
       │ 12. JSON response
       │     { data: { id, name, financial_goal, ... } }
       │
┌──────▼──────┐
│   Service   │  13. Receives response
│    Layer    │      - Returns data to component
└──────┬──────┘
       │
       │ 14. Update component state
       │
┌──────▼──────┐
│   React     │  15. Re-render with new budget
│  Component  │      - Display success message
└─────────────┘      - Update budget list
```

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────────┐
│       Users         │
├─────────────────────┤
│ id (PK)             │
│ email               │───────┐
│ encrypted_password  │       │
│ name                │       │
│ role                │       │
│ jti                 │       │
│ created_at          │       │
│ updated_at          │       │
└─────────────────────┘       │
                              │
                              │ 1:N (One user has many budgets)
                              │
                    ┌─────────▼──────────┐
                    │      Budgets       │
                    ├────────────────────┤
                    │ id (PK)            │
                    │ name               │
                    │ financial_goal     │
                    │ user_id (FK)       │──┐
                    │ created_at         │  │
                    │ updated_at         │  │
                    └────────────────────┘  │
                                            │
                                            │ 1:N (One budget has many transactions)
                                            │
                              ┌─────────────▼──────────────┐
                              │      Transactions          │
                              ├────────────────────────────┤
                              │ id (PK)                    │
                              │ amount                     │
                              │ description                │
                              │ date                       │
                              │ budget_id (FK)             │
                              │ category_id (FK)           │
                              │ created_at                 │
                              │ updated_at                 │
                              └──────────┬─────────────────┘
                                         │
                                         │ N:1 (Many transactions belong to one category)
                                         │
                                ┌────────▼────────┐
                                │   Categories    │
                                ├─────────────────┤
                                │ id (PK)         │
                                │ name            │
                                │ created_at      │
                                │ updated_at      │
                                └─────────────────┘
```

### Database Relationships

- **Users → Budgets**: One-to-Many (A user can have multiple budgets)
- **Budgets → Transactions**: One-to-Many (A budget can have multiple transactions)
- **Categories → Transactions**: One-to-Many (A category can have multiple transactions)

### Indexes

```sql
-- Performance optimization indexes
CREATE INDEX index_budgets_on_user_id ON budgets(user_id);
CREATE INDEX index_transactions_on_budget_id ON transactions(budget_id);
CREATE INDEX index_transactions_on_category_id ON transactions(category_id);
CREATE INDEX index_transactions_on_date ON transactions(date);
CREATE UNIQUE INDEX index_users_on_email ON users(email);
CREATE UNIQUE INDEX index_categories_on_name ON categories(name);
```

---

## Security Architecture

### Authentication & Authorization

#### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "jti": "token_identifier",
    "exp": "expiration_timestamp",
    "iat": "issued_at_timestamp"
  },
  "signature": "HMACSHA256(...)"
}
```

#### Security Layers

1. **Transport Security**
   - HTTPS in production
   - Secure headers (HSTS, CSP)

2. **Authentication**
   - Password hashing with bcrypt (cost factor 12)
   - JWT tokens with expiration
   - Token revocation via JTI

3. **Authorization**
   - User-specific resource isolation
   - Role-based access control
   - Controller-level authorization checks

4. **Input Validation**
   - Strong parameters in controllers
   - Model-level validations
   - SQL injection prevention via ActiveRecord

5. **CORS Configuration**
   - Whitelist allowed origins
   - Credential support for authenticated requests
   - Limited HTTP methods

---

## API Design

### RESTful Conventions

The API follows REST principles:

- **Resources**: Budgets, Transactions, Categories
- **HTTP Methods**: GET, POST, PATCH, DELETE
- **Status Codes**: 200, 201, 204, 400, 401, 403, 404, 422, 500
- **JSON Format**: JSONAPI specification

### Versioning

API versioned via URL path: `/api/v1/`

### Response Format

```json
{
  "data": {
    "id": "1",
    "type": "budget",
    "attributes": {
      "name": "Monthly Budget",
      "financial_goal": 5000.00
    },
    "relationships": {
      "transactions": {
        "data": [
          { "id": "1", "type": "transaction" }
        ]
      }
    }
  }
}
```

---
## Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Ruby | 2.7.4 | Programming language |
| Rails | 6.1.3+ | Web application framework |
| PostgreSQL | Latest | Relational database |
| Devise | Latest | Authentication framework |
| JWT | Latest | Token-based authentication |
| JSONAPI Serializer | Latest | API response formatting |
| RSpec | Latest | Testing framework |
| Puma | Latest | Web server |
| Rack CORS | Latest | Cross-origin resource sharing |

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.0+ | UI library |
| JavaScript | ES6+ | Programming language |
| Create React App | Latest | Build tooling |
| Axios/Fetch | Latest | HTTP client |
| React Router | Latest | Client-side routing |
| CSS/CSS Modules | - | Styling |

### Development Tools

- **Git**: Version control
- **Bundler**: Ruby dependency management
- **npm**: JavaScript package manager
- **Spring**: Rails application preloader
- **Bootsnap**: Boot time optimization

---

## Scalability Considerations

### Current Architecture Benefits

1. **Stateless API**: JWT tokens enable horizontal scaling
2. **Database Connection Pooling**: Efficient resource usage
3. **Separation of Concerns**: Frontend and backend can scale independently

## Development Workflow

### Local Development

```
Developer Machine
├── Rails API
│   └── PostgreSQL
└── React Dev Server
    └── Proxies API requests
```

### Testing Strategy (In best practice)

1. **Backend Testing**
   - Model specs (validations, associations)
   - Controller specs (authentication, authorization)
   - Request specs (integration tests)
   
2. **Frontend Testing**
   - Component tests (Jest + React Testing Library)
   - Integration tests
   - E2E tests (future: Cypress)

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────┐
│              Load Balancer                  │
│            (SSL Termination)                │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
┌───────▼──────┐  ┌──▼──────────┐
│   Rails API  │  │ React SPA   │
│   Instance   │  │  (Static)   │
└───────┬──────┘  └─────────────┘
        │
┌───────▼──────┐
│  PostgreSQL  │
│   Database   │
└──────────────┘
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Assets precompiled
- [ ] SSL certificates installed
- [ ] CORS configured for production domain
- [ ] Database backups scheduled
- [ ] Monitoring and logging configured

---

## Monitoring & Logging

### Application Monitoring

- **Error Tracking**: Exception monitoring
- **Performance Monitoring**: Response times, database queries
- **User Analytics**: Usage patterns

### Logging Strategy

- **Application Logs**: Rails logger
- **API Access Logs**: Request/response logging
- **Security Logs**: Authentication attempts, authorization failures

---

## Conclusion

SpendWise's architecture provides a solid foundation for a scalable, maintainable personal finance application. The separation of concerns between the Rails API and React frontend enables independent development and deployment while maintaining clean interfaces between layers. The authentication system ensures data security, and the RESTful API design facilitates future expansion including mobile applications.

For questions or contributions regarding the architecture, please refer to the main [README.md](../README.md) or open an issue on GitHub.

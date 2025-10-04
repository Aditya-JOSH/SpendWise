# SpendWise Project Structure

This document provides a comprehensive overview of the SpendWise project structure, explaining the purpose of each directory and key files.

## Root Directory Structure

```
SpendWise/
├── app/                    # Rails application core
├── bin/                    # Binary executables and scripts
├── client/                 # React frontend application
├── config/                 # Application configuration
├── db/                     # Database files
├── docs/                   # Documentation
├── lib/                    # Library modules
├── log/                    # Application logs
├── public/                 # Static files
├── spec/                   # RSpec test files
├── storage/                # Active Storage files
├── tmp/                    # Temporary files
├── vendor/                 # Third-party code
├── .gitignore             # Git ignore rules
├── .rspec                 # RSpec configuration
├── Gemfile                # Ruby dependencies
├── Gemfile.lock           # Locked Ruby dependencies
├── LICENSE.md             # MIT License
├── README.md              # Project documentation
├── Rakefile               # Rake tasks
└── config.ru              # Rack configuration
```

---

## Backend Structure (Rails API)

### `/app` - Application Core

```
app/
├── channels/              # Action Cable channels (WebSockets)
├── controllers/           # Request handlers
│   ├── api/
│   │   └── v1/           # API version 1 endpoints
│   │       ├── budgets_controller.rb
│   │       ├── categories_controller.rb
│   │       └── transactions_controller.rb
│   ├── users/            # Authentication controllers
│   │   ├── registrations_controller.rb
│   │   └── sessions_controller.rb
│   ├── application_controller.rb
│   └── concerns/         # Controller concerns/mixins
│
├── jobs/                 # Background job classes
├── mailers/              # Email mailers
├── models/               # Business logic and data models
│   ├── application_record.rb
│   ├── budget.rb
│   ├── category.rb
│   ├── transaction.rb
│   ├── user.rb
│   └── concerns/         # Model concerns/mixins
│
└── views/                # View templates (minimal for API)
    └── layouts/
        └── application.html.erb
```

#### Key Backend Files

**Controllers**
- `application_controller.rb` - Base controller with authentication logic
- `api/v1/*_controller.rb` - RESTful API endpoints for resources
- `users/sessions_controller.rb` - Login/logout functionality
- `users/registrations_controller.rb` - User signup

**Models**
- `user.rb` - User authentication and profile
- `budget.rb` - Budget management logic
- `transaction.rb` - Transaction records
- `category.rb` - Transaction categories

**Serializers**
- Format JSON responses according to JSONAPI specification
- Control which attributes are exposed in API responses

---

### `/config` - Configuration Files

```
config/
├── environments/         # Environment-specific configs
│   ├── development.rb   # Development settings
│   ├── production.rb    # Production settings
│   └── test.rb          # Test settings
│
├── initializers/        # Initialization code
│   ├── cors.rb          # CORS configuration
│   ├── devise.rb        # Authentication setup
│   ├── filter_parameter_logging.rb
│   └── wrap_parameters.rb
│
├── locales/             # Internationalization files
│   └── en.yml
│
├── application.rb       # Main application configuration
├── boot.rb             # Boot sequence
├── cable.yml           # Action Cable configuration
├── credentials.yml.enc # Encrypted credentials
├── database.yml        # Database configuration
├── environment.rb      # Environment loader
├── puma.rb            # Puma web server config
├── routes.rb          # URL routing
├── spring.rb          # Spring preloader config
└── storage.yml        # Active Storage config
```

#### Key Configuration Files

**routes.rb**
- Defines all API endpoints
- Maps URLs to controllers and actions
- API versioning structure

**database.yml**
- PostgreSQL connection settings
- Environment-specific database configs

**initializers/cors.rb**
- Cross-Origin Resource Sharing rules
- Allowed origins and methods
- Credential support configuration

**initializers/devise.rb**
- JWT configuration
- Session management
- Password requirements

---

### `/db` - Database Files

```
db/
├── migrate/              # Database migrations
│   ├── 20xx_devise_create_users.rb
│   ├── 20xx_create_budgets.rb
│   ├── 20xx_create_transactions.rb
│   ├── 20xx_create_categories.rb
│   └── ...
│
├── schema.rb            # Current database schema
└── seeds.rb             # Sample data for development
```

#### Database Migrations

Migrations create and modify database structure:
- **Users**: Authentication and profile tables
- **Budgets**: Budget management tables
- **Transactions**: Expense tracking tables
- **Categories**: Transaction categorization tables

---

### `/spec` - Test Files

```
spec/
├── controllers/         # Controller tests
├── models/             # Model tests
│   ├── budget_spec.rb
│   ├── category_spec.rb
│   ├── transaction_spec.rb
│   └── user_spec.rb
│
├── requests/           # Integration tests
├── factories/          # Test data factories
├── support/            # Test helpers
├── rails_helper.rb     # Rails test configuration
└── spec_helper.rb      # RSpec configuration
```

---

## Frontend Structure (React)

### `/client` - React Application

```
client/
├── public/              # Static assets
│   ├── index.html      # HTML template
│   ├── favicon.ico
│   └── manifest.json
│
├── src/                # Source code
│   ├── components/     # React components
│   │   ├── auth/       # Authentication components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   ├── budgets/    # Budget components
│   │   │   ├── BudgetList.jsx
│   │   │   ├── BudgetForm.jsx
│   │   │   └── BudgetDetail.jsx
│   │   │
│   │   ├── transactions/  # Transaction components
│   │   │   ├── TransactionList.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   └── TransactionItem.jsx
│   │   │
│   │   ├── categories/    # Category components
│   │   │   ├── CategoryList.jsx
│   │   │   └── CategoryForm.jsx
│   │   │
│   │   └── common/        # Shared components
│   │       ├── Header.jsx
│   │       ├── Navigation.jsx
│   │       ├── Footer.jsx
│   │       └── Loading.jsx
│   │
│   ├── context/        # React Context providers
│   │   ├── AuthContext.jsx
│   │   └── BudgetContext.jsx
│   │
│   ├── hooks/          # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useBudgets.js
│   │   └── useTransactions.js
│   │
│   ├── services/       # API service layer
│   │   ├── api.js              # Axios configuration
│   │   ├── authService.js      # Auth API calls
│   │   ├── budgetService.js    # Budget API calls
│   │   ├── categoryService.js  # Category API calls
│   │   └── transactionService.js
│   │
│   ├── utils/          # Utility functions
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   └── formatters.js
│   │
│   ├── styles/         # CSS/SCSS files
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── App.js          # Main application component
│   ├── App.test.js     # App tests
│   ├── index.js        # Application entry point
│   └── setupTests.js   # Test configuration
│
├── .gitignore
├── package.json        # Node dependencies
├── package-lock.json   # Locked Node dependencies
└── README.md          # Frontend documentation
```

#### Key Frontend Files

**App.js**
- Root component
- Routing configuration
- Provider setup (Auth, Context)

**services/api.js**
- Axios instance configuration
- Request/response interceptors
- JWT token attachment
- Error handling

**context/AuthContext.jsx**
- User authentication state
- Login/logout functions
- Protected route logic

**components Structure**
- **auth/**: Login, signup, and authentication flows
- **budgets/**: Budget CRUD operations
- **transactions/**: Transaction management
- **categories/**: Category management
- **common/**: Reusable UI components

---

## Documentation Structure

### `/docs` - Project Documentation

```
docs/
├── ARCHITECTURE.md       # System architecture overview
├── PROJECT_STRUCTURE.md  # This file
├── API_DOCUMENTATION.md  # API endpoint reference
├── SETUP_GUIDE.md       # Development setup guide
├── DEPLOYMENT.md        # Deployment instructions
└── CONTRIBUTING.md      # Contribution guidelines
```

---

## Binary and Script Files

### `/bin` - Executable Scripts

```
bin/
├── rails               # Rails command runner
├── rake                # Rake task runner
├── update             # Project update script
├── spring             # Spring preloader
└── bundle             # Bundler wrapper
```

---

## Key Configuration Files

### Root Level Files

**Gemfile**
```ruby
# Defines Ruby gem dependencies
# Key gems:
# - rails: Web framework
# - pg: PostgreSQL adapter
# - devise: Authentication
# - devise-jwt: JWT tokens
# - jsonapi-serializer: API responses
# - rack-cors: CORS handling
# - rspec-rails: Testing
```

**package.json** (in client/)
```json
{
  "dependencies": {
    "react": "UI library",
    "react-router-dom": "Routing",
    "axios": "HTTP client"
  }
}
```

**config.ru**
```ruby
# Rack configuration file
# Entry point for Rack-based servers (Puma)
```

**.gitignore**
- Excludes temporary files from Git
- Protects sensitive credentials
- Ignores node_modules and logs

---

## Environment-Specific Files

### Development
- `config/environments/development.rb`
- `log/development.log`
- Local database (`spendwise_development`)

### Test
- `config/environments/test.rb`
- `log/test.log`
- Test database (`spendwise_test`)
- `spec/` directory for tests

### Production
- `config/environments/production.rb`
- `log/production.log`
- Production database (configured via `DATABASE_URL`)
- Precompiled assets

---

## System Design Format

### API Request Flow

```
1. HTTP Request arrives
   ↓
2. config/routes.rb
   Maps URL to controller action
   ↓
3. app/controllers/api/v1/*_controller.rb
   Authenticates user, authorizes access
   ↓
4. app/models/*.rb
   Business logic, validations
   ↓
5. db/ (via ActiveRecord)
   Database operations
   ↓
6. app/serializers/*_serializer.rb
   Format response as JSON
   ↓
7. HTTP Response sent back
```

### Frontend Component Flow

```
1. User interaction in Component
   ↓
2. Event handler calls Service
   ↓
3. src/services/*.js
   Makes API request with JWT token
   ↓
4. Backend API (as above)
   ↓
5. Response returns to Service
   ↓
6. Service returns data to Component
   ↓
7. Component updates state
   ↓
8. React re-renders UI
```

---

## Adding New Features (Preferred)

### Adding a New Backend Resource

1. **Generate migration**
   ```bash
   rails g migration CreateResourceName
   ```
   Location: `db/migrate/`

2. **Create model**
   ```ruby
   # app/models/resource_name.rb
   class ResourceName < ApplicationRecord
     # associations, validations
   end
   ```

3. **Create controller**
   ```ruby
   # app/controllers/api/v1/resource_names_controller.rb
   class Api::V1::ResourceNamesController < ApplicationController
     # CRUD actions
   end
   ```

4. **Create serializer**
   ```ruby
   # app/serializers/resource_name_serializer.rb
   class ResourceNameSerializer
     # attributes to serialize
   end
   ```

5. **Add routes**
   ```ruby
   # config/routes.rb
   namespace :api do
     namespace :v1 do
       resources :resource_names
     end
   end
   ```

6. **Write tests**
   ```ruby
   # spec/models/resource_name_spec.rb
   # spec/controllers/api/v1/resource_names_controller_spec.rb
   ```

### Adding a New Frontend Component

1. **Create component file**
   ```javascript
   // src/components/feature/ComponentName.jsx
   import React from 'react';
   
   const ComponentName = () => {
     return <div>Component</div>;
   };
   
   export default ComponentName;
   ```

2. **Create service (if needed)**
   ```javascript
   // src/services/featureService.js
   import api from './api';
   
   export const featureService = {
     // API calls
   };
   ```

3. **Add routing (if needed)**
   ```javascript
   // src/App.js
   import ComponentName from './components/feature/ComponentName';
   
   <Route path="/feature" component={ComponentName} />
   ```

4. **Write tests**
   ```javascript
   // src/components/feature/ComponentName.test.js
   ```

---

## Best Practices

### Backend Organization

1. **Keep controllers thin** - Move business logic to models or services
2. **Use concerns for shared code** - DRY principle
4. **Use serializers consistently** - Maintain API contract
5. **Follow Rails conventions** - Predictable structure

### Frontend Organization

1. **Component structure**
   - One component per file
   - Group related components in folders
   - Separate concerns (presentation vs logic)

2. **State management**
   - Use Context for global state
   - Local state for component-specific data
   - Custom hooks for reusable logic

3. **Code organization**
   - Keep components small and focused
   - Extract utility functions
   - Centralize API calls in services

4. **Naming conventions**
   - Clear, descriptive names
   - Follow React conventions
   - Consistent file naming

---

## Dependencies Management

### Backend Dependencies (Gemfile)

```ruby
group :development, :test do
  # Debugging and testing tools
end

group :development do
  # Development-only tools
end

group :production do
  # Production-specific gems
end
```

**Update dependencies:**
```bash
bundle update
bundle install
```

### Frontend Dependencies (package.json)

```json
{
  "dependencies": {
    // Production dependencies
  },
  "devDependencies": {
    // Development dependencies
  }
}
```

**Update dependencies:**
```bash
cd client
npm update
npm install
```

---

## Security-Sensitive Files

### Never Commit to Git

- `config/master.key` - Rails credentials key
- `config/credentials.yml.enc` - Can be committed (encrypted)
- `.env` files - Environment variables
- `log/*` - Log files
- `tmp/*` - Temporary files
- `node_modules/` - Node packages
- `storage/` - Uploaded files

### Protected by .gitignore

The `.gitignore` file ensures sensitive and temporary files are never committed to the repository.

---

## Conclusion

This document provides a comprehensive map of the SpendWise project structure. Understanding this organization helps developers:

- Locate files quickly
- Follow established patterns
- Maintain consistency
- Add new features effectively

For more information, see:
- [ARCHITECTURE.md](ARCHITECTURE.md) - System design
- [README.md](../README.md) - Getting started
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines

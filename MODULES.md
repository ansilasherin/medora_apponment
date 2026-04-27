# Project Modules Documentation

## Overview
This document outlines all the npm modules included in the Appointment Booking Application, their purposes, and how they contribute to the system's functionality.

## Dependencies

### Core Web Framework
- **express** (`^5.2.1`)
  - Fast, unopinionated, minimalist web framework for Node.js
  - Handles HTTP requests, routing, and middleware
  - Used for building the REST API endpoints

### Database & Data Management
- **mongoose** (`^9.5.0`)
  - MongoDB object modeling for Node.js
  - Provides schema-based solution for modeling application data
  - Handles database connections, queries, and data validation
  - Used for all database operations (Users, Doctors, Appointments, etc.)

### Authentication & Security
- **bcryptjs** (`^3.0.3`)
  - Library for hashing passwords
  - Provides secure password hashing and verification
  - Used in user registration and login authentication

- **jsonwebtoken** (`^9.0.3`)
  - Implementation of JSON Web Tokens (JWT)
  - Used for stateless authentication
  - Generates and verifies tokens for secure API access

### Configuration & Environment
- **dotenv** (`^17.4.2`)
  - Loads environment variables from a `.env` file
  - Keeps sensitive configuration (database URLs, secrets) secure
  - Used to manage database connection strings and JWT secrets

### Cross-Origin Resource Sharing
- **cors** (`^2.8.6`)
  - Enables Cross-Origin Resource Sharing
  - Allows the API to be accessed from different domains
  - Essential for Flutter web applications and mobile apps

### PDF Generation
- **pdfkit** (`^0.18.0`)
  - PDF generation library for Node.js
  - Creates PDF documents programmatically
  - Used to generate appointment receipts and medical reports

## Module Usage in Application

### Authentication Flow
```
User Registration/Login → bcryptjs (password hashing) → jsonwebtoken (token generation) → express (API responses)
```

### Database Operations
```
API Requests → express (routing) → mongoose (database queries) → MongoDB Atlas
```

### PDF Generation
```
Appointment Data → pdfkit (PDF creation) → express (file download response)
```

### Security & Configuration
```
Environment Variables → dotenv (loading) → express/mongoose (configuration)
Cross-Origin Requests → cors (handling) → express (middleware)
```

## Installation
All modules are installed via npm and listed in `package.json`. To install all dependencies:

```bash
npm install
```

## Version Management
- All modules use semantic versioning (^) for automatic minor updates
- Major version changes should be tested thoroughly before upgrading
- Regular `npm audit` checks are recommended for security vulnerabilities

## Development Notes
- **express**: Version 5.x provides better async/await support
- **mongoose**: Version 9.x includes improved TypeScript support and performance
- **pdfkit**: Lightweight PDF generation without external dependencies
- **bcryptjs**: Pure JavaScript implementation, no native compilation needed

## Production Considerations
- All modules are production-ready
- Consider using `npm ci` in production for faster, reliable installs
- Monitor for security updates using `npm audit`
- Use environment-specific configuration for different deployment stages
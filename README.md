# WanderLust

A full-stack Node.js travel listing application built with Express, EJS, MongoDB, Passport authentication, Cloudinary image uploads, and Mapbox geocoding.

## Overview

WanderLust is a travel marketplace-style web app that allows users to:
- browse and explore travel listings
- create new listings with images, location, price, and description
- add reviews and ratings to listings
- sign up, log in, and manage ownership of created listings
- view listing locations on an interactive Mapbox map

The application follows an MVC-inspired architecture with clear separation of controllers, routes, models, and views.

## Key Features

- User authentication using Passport.js and passport-local-mongoose
- Listing CRUD: create, read, update, and delete travel listings
- Review creation and deletion for authenticated users
- Cloudinary image upload and storage
- Mapbox geocoding for location coordinates and interactive map display
- Server-side validation with Joi for listings and reviews
- Session persistence with MongoDB-backed sessions
- Flash messages for success and error notifications

## Architecture

- `app.js` - application entry point and main Express configuration
- `controllers/` - controller logic for listings, reviews, and user actions
- `routes/` - route definitions for listings, reviews, and authentication
- `models/` - Mongoose schemas for `Listing`, `Review`, and `User`
- `middleware.js` - authentication, authorization, and request validation middleware
- `cloudconfig.js` - Cloudinary configuration and upload storage setup
- `schema.js` - Joi request validation schemas
- `utils/` - shared utility helpers for error handling and async wrappers
- `views/` - EJS templates and partials for rendering UI
- `public/` - static assets, CSS, and client-side JavaScript

## Folder Structure

```
app.js
cloudconfig.js
middleware.js
package.json
schema.js
README.md
controllers/
  listings.js
  reviews.js
  users.js
models/
  listing.js
  review.js
  users.js
routes/
  listing.js
  review.js
  user.js
utils/
  ExpressError.js
  wrapAsync.js
views/
  layouts/
    boilerplate.ejs
  includes/
    flash.ejs
    footer.ejs
    navbar.ejs
  listings/
    edit.ejs
    index.ejs
    new.ejs
    show.ejs
  user/
    login.ejs
    signup.ejs
public/
  css/
    rating.css
    style.css
  js/
    map.js
    script.js
cloudconfig.js
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ankit-kumar-2327/wanderlust.git
   cd wanderlust
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root with the required environment variables.

## Environment Variables

The app depends on the following variables in `.env`:

- `NODE_ENV` - set to `production` in production environments
- `ATLAS_MONGODB_URL` - MongoDB connection string
- `SECRET` - session and cookie secret
- `CLOUD_NAME` - Cloudinary cloud name
- `CLOUD_API_KEY` - Cloudinary API key
- `CLOUD_API_SECRET` - Cloudinary API secret
- `MAP_TOKEN` - Mapbox access token

Example `.env` content:

```env
NODE_ENV=development
ATLAS_MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/wanderlust
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_api_token
```

> Do not commit `.env` to source control.

## Run the App

Start the application locally:

```bash
node app.js
```

Then open `http://localhost:8080` in your browser.

## Important Routes

- `GET /listings` - view all listings
- `GET /listings/new` - render new listing form
- `POST /listings` - create a listing
- `GET /listings/:id` - view a listing detail page
- `GET /listings/:id/edit` - edit a listing
- `PUT /listings/:id` - update a listing
- `DELETE /listings/:id` - delete a listing
- `POST /listings/:id/reviews` - create a review
- `DELETE /listings/:id/reviews/:reviewId` - delete a review
- `GET /signup` - render signup page
- `POST /signup` - register a user
- `GET /login` - render login page
- `POST /login` - authenticate a user
- `GET /logout` - log out the current user

## Data Model Summary

### Listing
- `title` - string
- `description` - string
- `image` - Cloudinary image object with `url` and `filename`
- `price` - number
- `location` - string
- `country` - string
- `reviews` - references to `Review`
- `owner` - reference to `User`
- `geometry` - GeoJSON `Point` for Mapbox mapping

### Review
- `comment` - string
- `rating` - number
- `createdAt` - date
- `createdBy` - reference to `User`

### User
- `username` - string
- `email` - string
- passport-local-mongoose fields for password hashing and authentication

## Validation

Request validation is performed with Joi in `schema.js`:
- `listingSchema` validates new and updated listing payloads
- `reviewSchema` validates review submissions

## Notes and Observations

- The app uses Cloudinary for file uploads and stores images in the `StayVisita` folder.
- Mapbox geocoding transforms a listing location into coordinates stored in the listing model.
- Sessions are stored in MongoDB using `connect-mongo`.
- Flash messages are used for user feedback.
- Client-side form validation is implemented using Bootstrap custom validation.

## Future Improvements

To make this project stronger and more resume-ready, consider adding:

- search and filtering for listings by location, price, and country
- pagination for listing results
- multi-image upload for listings
- user profile and dashboard pages
- review ownership UI restricting delete actions to review authors
- booking or reservation workflow
- authorization roles such as `host`, `guest`, and `admin`
- password reset and email verification
- HTTPS and secure cookie settings in production
- input sanitization and rate limiting for security
- test coverage with Jest or Mocha
- GitHub Actions CI for linting and testing
- Docker setup and deployment scripts

## Recommended Resume Bullet

- Built a full-stack travel listing web application using Node.js, Express, MongoDB, Passport authentication, Cloudinary image upload, and Mapbox geocoding.
- Implemented secure session management, user authorization, review features, and server-side data validation.

## Dependencies

- express
- ejs
- ejs-mate
- mongoose
- passport
- passport-local
- passport-local-mongoose
- connect-mongo
- express-session
- connect-flash
- dotenv
- joi
- multer
- multer-storage-cloudinary
- cloudinary
- method-override
- @mapbox/mapbox-sdk

## License

This project is licensed under ISC.

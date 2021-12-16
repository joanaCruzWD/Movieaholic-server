# Movieaholic- `README.md`

## Description

This is an app to manage your world of movies, those you already have seen and those you plan to see in a near future. This app will help you to understand which movie do you can easily re-watch or don't repeat it at all, or in other way you can store the movies in a list to watch them later. If you don't want that list so long (in case that you are a busy person), you can as well delete some movies from your list and then if you have a moment can search it again.

## User Stories

- **404:** If I am a user, and I try to reach some page that does not exist it will show up 404 page with a feedback message confirming that's for sure my fault! 🥴
- **Signup:** In here I can find a place to be a part of this great place, and be recognized when I try to login.
- **Login:** When I'm already a part of this group, I can manage my account, for example, adding a movie for my next friday night or search for one to occupy my sunday afternoon. 🎞
- **Logout:** When I really need to go, I just have to logout. That is a way for the spy not to see anything!
- **Profile Page**: While I'm logged in, I can see my profile and manage it, see all the movies that are available.
- **Add some Movies to my favorite list:** When I'm logged, I can add some movies that I heard about to my list.
- **Edit my favorite list:** When I'm logged, I can edit my favorite movies list.
- **Add comments in my favorite list:** I can add some comments to allow some other users to see what I like or dislike about it.

# Client / Frontend

## React Router Routes (React App)

| Path                      | Component           | Permissions                | Behavior                                                                                         |
| ------------------------- | ------------------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| `/login`                  | LoginPage           | anon only `<AnonRoute>`    | Login form, navigates to home page after login.                                                  |
| `/signup`                 | SignupPage          | anon only `<AnonRoute>`    | Signup form, navigates to home page after signup.                                                |
| `/`                       | HomePage            | public `<Route>`           | Home page.                                                                                       |
| `/`                       | HomePage            | user only `<PrivateRoute>` | Movies list, search-bar and filters.                                                             |
| `/movie-details/:movieId` | MoviesDetailsPage   | user only `<PrivateRoute>` | Movies details.                                                                                  |
| `/profile`                | ProfilePage         | user only `<PrivateRoute>` | See and edit user profile form.                                                                  |
| `/favorites`              | FavoriteMoviesList  | user only `<PrivateRoute>` | See the list of favorite movies.                                                                 |
| `/favorites/:favoriteId`  | FavoriteDetailsPage | user only `<PrivateRoute>` | See the list of favorites, their description and can add comments and see others users comments. |

## Components

Pages:

- LoginPage
- SignupPage
- HomePage
- ProfilePage
- Movies (Details page)
- Favorites
- Error Page

Components:

- IsAnon
- IsPrivate
- Navbar
- Footer
- Search
- Go to top
- Filter Movies
- Buttons to add and remove favorites
- Comments
- Cards (favorites card, movie card and card to the Home Page)

## Services

- **Auth Service**

  - ```
    authService
    ```

    - `.login(requestBody)`

    - `.signup(requestBody)`

    - `verify()`

    - `.logout()`

- **File Service**

  - ```
    userService
    ```

    - `storedToken`

  - `uploadImage`

# Server / Backend

## Models

**User model**

```
{
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  image: { type: String, default: "https://i.imgur.com/yWHfhiG.png" },
}
```

**Favorite model**

```
 {
    _id: { type: Number },
    userId: [{ type: String }],
},
{ _id: false }
```

**Comment model**

```
{
    body: { type: String },
    username: { type: String },
    userId: { type: String },
    favoriteId: { type: Number },
    createdAt: { type: Date, default: Date.now }
}
```

## API Endpoints (backend routes)

| HTTP Method | URL                                    | Request Body                                                            | Success status | Error Status | Description                                                                                                                     |
| ----------- | -------------------------------------- | ----------------------------------------------------------------------- | -------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| POST        | `/auth/signup`                         | {name, email, password, image}                                          | 201            | error        | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`                          | {email, password}                                                       | 200            | error        | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session              |
| GET         | `/auth/verify`                         |                                                                         | 200            | error        | Verify if it's authenticated.                                                                                                   |
| GET         | `/api/favorite/:favoriteId/comments`   |                                                                         | 200            | 500          | Show the comments of a favorite movie.                                                                                          |
| POST        | `/api/favorite/:favoriteId/comments`   | { body, name, userId, favoriteId }                                      | 201            | 500          | Create and save a new comment.                                                                                                  |
| PUT         | `/api/favorite/:favoriteId/:commentId` | commentId, { body }                                                     | 200            | 500          | Edit and update comments.                                                                                                       |
| DELETE      | `/api/favorite/:favoriteId/:commentId` |                                                                         | 200            | 500          | Delete comment.                                                                                                                 |
| GET         | `/api/popularMovies`                   | { title, voteAverage, id, posterPath, releaseDate, popularity, runtime} | 200            | 500          | Get the information from external API                                                                                           |
| GET         | `/api/movie/:movieId`                  | { title, voteAverage, id, posterPath, releaseDate, popularity, runtime} | 200            | 500          | Get the movie details from the API.                                                                                             |
| GET         | `/api/movies/search/:query`            | { title, voteAverage, id, posterPath, releaseDate, popularity, runtime} | 200            | 500          | Get the movie details by query.                                                                                                 |
| POST        | `/api/movie/favorite`                  | foundedFavorite                                                         | 201/400        | 500          | Give a favorite an Id to be able to pass throw many users.                                                                      |
| GET         | `/api/favorite`                        | { title, voteAverage, id, posterPath, releaseDate, popularity, runtime} | 200            | 500          | Get the details from the favorite movie.                                                                                        |
| GET         | `/api/favorite/:favoriteId`            | { title, voteAverage, id, posterPath, releaseDate, popularity, runtime} | 200            | 500          | Show a specific favorite movie and details.                                                                                     |
| DELETE      | `/api/favorite/:favoriteId`            | foundedFavorite                                                         | 201            | 400          | Remove the movie from the favorites list.                                                                                       |
| GET         | `/api/users/current`                   | {currentUser, user}                                                     | 200            | error        | Get current user info.                                                                                                          |
| PUT         | `/api/users/current`                   | currentUser.\_id, {email, name, image}                                  | 200            | error        | Update the current user.                                                                                                        |

## Links

### Git

The url to your repository and to your deployed project

[Client repository Link](https://github.com/screeeen/project-client)

[Server repository Link](https://github.com/screeeen/project-server)

[Deployed App Link](http://heroku.com/)

### Slides

[Slides Link](http://slides.com/) - The url to your _public_ presentation slides

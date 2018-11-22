# Friend Finder
This full stack site will take a user's survey results, compare their answers with those from other (fictional) users, and find the most compatible match.

Check out the **[Heroku site](https://blooming-refuge-40534.herokuapp.com/)** to see it in action.

![Home screen](https://user-images.githubusercontent.com/30272940/48278425-0ee1f100-e413-11e8-9c5c-395341d09086.jpg)

![Survey screen](https://user-images.githubusercontent.com/30272940/48278437-1acdb300-e413-11e8-88d4-998b226e9f43.jpg)

# Index
- [Friend Finder](#friend-finder)
- [Index](#index)
- [Getting Started](#getting-started)
- [Use](#use)
- [Matching](#matching)
- [API](#api)
            - [POST](#post)
- [Issues](#issues)
- [Todo](#todo)
            - [KU Assignment](#ku-assignment)


# Getting Started
```
# Clone
git clone git@github.com:jason-michael/friend-finder.git && cd friend-finder

# Install dependencies
npm i

# Start the server
npm run start

# Optional: restart server on files changed (requires nodemon)
npm run watch
```

The site should be live at [http://localhost:3000](http://localhost:3000).

Nodemon can be installed with `npm i -g nodemon`.

# Use
Users should navigate to the survey page and complete the form.

**All fields are required.**

Once all fields are completed and the user clicks Submit, a `POST` request is sent to the API. The server will compare the user's answers to all the answers from previous users and find the most compatible match.

After a match has been displayed and the modal is closed, the site will redirect back to the home page.

# Matching
To find the most compatible match for a new user, we have to compare their answers to each potential match's answers, find the absolute difference between the two, and get the total difference score. The potential match with the lowest total difference score is the best match.

For example: we have a new user's answers and two potential matches and their answers...
```json
Joe (new user)          - answers: 2 2 3 5 5
Bob (potential match 1) - answers: 1 1 1 4 4
Jim (potential match 2) - answers: 5 5 5 1 1
```

Referencing the data above, we have to find the total difference score for `Joe` and each potential match...
```json
Joe & Bob
Joe (new user)        - answers: 2 2 3 5 5
Bob (potential match) - answers: 1 1 1 4 4
differences           -          1 1 2 1 1 = 6

---

Joe & Jim
Joe (new user)        - answers: 2 2 3 5 5
Jim (potential match) - answers: 5 5 5 1 1
differences           -          3 3 2 4 4 = 16
```

In this case, `Bob` scored lower than `Jim` and is a better match for the new user, `Joe`.

# API
All current friends can be found at the `/api/friends` endpoint. The API currently only supports `GET` and `POST` methods.

#### POST
New users are added to the API as JSON objects.
``` json
{
    "name":"John Doe",
    "photo":"https://placehold.it/200x200",
    "scores":[ 1, 2, 3, 4, 5 ]
}
```

# Issues
- Sometimes when picking a random image, an ID is given to Lorem Picsum that doesn't exist, so no picture is displayed.
- No data persistence.

# Todo
In a production version, these things would be nice to have:
- A view engine for Express, like EJS or Handlebars. This would really clean up the html.
- If a user matched with multiple people, the app should display all matches rather than the first one.
- Data persistence.
- Different themes, like matching movies or music based on a user's interests.



---
#### KU Assignment
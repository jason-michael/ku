# GIPHY Studio

![giphy](/assets/img/giphy.png?raw=true)

### Explore GIPHY using the GIPHY API. 
[Github page](https://jason-michael.github.io/giphy-studio/)

### Getting Started
1. Use the search bar to search topics. New gifs will be added to the Gallery.
2. Topics you search for will be saved as buttons on the sidebar.
3. Click the topic buttons to add more gifs of that topic.

#

### Features

- #### Start / Stop Gifs
    - Click on a gif to start its animation. It will also get a green border to indicate playing.
    - Click again to stop the animation.

- #### Topic filters
    - Topics in the sidebar can be sorted alphabetically by clicking the `↓A-Z` icon.
    - Click the `trash` icon to remove all topics from the sidebar.

- #### Favorites
    - Click the `heart` icon on a gif card to save it as a favorite. It will move to 'Favorites', located on the sidebar.
    - Clicking the `heart` icon on a favorite gif will unfavorite it and move it back to the gallery.

- #### Random / Trending
    - Click 'Random' or 'Trending' on the sidebar to show gifs of those categories.

- #### Mobile Responsive

#

### Known Issues
- **Random/Trending:** New gifs are added on each button click. Need to add a 'load more' button inside each of these sections.

- **Search bar query offset**: Searching for a topic that has already been added will not increase the return offset, so the same set of gifs will be added with each search.

- **Saving Favorites**: Favorites are not actually saved anywhere yet. Will implement localStorage later.

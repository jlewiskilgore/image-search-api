# FCC Backend API Project - Image Search Abstraction Layer

This is an API to retrieve data about an image based on a
give search string.

Requirements:

1. The user can get the image URLs, alt text, and page URLs
for a set of images relating to a given search string.

2. The user can use a URL parameter "?offset=x" to go to 
page "x" for the results.

3. The user can get a list of the most recently submitted search
strings.

-----

## Example:

To search for image data with a query string use:

`https://thawing-atoll-20447.herokuapp.com/imagesearch/[querystring]`


Can also use the option URL parameter "?offset=x" to paginate search results:

`https://thawing-atoll-20447.herokuapp.com/imagesearch/[querystring]?offset=2`

This will return a JSON response array of matching images. Each image array element is a struct containing the 
image's URL(imageURL), image's preview URL(imagePreviewURL), and the image's description tags(imageDescriptionTags).


To view a history of the 10 most recent searches use:

`https://thawing-atoll-20447.herokuapp.com/latest/imagesearch/`

This will return a JSON response of an array of searches containing the original search date(searchDate) 
and the search query string(searchString).

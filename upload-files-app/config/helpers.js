// Helpers for handlebars
// Add more if needed

module.exports = {
    // Reads an array of files then creates links as list items and returns the content to the html file
    readfiles: (arr) => {
        // If there are no files to display
        if (arr.length == 0) {
            return '<h4>No files have been uploaded :(</h4>';
        }
        let ret = '';
        for (var i = 0; i < arr.length; i++) {
            ret += '<li><a href="/uploads/' + arr[i] + '" class="file-link">' + arr[i] + '</a></li>';
        }
        return ret;
    }
}
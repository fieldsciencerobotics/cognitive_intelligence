require(
    [
        '/static/js/main.js',
        '/static/js/view/complete_view.js',
    ],
    function(main, complete) {
        psiturk.completeHIT(); // when finished saving compute bonus, the quit
    }
);

require(
    [
        'jquery',
        'underscore',
        '/static/js/model/collection.js',
        'text',
        'text!complete/complete_debug_template.html'
    ], function($, _, ConfigCollection, text, complete) {
    
        var complete_configCollection = new ConfigCollection(); 
        complete_configCollection.fetch({
            url: '/static/data/complete.json',
            success: function() {                
            },
            complete: function() {   
                var template1 = _.template(complete);
                $('#complete_template').html( template1(complete_configCollection.at(0).attributes) );
            }
        });
        
        return complete_configCollection;
    }
);

require(
    [
        '/static/js/model/collection.js',
        'text',
        'text!header.html',
        '/static/js/controller/task.js',
    ],
    function(ConfigCollection, text, header, exp_task) {
        var header_template = _.template(header);
        $('#header_template').html(header_template);
        
        var exp_configCollection = new ConfigCollection(); 
        exp_configCollection.fetch({
            url: '/static/data/exp.json',
            success: function() {                
            },
            complete: function() {
                
                exp_task(exp_configCollection);
            }
        });
    }
);

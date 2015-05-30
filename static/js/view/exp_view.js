require(
    [
        '/static/js/model/collection.js',
        '/static/js/controller/task.js',
        'text',
        'text!header.html',         
        'text!exp/prt-welcome.html',
        'text!exp/prt-dot.html',
        'text!exp/prt-intro-instruction.html',
        'text!exp/prt-correct.html',
        'text!exp/prt-incorrect.html'
    ],
    function(ConfigCollection, task, text, header, prt_welcome, prt_dot, prt_intro_instruction, prt_correct, prt_incorrect) {
        var header_template = _.template(header);
        $('#header_template').html(header_template);
        
        var exp_configCollection = new ConfigCollection(); 
        exp_configCollection.fetch({
            url: '/static/data/exp.json',
            success: function() {                
            },
            complete: function() {
                exp_task(exp_configCollection, prt_welcome, prt_dot, prt_intro_instruction, prt_correct, prt_incorrect);
            }
        });
    }
);

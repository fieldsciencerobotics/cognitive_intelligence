require(
    [
        '/static/js/model/collection.js',
        '/static/js/controller/prt_task.js',
        '/static/js/controller/memory_task.js',
        '/static/js/controller/metacognition_task.js',
        '/static/js/controller/testing_task.js',
        '/static/js/controller/testing_priming_task.js',
        'text',
        'text!header.html',         
        'text!exp/prt_welcome.html',
        'text!exp/prt_intro_instruction.html', 
        'text!exp/memory_instruction1.html',
        'text!exp/memory_instruction2.html',
        'text!exp/memory_bird.html',
        'text!exp/memory_images.html',
        'text!exp/metacognition_instruction.html',
        'text!exp/response_time.html',
        'text!exp/star.html',
        'text!exp/star_cloud.html',
        'text!exp/cloud.html',
        'text!exp/dot.html',
        'text!exp/correct.html',
        'text!exp/incorrect.html',
        'text!exp/maybe.html'
    ],
    function(ConfigCollection, prt_task, memory_task, metacognition_task, testing_task, testing_priming_task,
        text, header, 
        prt_welcome, prt_intro_instruction, 
        memory_instruction1, memory_instruction2, memory_bird, memory_images,
        metacognition_instruction,
        response_time, star, star_cloud, cloud, dot, correct, incorrect, maybe) {

        var header_template = _.template(header);
        $('#header_template').html(header_template);
        
        var exp_configCollection = new ConfigCollection(); 
        exp_configCollection.fetch({
            url: '/static/data/exp.json',
            success: function() {                
            },
            complete: function() {
                // prt_task_exp(exp_configCollection, 
                //     prt_welcome, prt_intro_instruction, 
                //     response_time, dot, correct, incorrect);
                // memory_task_exp(exp_configCollection, 
                //     memory_instruction1, memory_instruction2, memory_bird, memory_images, 
                //     response_time, star, dot, correct, incorrect);
                // metacognition_task_exp(exp_configCollection, 
                //     memory_bird, memory_images, 
                //     metacognition_instruction,
                //     response_time, star_cloud, dot, correct, incorrect, maybe);
                // testing_task_exp(exp_configCollection, 
                //     memory_bird, memory_images, 
                //     response_time, star, star_cloud, cloud, dot, correct, incorrect, maybe);
                testing_priming_task_exp(exp_configCollection, 
                    memory_bird, memory_images, 
                    response_time, star, star_cloud, cloud, dot, correct, incorrect, maybe);
            }
        });
    }
);

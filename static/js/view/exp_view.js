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
            success: function() {},
            complete: function() {

                var prt_func = function(exp_points, prt_retry_times) {

                    //if the user fails the test more than 5 times call exp_fail
                    if (prt_retry_times > exp_configCollection.at(0).attributes.prt_retry_times) {
                        exp_fail();
                        return;
                    }

                    //call the prt exp
                    var prt = prt_task_exp(exp_configCollection,
                        prt_welcome, prt_intro_instruction,
                        response_time, dot, correct, incorrect);

                    //count the number of times the exp runs
                    prt_retry_times++;

                    //if the user succeeds then award them '1' point 
                    if (prt) {
                        exp_points++;
                    }

                    //if user reaches '1' point i.e prt_min_points call mem exp
                    if (exp_points == exp_configCollection.at(0).attributes.prt_min_points) {
                        total_points = exp_points;
                        //call mem exp
                        mem_func(0, 0);
                    }
                    //else restart the test.
                    else {
                        prt_func(exp_points, prt_retry_times);
                    }
                };

                var mem_func = function(exp_points, mem_retry_times) {
                    //if the user fails the test more than 5 times call exp_fail
                    if (mem_retry_times > exp_configCollection.at(0).attributes.mem_retry_times) {
                        exp_fail();
                        return;
                    }

                    //call the mem exp
                    var mem = memory_task_exp(exp_configCollection,
                        memory_instruction1, memory_instruction2, memory_bird, memory_images,
                        response_time, star, dot, correct, incorrect);

                    //count the number of times the exp runs
                    mem_retry_times++;

                    //if the user succeeds then award them '1' point 
                    if (mem) {
                        exp_points++;
                    }

                    //if user reaches '1' point i.e mem_min_points call meta exp
                    if (exp_points == exp_configCollection.at(0).attributes.mem_min_points) {
                        total_points += exp_points;
                        //call meta exp
                        meta_func(0, 0);
                    }
                    //else restart the test.
                    else {
                        mem_func(exp_points, mem_retry_times);
                    }
                };

                var meta_func = function(exp_points, meta_retry_times) {

                    //if the user reaches 5 points in 8 trials then call test exp
                    //else call exp_fail

                    //if the number of trails exceed 8 trials then call exp_fail
                    if (meta_retry_times > exp_configCollection.at(0).attributes.meta_retry_times) {
                        exp_fail();
                        return;
                    }

                    //count the number of times the exp runs
                    meta_retry_times++;

                    var meta = metacognition_task_exp(exp_configCollection,
                        memory_bird, memory_images,
                        metacognition_instruction,
                        response_time, star_cloud, dot, correct, incorrect, maybe);

                    if (meta == 1) {
                        //the user is confident and correct
                        //award them '1' point
                        exp_points++;
                    } else if (meta == 2) {
                        //the user is not confident
                        //50% of the time award them '1' point and restart the exp
                        var prob = Math.floor((Math.random() * 2) + 1);
                        if (prob == 2) {
                            exp_points++;
                        }
                        //50% of the time restart the exp
                    } else {
                        //the user is confident and incorrect
                        //restart the exp
                    }

                    //if the user reaches five points then call test exp
                    if (exp_points == exp_configCollection.at(0).attributes.meta_min_points) {
                        total_points += exp_points;
                        //call test exp
                        test_func(0, 0);
                        // test_priming_func(0, 0);
                    }
                    //else restart the test.
                    else {
                        meta_func(exp_points, prt_retry_times);
                    }
                };

                var test_func = function(exp_points, test_retry_times) {

                    //total number of trails to run
                    //after all the trails compute the final award for the participant
                    //also compute bonus for the person with the highest score
                    if (test_retry_times > exp_configCollection.at(0).attributes.test_retry_times) {
                        compute_award();
                        return;
                    }

                    //count the number of times the exp runs
                    test_retry_times++;

                    var test = testing_task_exp(exp_configCollection,
                                memory_bird, memory_images,
                                response_time, star, star_cloud, cloud, dot, correct, incorrect, maybe);
                    
                    if (test == 1) {
                        //the user is confident and correct
                        //award them '1' point
                        exp_points++;
                        total_points++;
                    } else if (test == 2) {
                        //the user is not confident
                        //50% of the time award them '1' point and restart the exp
                        var prob = Math.floor((Math.random() * 2) + 1);
                        if (prob == 2) {
                            exp_points++;
                            total_points++;
                        }
                        //50% of the time restart the exp
                    } else {
                        //the user is confident and incorrect
                        //restart the exp
                    }

                    test_func(exp_points, test_retry_times);
                };

                var test_priming_func = function(exp_points, test_priming_retry_times) {

                    //total number of trails to run
                    //after all the trails compute the final award for the participant
                    //also compute bonus for the person with the highest score
                    if (test_priming_retry_times > exp_configCollection.at(0).attributes.test_priming_retry_times) {
                        compute_award();
                        return;
                    }

                    //count the number of times the exp runs
                    test_priming_retry_times++;

                    var test = testing_priming_task_exp(exp_configCollection,
                                memory_bird, memory_images,
                                response_time, star, star_cloud, cloud, dot, correct, incorrect, maybe);
                    
                    if (test == 1) {
                        //the user is confident and correct
                        //award them '1' point
                        exp_points++;
                        total_points++;
                    } else if (test == 2) {
                        //the user is not confident
                        //50% of the time award them '1' point and restart the exp
                        var prob = Math.floor((Math.random() * 2) + 1);
                        if (prob == 2) {
                            exp_points++;
                            total_points++;
                        }
                        //50% of the time restart the exp
                    } else {
                        //the user is confident and incorrect
                        //restart the exp
                    }

                    test_priming_func(exp_points, test_priming_retry_times);
                };

                //- Thank you for your participation, however you have not met the criteria for this study
                //- Give a code that sends them to a leaving screen 
                //- compute their final award 
                var exp_fail = function() {
                    
                };

                //compute the final award for the participant
                //also compute bonus for the person with the highest score
                var compute_award = function() {
                    //total points 
                    //compute bonus
                };

                //start exp process
                var total_points = 0;
                // prt_func(0, 0);

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
                // testing_priming_task_exp(exp_configCollection,
                //     memory_bird, memory_images,
                //     response_time, star, star_cloud, cloud, dot, correct, incorrect, maybe);
            }
        });
    }
);

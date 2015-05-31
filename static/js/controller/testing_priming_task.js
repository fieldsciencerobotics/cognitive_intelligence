/*
 * 
 * Testing Priming Task - Experiment
 * 
 */

var testing_priming_task_exp = function(exp_configCollection, 
    memory_bird, memory_images, 
    response_time, star, star_cloud, cloud, dot, correct, incorrect, maybe) {

    var memory_bird_range = exp_configCollection.at(0).attributes.memory_bird_range;

    var memory_bird_number = Math.floor((Math.random() * memory_bird_range) + 1);
    var memory_image_numbers = [];

    memory_image_numbers.push(memory_bird_number);
    while(memory_image_numbers.length < 3) {
        var val = Math.floor((Math.random() * memory_bird_range) + 1);
        if ( _.indexOf(memory_image_numbers, val) == -1) {
            memory_image_numbers.push(val);
        }
    }
    memory_image_numbers = _.shuffle(memory_image_numbers);

    var memory_bird_template = _.template(memory_bird);
    var memory_bird1 = memory_bird_template({'memory_bird_number': Math.floor((Math.random() * memory_bird_range) + 1)});
    var memory_bird2 = memory_bird_template({'memory_bird_number': memory_bird_number});

    var memory_images_template = _.template(memory_images);
    memory_images = memory_images_template({'memory_image_number_1': memory_image_numbers[0], 'memory_image_number_2': memory_image_numbers[1], 'memory_image_number_3': memory_image_numbers[2]});

    var dot_block = {
        type: "text",
        text: dot,
        timing_post_trial: exp_configCollection.at(0).attributes.memory_timing_post_trial
    };

    var bird_block1 = {
        type: "single-stim",
        stimuli: [memory_bird1],
        is_html: true,
        timing_response: exp_configCollection.at(0).attributes.memory_image_timing_response,
        timing_post_trial: exp_configCollection.at(0).attributes.memory_timing_post_trial,
        // response_ends_trial: false
    };

    var bird_block2 = {
        type: "single-stim",
        stimuli: [memory_bird2],
        is_html: true,
        timing_response: exp_configCollection.at(0).attributes.memory_image_timing_response,
        timing_post_trial: exp_configCollection.at(0).attributes.memory_timing_post_trial,
        // response_ends_trial: false
    };

    var slider_function_block = {
        type: 'slider',
        timing_trail: exp_configCollection.at(0).attributes.memory_slider_timing_trials,
        timing_response: exp_configCollection.at(0).attributes.memory_slider_timing_response,
        timing_post_trial: exp_configCollection.at(0).attributes.memory_timing_post_trial
    };

    var images_block = {
        type: "single-stim",
        stimuli: [memory_images],
        is_html: true,
        timing_response: exp_configCollection.at(0).attributes.memory_image_timing_response+10000,
        timing_post_trial: exp_configCollection.at(0).attributes.memory_timing_post_trial,
        choices: [49, 50, 51]
        // response_ends_trial: false
    };

    var star_n_cloud_block = {};
    var val = Math.floor((Math.random() * 4) + 1);
    switch(val) {
        case 1:
            star_n_cloud_block = {
                type: "text",
                text: star
            }
            break;
        case 2:
            star_n_cloud_block = {
                type: "text",
                text: cloud
            }
            break;
        case 3:
        case 4:
        default:
            star_n_cloud_block = {
                type: "single-stim",
                stimuli: [star_cloud],
                is_html: true,
                choices: [49, 50]
            };
            break;
    }

    var response_block = {
        type: "text",
        text: function() {
            if (star_n_cloud_block.type == "text") {
                if(star_n_cloud_block.text == star) {
                    var trials = jsPsych.data.getTrialsOfType('single-stim');
                    var re = /(\d.jpg)/gi;
                    var num = (trials[1].stimulus).match(re);
                    var image_num = parseInt(num[0].toLowerCase().replace('.jpg', ''), 10);

                    key_press = parseInt(String.fromCharCode(trials[2].key_press), 10) - 1;
                    num = (trials[2].stimulus).match(re);
                    var choice = parseInt(num[key_press].toLowerCase().replace('.jpg', ''), 10);
                    
                    if (image_num == choice) {
                        return correct;
                    } else {
                        return incorrect;
                    }
                } else {
                    return maybe;
                }
            } else {
                var trials = jsPsych.data.getTrialsOfType('single-stim');
                var key_press = parseInt(String.fromCharCode(trials[2].key_press), 10);

                if(key_press == 1) {
                    var re = /(\d.jpg)/gi;
                    var num = (trials[1].stimulus).match(re);
                    var image_num = parseInt(num[0].toLowerCase().replace('.jpg', ''), 10);

                    key_press = parseInt(String.fromCharCode(trials[2].key_press), 10) - 1;
                    num = (trials[2].stimulus).match(re);
                    var choice = parseInt(num[key_press].toLowerCase().replace('.jpg', ''), 10);
                    

                    if (image_num == choice) {
                        return correct;
                    } else {
                        return incorrect;
                    }
                } else {
                    return maybe;
                }
            }
        }
    };

    var debrief_block = {
        type: "text",
        text: function() {
            var template = _.template(response_time);
            return template({'response_time': getAverageResponseTime()});
        }
    }

    var getAverageResponseTime = function() {
        var trials = jsPsych.data.getTrialsOfType('slider');

        var sum_rt = 0;
        var valid_trial_count = 0;
        for (var i = 0; i < trials.length; i++) {
            if (trials[i].r_type == 'handle_clicked' && trials[i].rt > -1) {
                sum_rt += trials[i].rt;
                valid_trial_count++;
            }
        }
        return Math.floor(sum_rt / valid_trial_count);
    }

    var experiment_blocks = [];
    experiment_blocks.push(dot_block);
    experiment_blocks.push(bird_block1);
    experiment_blocks.push(dot_block); 
    experiment_blocks.push(bird_block2);   
    experiment_blocks.push(slider_function_block);
    experiment_blocks.push(images_block);
    experiment_blocks.push(star_n_cloud_block);
    experiment_blocks.push(response_block);
    experiment_blocks.push(debrief_block);

    jsPsych.init({
        display_element: $('#exp_target'),
        experiment_structure: experiment_blocks,
        on_finish: function() {
            psiturk.saveData({
                success: function() {
                    console.log(jsPsych.data.getData());
                    if (mode == 'debug') {
                        // setTimeout(complete(), 1000);
                    }
                    // psiturk.completeHIT(); 
                },
                error: function() {
                    
                }
            });
        },
        on_data_update: function(data) {
            psiturk.recordTrialData(data);
        }
    });

}
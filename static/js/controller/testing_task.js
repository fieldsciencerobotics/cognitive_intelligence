/*
 * 
 * Testing Task - Experiment
 * 
 */

var testing_task_exp = function(exp_configCollection,
    memory_bird, memory_images,
    response_time, star, star_cloud, cloud, dot, correct, incorrect, maybe) {


    //get a random image from the list of bird pics in repository
    //range of bird images in repo
    var memory_bird_range = exp_configCollection.at(0).attributes.memory_bird_range;
    //random pic to be displayed
    var memory_bird_number = Math.floor((Math.random() * memory_bird_range) + 1);
    var memory_image_numbers = [];

    //random list of bird images chosen to be displayed for the trial
    memory_image_numbers.push(memory_bird_number);
    while (memory_image_numbers.length < 3) {
        var val = Math.floor((Math.random() * memory_bird_range) + 1);
        if (_.indexOf(memory_image_numbers, val) == -1) {
            memory_image_numbers.push(val);
        }
    }
    memory_image_numbers = _.shuffle(memory_image_numbers);

    //compile the html templates
    var memory_bird_template = _.template(memory_bird);
    memory_bird = memory_bird_template({
        'memory_bird_number': memory_bird_number
    });

    var memory_images_template = _.template(memory_images);
    memory_images = memory_images_template({
        'memory_image_number_1': memory_image_numbers[0],
        'memory_image_number_2': memory_image_numbers[1],
        'memory_image_number_3': memory_image_numbers[2]
    });


    //define the blocks of the experiment
    var dot_block = {
        type: "text",
        text: dot,
        timing_post_trial: exp_configCollection.at(0).attributes.memory_timing_post_trial
    };

    var bird_block = {
        type: "single-stim",
        stimuli: [memory_bird],
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
        // timing_response: exp_configCollection.at(0).attributes.memory_image_timing_response,
        timing_post_trial: exp_configCollection.at(0).attributes.memory_timing_post_trial,
        choices: [49, 50, 51]
            // response_ends_trial: false
    };

    //picl between star, cloud and star_cloud blocks in the below mentioned probabilities
    //star - 25%, cloud - 25%, star_cloud - 50%
    var star_n_cloud_block = {};
    var val = Math.floor((Math.random() * 4) + 1);
    switch (val) {
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
                if (star_n_cloud_block.text == star) {
                    //if the user chose star then check 
                    //if user chose the right image then display the correct template
                    //else display the incorrect template
                    if (getResponse()) {
                        return correct;
                    } else {
                        return incorrect;
                    }
                } else {
                    // if the user chose cloud
                    return maybe;
                }
            } else {
                if (getConfidence()) {
                    //if user chose the right image then display the correct template
                    //else display the incorrect template
                    if (getResponse()) {
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
            return template({
                'response_time': getAverageResponseTime()
            });
        }
    }

    //function to check if the user was sure
    var getConfidence = function() {
        var trials = jsPsych.data.getTrialsOfType('single-stim');
        var key_press = parseInt(String.fromCharCode(trials[2].key_press), 10);

        if (key_press == 1) {
            return true;
        } else {
            return false;
        }
    }

    // function to get the response of the user
    //if the user chose the right image then return true
    //else return false
    var getResponse = function() {

        var trials = jsPsych.data.getTrialsOfType('single-stim');

        //get the image number of the bird displayed
        var re = /(\d.jpg)/gi
        var num = (trials[0].stimulus).match(re);
        var image_num = parseInt(num[0].toLowerCase().replace('.jpg', ''), 10);

        //get the image number chosen by the user
        var choice = -1;
        if (trials[1].key_press > -1) { //if user responsed
            var key_press = parseInt(String.fromCharCode(trials[1].key_press), 10) - 1;
            num = (trials[1].stimulus).match(re);
            choice = parseInt(num[key_press].toLowerCase().replace('.jpg', ''), 10);
        }

        if (image_num == choice) {
            return true;
        } else {
            return false;
        }
    }

    //function to compute the average response time 
    //for trials where handle was clicked
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
    experiment_blocks.push(bird_block);
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
                    // if (mode == 'debug') {
                    //     setTimeout(complete(), 1000);
                    // }
                    // psiturk.completeHIT(); 

                    if (star_n_cloud_block.type == "text") {
                        if (star_n_cloud_block.text == star) {
                            //if the user chose star then check 
                            //if user chose the right image then display the correct template
                            //else display the incorrect template
                            if (getResponse()) {
                                return 1;
                            } else {
                                return -1;
                            }
                        } else {
                            // if the user chose cloud
                            return 2;
                        }
                    } else {
                        if (getConfidence()) {
                            //if user chose the right image then display the correct template
                            //else display the incorrect template
                            if (getResponse()) {
                                return 1;
                            } else {
                                return -1;
                            }
                        } else {
                            return 2;
                        }
                    }

                    if (getConfidence()) {
                        if (getResponse()) {
                            return 1;
                        } else {
                            return -1;
                        }
                    } else {
                        return 2;
                    }
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

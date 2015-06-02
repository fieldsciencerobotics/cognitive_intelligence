/*
 * 
 * Testing Priming Task - Experiment
 * 
 */

var testing_priming_task_exp = function(appModel) {

    //get a random image from the list of bird pics in repository
    //range of bird images in repo
    var memory_bird_range = appModel.attributes.exp_configCollection.at(0).attributes.memory_bird_range;
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
    var memory_bird_template = _.template(appModel.attributes.memory_bird);
    var memory_bird = memory_bird_template({
        'memory_bird_number': memory_bird_number
    });

    var memory_images_template = _.template(appModel.attributes.memory_images);
    var memory_images = memory_images_template({
        'memory_image_number_1': memory_image_numbers[0],
        'memory_image_number_2': memory_image_numbers[1],
        'memory_image_number_3': memory_image_numbers[2]
    });

    
    //define the blocks of the experiment
    var dot_block = {
        type: "text",
        text: appModel.attributes.dot,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.test_priming_timing_post_trial
    };

    var bird_block1 = {
        type: "single-stim",
        stimuli: [memory_bird1],
        is_html: true,
        timing_response: appModel.attributes.exp_configCollection.at(0).attributes.test_priming_image_timing_response,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.test_priming_timing_post_trial,
        // response_ends_trial: false
    };

    var bird_block2 = {
        type: "single-stim",
        stimuli: [memory_bird2],
        is_html: true,
        timing_response: appModel.attributes.exp_configCollection.at(0).attributes.test_priming_image_timing_response,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.test_priming_timing_post_trial,
        // response_ends_trial: false
    };

    var slider_function_block = {
        type: 'slider',
        timing_trial: appModel.attributes.exp_configCollection.at(0).attributes.test_priming_slider_timing_trials,
        timing_response: appModel.attributes.exp_configCollection.at(0).attributes.test_priming_slider_timing_response,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.test_priming_timing_post_trial
    };

    var images_block = {
        type: "single-stim",
        stimuli: [memory_images],
        is_html: true,
        // timing_response: appModel.attributes.exp_configCollection.at(0).attributes.test_priming_image_timing_response+10000,
        timing_post_trial: appModel.attributes.exp_configCollection.at(0).attributes.test_priming_timing_post_trial,
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
                text: appModel.attributes.star
            }
            break;
        case 2:
            star_n_cloud_block = {
                type: "text",
                text: appModel.attributes.cloud
            }
            break;
        case 3:
        case 4:
            star_n_cloud_block = {
                type: "single-stim",
                stimuli: [appModel.attributes.star_cloud],
                is_html: true,
                choices: [49, 50]
            };
            break;
        default:
            break;
    }

    var response_block = {
        type: "text",
        text: function() {
            if (star_n_cloud_block.type == "text") {
                if (star_n_cloud_block.text[0].match(/star/gi) != null) {
                    //if the user chose star then check 
                    //if user chose the right image then display the correct template
                    //else display the incorrect template
                    if (getResponse('star')) {
                        appModel.attributes.test_priming_exp_points++;
                        appModel.attributes.total_points++;
                        return correct;
                    } else {
                        return incorrect;
                    }
                } else {
                    // if the user chose cloud
                    var prob = Math.floor((Math.random() * 2) + 1);
                    if (prob == 2) {
                        appModel.attributes.test_priming_exp_points++;
                        appModel.attributes.total_points++;
                    }
                    return maybe;
                }
            } else {
                if(getConfidence()) {
                    //if user chose the right image then display the correct template
                    //else display the incorrect template
                    if (getResponse('star_cloud')) {
                        appModel.attributes.test_priming_exp_points++;
                        appModel.attributes.total_points++;
                        return correct;
                    } else {
                        return incorrect;
                    }
                } else {
                    var prob = Math.floor((Math.random() * 2) + 1);
                    if (prob == 2) {
                        appModel.attributes.test_priming_exp_points++;
                        appModel.attributes.total_points++;
                    }
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
                'response_time': getAverageResponseTime(),
                'total_score': appModel.attributes.total_points
            });
        }
    }

    //function to check if the user was sure
    var getConfidence = function() {
        var trials = jsPsych.data.getTrialsOfType('single-stim');
        var key_press = String.fromCharCode(trials[trials.length-1].key_press);

        if (key_press == 1) {
            return true;
        } else {
            return false;
        }
    }

    //function to get the response of the user
    //if the user chose the right image then return true
    //else return false
    var getResponse = function(flag) {
        var trials = jsPsych.data.getTrialsOfType('single-stim');

        var current_trial = 0;
        if (flag == 'star_cloud') {
            //consider last three trails
            current_trial = trials.length - 1;
        } else {
            //consider last two trails
            current_trial = trials.length;
        }

        //get the image number of the bird displayed
        var re = /(\d.jpg)/gi
        var num = (trials[current_trial - 2].stimulus).match(re);
        var image_num = parseInt(num[0].toLowerCase().replace('.jpg', ''), 10);

        //get the image number chosen by the user
        var choice = -1;
        if (trials[current_trial - 1].key_press > -1) { //if user responsed
            var key_press = parseInt(String.fromCharCode(trials[current_trial - 1].key_press), 10) - 1;
            //-1 because we have to chose the corresponding user choice image in the array
            num = (trials[current_trial - 1].stimulus).match(re);
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

        var current_trial = 0;
        if (trials.length > 0) {
            current_trial = trials.length - appModel.attributes.exp_configCollection.at(0).attributes.test_priming_slider_timing_trials.length;
        }

        for (var i = current_trial; i < trials.length; i++) {
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
                    // var res = -1;
                    // if (star_n_cloud_block.type == "text") {
                    //     if (star_n_cloud_block.text[0].match(/star/gi) != null) {
                    //         //if the user chose star then check 
                    //         //if user chose the right image then display the correct template
                    //         //else display the incorrect template
                    //         if (getResponse('star')) {
                    //             res = 1;
                    //         } else {
                    //             res = -1;
                    //         }
                    //     } else {
                    //         // if the user chose cloud
                    //         res = 2;
                    //     }
                    // } else {
                    //     if (getConfidence()) {
                    //         //if user chose the right image then display the correct template
                    //         //else display the incorrect template
                    //         if (getResponse('star_cloud')) {
                    //             res = 1;
                    //         } else {
                    //             res = -1;
                    //         }
                    //     } else {
                    //         res = 2;
                    //     }
                    // }

                    //count the number of times the exp runs
                    appModel.attributes.test_priming_retry_times++;

                    // if (res == 1) {
                    //     //the user is confident and correct
                    //     //award them '1' point
                    //     appModel.attributes.test_priming_exp_points++;
                    //     appModel.attributes.total_points++;
                    // } else if (res == 2) {
                    //     //the user is not confident
                    //     //50% of the time award them '1' point and restart the exp
                    //     var prob = Math.floor((Math.random() * 2) + 1);
                    //     if (prob == 2) {
                    //         appModel.attributes.test_priming_exp_points++;
                    //         appModel.attributes.total_points++;
                    //     }
                    //     //50% of the time restart the exp
                    // } else {
                    //     //the user is confident and incorrect
                    //     //restart the exp
                    // }

                    //total number of trails to run
                    //after all the trails compute the final award for the participant
                    //also compute bonus for the person with the highest score
                    if (appModel.attributes.test_priming_retry_times >= appModel.attributes.exp_configCollection.at(0).attributes.test_priming_retry_times) {
                        compute_award(appModel);
                        return;
                    }

                    testing_priming_task_exp(appModel);
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
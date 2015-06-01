/*
 * 
 * PRT Task - Experiment
 * 
 */

var prt_task_exp = function(exp_configCollection, 
    prt_welcome, prt_intro_instruction, 
    response_time, dot, correct, incorrect) {

    //define blocks of the experiment
    var welcome_block = {
        type: "text",
        text: prt_welcome
    };

    var instructions_block = {
        type: "text",
        text: prt_intro_instruction,
        timing_post_trial: exp_configCollection.at(0).attributes.prt_timing_post_trial
    };

    var slider_function_block1 = {
        type: 'slider',
        timing_trail: [200],
        timing_response: exp_configCollection.at(0).attributes.prt_slider_timing_response
    };

    var dot_block = {
        type: "text",
        text: dot,
        timing_post_trial: exp_configCollection.at(0).attributes.prt_timing_post_trial
    };

    var slider_function_block2 = {
        type: 'slider',
        timing_trail: exp_configCollection.at(0).attributes.prt_slider_timing_trials,
        timing_response: exp_configCollection.at(0).attributes.prt_slider_timing_response,
        timing_post_trial: exp_configCollection.at(0).attributes.prt_timing_post_trial
    };

    var correct_block = {
        type: "text",
        text: correct
    };

    var debrief_block = {
        type: "text",
        text: function() {
            var template = _.template(response_time);
            return template({'response_time': getAverageResponseTime()});
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

    //blocks in the experiment
    var experiment_blocks = [];
    experiment_blocks.push(welcome_block);
    experiment_blocks.push(instructions_block);
    experiment_blocks.push(slider_function_block1);
    experiment_blocks.push(dot_block);
    experiment_blocks.push(slider_function_block2);
    experiment_blocks.push(correct_block);
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

                    //return true if user was successful in all the trials
                    //else return false
                    var res = false;
                    var valid_trial_count = 0;
                    var trials = jsPsych.data.getTrialsOfType('slider');
                    for (var i = 0; i < trials.length; i++) {
                        if (trials[i].r_type == 'handle_clicked') {
                            valid_trial_count++;
                        }
                    }

                    if (trials.length == valid_trial_count) {
                        res = true;
                    }

                    return res;
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

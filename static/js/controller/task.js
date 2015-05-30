var exp_task = function(exp_configCollection, prt_welcome, prt_dot, prt_intro_instruction, prt_correct, prt_incorrect) {

    var welcome_block = {
        type: "text",
        text: prt_welcome
    };

    var instructions_block = {
        type: "text",
        text: prt_intro_instruction
    };

    var slider_function_block1 = {
        type: 'slider',
        timing_trail: [200],
        timing_response: 6000
    };

    var dot_block = {
        type: "text",
        text: prt_dot
    };

    var slider_function_block2 = {
        type: 'slider',
        timing_trail: [160, 200],
        timing_response: 6000
    };

    var correct_block = {
        type: "text",
        text: prt_correct
    };

    var debrief_block = {
        type: "text",
        text: function() {
            return "<p>Your average response time was <strong>" +
                getAverageResponseTime() + "ms</strong>.</p>" +
                "<p>Press any key to complete the experiment. Thank you!</p>";
        }
    }

    var experiment_blocks = [];
    experiment_blocks.push(welcome_block);
    experiment_blocks.push(instructions_block);
    experiment_blocks.push(slider_function_block1);
    experiment_blocks.push(dot_block);
    experiment_blocks.push(slider_function_block2);
    experiment_blocks.push(correct_block);
    experiment_blocks.push(debrief_block);

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

    jsPsych.init({
        display_element: $('#exp_target'),
        experiment_structure: experiment_blocks,
        on_finish: function() {
            psiturk.saveData({
                success: function() {
                    if (mode == 'debug') {
                        setTimeout(complete(), 1000);
                    }
                    psiturk.completeHIT(); 
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

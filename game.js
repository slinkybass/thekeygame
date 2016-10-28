if (typeof jQuery === "undefined") {
    throw new Error("Game requires jQuery");
}

$.Game = {};

$.Game.options = {
    file_levels: 'levels.json',
    file_css: 'game.css',
    timeMove: 500,
    actual_level: 0,
    actual_level_start: {x: 0, y: 0},
    var : 0
};
$.Game.resources = {
    loaded: [],
    css: [
        $.Game.options.file_css,
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css"
    ],
    js: [
        "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"
    ]
};
$.Game.containers = {
    frame: '<div />',
    controls: '<div />',
    level: '<div />',
    var : '<div />',
    start_button: '<div />',
    console: '<div />',
    row: '<div />',
    col: '<div />',
    col_options: '<div />',
    col_actions: '<div />',
    col_elements: '<div />',
    option: '<div />',
    action: '<div />',
    element: '<div />'
};
$.Game.cssClasses = {
    frame: 'frame_container',
    controls: 'controls_container',
    level: 'level_container',
    var : 'var',
    start_button: 'start_button',
    console: 'console',
    row: 'row_container',
    col: 'col_container',
    col_options: 'col_options',
    col_actions: 'col_actions',
    col_elements: 'col_elements',
    option: 'option',
    action: 'action',
    element: 'element'
};
$.Game.data = {
    start_button: 'start-level',
    row_id: 'row-id',
    col_id: 'col-id',
    col_start: 'start',
    col_end: 'end',
    option: 'option',
    option_active: 'active',
    option_left: 'left',
    option_right: 'right',
    option_up: 'up',
    option_down: 'down',
    action_sum: 'action-sum',
    action_subs: 'action-subs',
    action_check: 'action-check',
    element: 'element',
    element_start: 'start',
    element_end: 'end',
    tooltip: 'toggle'
};
$.Game.tooltip = {
    text_left: 'Mover Izquierda',
    text_right: 'Mover Derecha',
    text_up: 'Mover Arriba',
    text_down: 'Mover Abajo',
    text_key: 'Llave',
    text_chest: 'Cofre'
};
$.Game.levels = [];

/* ------------------
 * - Implementation -
 * ------------------
 */
$(function () {
    "use strict";

    //Extend options if external options exist
    if (typeof GameOptions !== "undefined") {
        $.extend(true, $.Game.options, GameOptions);
    }

    //Init the Game
    _initGame();

    //Load Resources
    $.Game.init.load_resources();

    $.when.apply(null, $.Game.resources.loaded).done(function () {
        //Draw Frame
        $.Game.init.draw_frame();
        //Draw Grid
        $.Game.init.draw_grid();
        //Draw Level
        $.Game.init.draw_level();

        //Start Level
        $('[data-' + $.Game.data.start_button + '="true"]').click(function () {
            $.Game.init.console("-- START --");
            $.Game.init.start();
        });

        $('[data-' + $.Game.data.tooltip + '="tooltip"]').tooltip();

    });
});

/* ----------------------------------
 * - Initialize the Game Object -
 * ----------------------------------
 * All Game functions are implemented below.
 */
function _initGame() {
    $.Game.init = {
        load_resources: function () {
            $.each($.Game.resources.css, function (k, resource) {
                $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', resource));
            });
            $.each($.Game.resources.js, function (k, resource) {
                var request = $.getScript(resource);
                $.Game.resources.loaded.push(request);
            });
            $.getJSON($.Game.options.file_levels, function (json) {
                $.Game.levels = json.levels;
            });
        },
        draw_frame: function () {
            var frame_container = $($.Game.containers.frame);
            var controls_container = $($.Game.containers.controls);
            var level_container = $($.Game.containers.level);
            var var_container = $($.Game.containers.var);
            var start_button_container = $($.Game.containers.start_button);
            var console = $($.Game.containers.console);

            frame_container.addClass($.Game.cssClasses.frame);
            controls_container.addClass($.Game.cssClasses.controls);
            level_container.addClass($.Game.cssClasses.level);
            var_container.addClass($.Game.cssClasses.var);
            start_button_container.addClass($.Game.cssClasses.start_button);
            console.addClass($.Game.cssClasses.console);

            start_button_container.attr('data-' + $.Game.data.start_button, true);

            $(controls_container).append(var_container);
            $(controls_container).append(start_button_container);
            $(controls_container).append(console);
            $(frame_container).append(controls_container);
            $(frame_container).append(level_container);
            $('body').append(frame_container);
        },
        draw_grid: function () {
            if ($.Game.levels[$.Game.options.actual_level]) {
                $('.' + $.Game.cssClasses.level).empty();
                for (var row = 0; row < $.Game.levels[$.Game.options.actual_level].size_y; row++) {
                    var row_container = $($.Game.containers.row);
                    for (var col = 0; col < $.Game.levels[$.Game.options.actual_level].size_x; col++) {
                        var col_container = $($.Game.containers.col);

                        var col_options = $($.Game.containers.col_options);
                        col_options.addClass($.Game.cssClasses.col_options);
                        col_options.appendTo(col_container);

                        var col_action = $($.Game.containers.col_actions);
                        col_action.addClass($.Game.cssClasses.col_actions);
                        col_action.appendTo(col_container);

                        var col_element = $($.Game.containers.col_elements);
                        col_element.addClass($.Game.cssClasses.col_elements);
                        col_element.appendTo(col_container);

                        col_container.addClass($.Game.cssClasses.col);
                        col_container.attr('data-' + $.Game.data.col_id, col);
                        col_container.outerWidth(100 / $.Game.levels[$.Game.options.actual_level].size_x + '%');
                        col_container.outerHeight(100 / $.Game.levels[$.Game.options.actual_level].size_y + '%');
                        col_container.appendTo(row_container);
                    }
                    row_container.addClass($.Game.cssClasses.row);
                    row_container.attr('data-' + $.Game.data.row_id, row);
                    row_container.appendTo('.' + $.Game.cssClasses.level);
                }
            } else {
                $.Game.init.console("Level " + $.Game.options.actual_level + " not found");
            }
        },
        draw_level: function () {
            if ($.Game.levels[$.Game.options.actual_level]) {
                $.Game.init.setVar($.Game.levels[$.Game.options.actual_level].var);

                $.each($.Game.levels[$.Game.options.actual_level].cols, function (key, col_data) {
                    var col = $('.' + $.Game.cssClasses.col).filter(function () {
                        return parseFloat($(this).attr('data-' + $.Game.data.col_id)) === parseFloat(col_data.position.x) && parseFloat($(this).parent('.' + $.Game.cssClasses.row).attr('data-' + $.Game.data.row_id)) === parseFloat(col_data.position.y);
                    });
                    $.Game.init.drawOptions(col, col_data.options);
                    $.Game.init.drawActions(col, col_data.actions);
                    $.Game.init.drawElements(col, col_data.elements, col_data.position.x, col_data.position.y);
                });
                //Set Option
                $('.' + $.Game.cssClasses.option).click(function () {
                    $.Game.init.setOption($(this));
                });
                $.Game.init.console("Level " + $.Game.options.actual_level + " loaded");
            }
        },
        drawOptions: function (col, options) {
            if (options) {
                if (options.left) {
                    var option = $($.Game.containers.option);
                    option.addClass($.Game.cssClasses.option);
                    option.attr('data-' + $.Game.data.option, $.Game.data.option_left);
                    option.attr('data-' + $.Game.data.option_active, false);
                    $.Game.init.addTooltip(option, $.Game.tooltip.text_left);
                    option.appendTo(col.children('.' + $.Game.cssClasses.col_options));
                }
                if (options.right) {
                    var option = $($.Game.containers.option);
                    option.addClass($.Game.cssClasses.option);
                    option.attr('data-' + $.Game.data.option, $.Game.data.option_right);
                    option.attr('data-' + $.Game.data.option_active, false);
                    $.Game.init.addTooltip(option, $.Game.tooltip.text_right);
                    option.appendTo(col.children('.' + $.Game.cssClasses.col_options));
                }
                if (options.up) {
                    var option = $($.Game.containers.option);
                    option.addClass($.Game.cssClasses.option);
                    option.attr('data-' + $.Game.data.option, $.Game.data.option_up);
                    option.attr('data-' + $.Game.data.option_active, false);
                    $.Game.init.addTooltip(option, $.Game.tooltip.text_up);
                    option.appendTo(col.children('.' + $.Game.cssClasses.col_options));
                }
                if (options.down) {
                    var option = $($.Game.containers.option);
                    option.addClass($.Game.cssClasses.option);
                    option.attr('data-' + $.Game.data.option, $.Game.data.option_down);
                    option.attr('data-' + $.Game.data.option_active, false);
                    $.Game.init.addTooltip(option, $.Game.tooltip.text_down);
                    option.appendTo(col.children('.' + $.Game.cssClasses.col_options));
                }
            }
        },
        drawActions: function (col, actions) {
            if (actions) {
                if (actions.sum) {
                    var action = $($.Game.containers.action);
                    action.addClass($.Game.cssClasses.action);
                    action.attr('data-' + $.Game.data.action_sum, actions.sum);
                    action.text("VAR+" + actions.sum);
                    action.appendTo(col.children('.' + $.Game.cssClasses.col_actions));
                } else if (actions.subs) {
                    var action = $($.Game.containers.action);
                    action.addClass($.Game.cssClasses.action);
                    action.attr('data-' + $.Game.data.action_subs, actions.subs);
                    action.text("VAR-" + actions.subs);
                    action.appendTo(col.children('.' + $.Game.cssClasses.col_actions));
                } else if (actions.check) {
                    var action = $($.Game.containers.action);
                    action.addClass($.Game.cssClasses.action);
                    action.attr('data-' + $.Game.data.action_check, actions.check);
                    action.text("VAR=" + actions.check + "?");
                    action.appendTo(col.children('.' + $.Game.cssClasses.col_actions));
                }
            }
        },
        drawElements: function (col, elements, x, y) {
            if (elements) {
                if (elements.start) {
                    var element = $($.Game.containers.element);
                    element.addClass($.Game.cssClasses.element);
                    element.attr('data-' + $.Game.data.element, $.Game.data.element_start);
                    element.appendTo(col.children('.' + $.Game.cssClasses.col_elements));
                    $.Game.init.addTooltip(element, $.Game.tooltip.text_key);
                    
                    col.attr('data-' + $.Game.data.col_start, true);

                    $.Game.options.actual_level_start.x = x;
                    $.Game.options.actual_level_start.y = y;
                } else if (elements.end) {
                    var element = $($.Game.containers.element);
                    element.addClass($.Game.cssClasses.element);
                    element.attr('data-' + $.Game.data.element, $.Game.data.element_end);
                    element.appendTo(col.children('.' + $.Game.cssClasses.col_elements));
                    $.Game.init.addTooltip(element, $.Game.tooltip.text_chest);
                    
                    col.attr('data-' + $.Game.data.col_end, true);
                }
            }
        },
        addTooltip: function (element, text) {
            element.attr('data-toggle', 'tooltip');
            element.attr('data-placement', 'top');
            element.attr('title', text);
        },
        console: function (msg) {
            var console = $('.' + $.Game.cssClasses.console);
            console.append('<p>' + msg + '</p>');
            console.scrollTop(console[0].scrollHeight);
        },
        setOption: function (opt) {
            opt.siblings().attr('data-' + $.Game.data.option_active, false);
            opt.attr('data-' + $.Game.data.option_active, true);

            var x = opt.parent('.' + $.Game.cssClasses.col_options).parent('.' + $.Game.cssClasses.col).attr('data-' + $.Game.data.col_id);
            var y = opt.parent('.' + $.Game.cssClasses.col_options).parent('.' + $.Game.cssClasses.col).parent('.' + $.Game.cssClasses.row).attr('data-' + $.Game.data.row_id);
            $.Game.init.console("Setting " + opt.attr('data-' + $.Game.data.option) + " to [" + x + "-" + y + "]");
        },
        setVar: function (v) {
            $.Game.options.var = v;
            $('.' + $.Game.cssClasses.var).text($.Game.options.var);
        },
        moveKey: function (x, y) {
            $('.' + $.Game.cssClasses.element).filter(function () {
                return $(this).attr('data-' + $.Game.data.element) === $.Game.data.element_start;
            }).remove();

            var selector = $('.' + $.Game.cssClasses.col).filter(function () {
                return parseFloat($(this).attr('data-' + $.Game.data.col_id)) === parseFloat(x) && parseFloat($(this).parent('.' + $.Game.cssClasses.row).attr('data-' + $.Game.data.row_id)) === parseFloat(y);
            });

            if (selector.length) {
                var element = $($.Game.containers.element);
                element.addClass($.Game.cssClasses.element);
                element.attr('data-' + $.Game.data.element, $.Game.data.element_start);
                element.appendTo(selector.children('.' + $.Game.cssClasses.col_elements));
                $.Game.init.console("Key moved to " + x + "-" + y);
                return true;
            } else {
                $.Game.init.console("Key can't continue");
                return false;
            }
        },
        getNext: function (col) {
            var options_active = col.children('.' + $.Game.cssClasses.col_options).children('.' + $.Game.cssClasses.option).filter(function () {
                return $(this).attr('data-' + $.Game.data.option_active) === "true";
            });
            var col_x = col.attr('data-' + $.Game.data.col_id);
            var col_y = col.parent('.' + $.Game.cssClasses.row).attr('data-' + $.Game.data.row_id);

            if (options_active.length) {
                if (options_active.attr('data-' + $.Game.data.option) === $.Game.data.option_right) {
                    col_x++;
                } else if (options_active.attr('data-' + $.Game.data.option) === $.Game.data.option_left) {
                    col_x--;
                } else if (options_active.attr('data-' + $.Game.data.option) === $.Game.data.option_up) {
                    col_y--;
                } else if (options_active.attr('data-' + $.Game.data.option) === $.Game.data.option_down) {
                    col_y++;
                } else {
                    $.Game.init.stop();
                }
            } else {
                col_y++;
            }
            return {x: col_x, y: col_y};
        },
        doAction: function (col) {
            var actions = col.children('.' + $.Game.cssClasses.col_actions).children('.' + $.Game.cssClasses.action);
            if (actions.length) {
                if (actions.attr('data-' + $.Game.data.action_sum)) {
                    var var_value = parseFloat($.Game.options.var) + parseFloat(actions.attr('data-' + $.Game.data.action_sum));
                    $.Game.init.console("Now VAR is " + var_value);
                    $.Game.init.setVar(var_value);
                    return true;
                } else if (actions.attr('data-' + $.Game.data.action_subs)) {
                    var var_value = parseFloat($.Game.options.var) - parseFloat(actions.attr('data-' + $.Game.data.action_subs));
                    $.Game.init.console("Now VAR is " + var_value);
                    $.Game.init.setVar(var_value);
                    return true;
                } else if (actions.attr('data-' + $.Game.data.action_check)) {
                    if (parseFloat($.Game.options.var) !== parseFloat(actions.attr('data-' + $.Game.data.action_check))) {
                        $.Game.init.console("VAR is not " + actions.attr('data-' + $.Game.data.action_check));
                        return false;
                    } else {
                        return true;
                    }
                }
            } else {
                return true;
            }
        },
        start: function () {
            var col = $('.' + $.Game.cssClasses.element).filter(function () {
                return $(this).attr('data-' + $.Game.data.element) === $.Game.data.element_start;
            }).parent('.' + $.Game.cssClasses.col_elements).parent('.' + $.Game.cssClasses.col);

            if ($.Game.init.doAction(col)) {
                if (!col.attr('data-' + $.Game.data.col_end)) {
                    setTimeout(function () {
                        if ($.Game.init.moveKey($.Game.init.getNext(col).x, $.Game.init.getNext(col).y)) {
                            $.Game.init.start();
                        } else {
                            $.Game.init.stop();
                        }
                    }, $.Game.options.timeMove);
                } else {
                    $.Game.init.console("YOU WIN");
                    $.Game.init.stop();
                    $.Game.init.nextLevel();
                }
            } else {
                $.Game.init.stop();
            }
        },
        stop: function () {
            $.Game.init.moveKey($.Game.options.actual_level_start.x, $.Game.options.actual_level_start.y);
            $.Game.init.setVar($.Game.levels[$.Game.options.actual_level].var);
            return false;
        },
        nextLevel: function () {
            $.Game.options.actual_level++;
            $.Game.init.draw_grid();
            $.Game.init.draw_level();
            return false;
        }
    };
}
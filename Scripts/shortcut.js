﻿
shortcut = {
	'all_shortcuts': {},
	'add': function (shortcut_combination, callback, opt) {
		var default_options = {
			'type': 'keydown',
			'propagate': false,
			'disable_in_input': false,
			'target': document,
			'keycode': false
		}
		if (!opt) opt = default_options;
		else {
			for (var dfo in default_options) {
				if (typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target;
		if (typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();
		var func = function (e) {
			e = e || window.event;

			if (opt['disable_in_input']) { 
				var element;
				if (e.target) element = e.target;
				else if (e.srcElement) element = e.srcElement;
				if (element.nodeType == 3) element = element.parentNode;

				if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}

			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();

			if (code == 188) character = ",";
			if (code == 190) character = "."; 

			var keys = shortcut_combination.split("+");
			var kp = 0;

			var shift_nums = {
				"`": "~",
				"1": "!",
				"2": "@",
				"3": "#",
				"4": "$",
				"5": "%",
				"6": "^",
				"7": "&",
				"8": "*",
				"9": "(",
				"0": ")",
				"-": "_",
				"=": "+",
				";": ":",
				"'": "\"",
				",": "<",
				".": ">",
				"/": "?",
				"\\": "|"
			}
			var special_keys = {
				'esc': 27,
				'escape': 27,
				'tab': 9,
				'space': 32,
				'return': 13,
				'enter': 13,
				'backspace': 8,
				'scrolllock': 145,
				'scroll_lock': 145,
				'scroll': 145,
				'capslock': 20,
				'caps_lock': 20,
				'caps': 20,
				'numlock': 144,
				'num_lock': 144,
				'num': 144,
				'pause': 19,
				'break': 19,
				'insert': 45,
				'home': 36,
				'delete': 46,
				'end': 35,
				'pageup': 33,
				'page_up': 33,
				'pu': 33,
				'pagedown': 34,
				'page_down': 34,
				'pd': 34,
				'left': 37,
				'up': 38,
				'right': 39,
				'down': 40,
				'f1': 112,
				'f2': 113,
				'f3': 114,
				'f4': 115,
				'f5': 116,
				'f6': 117,
				'f7': 118,
				'f8': 119,
				'f9': 120,
				'f10': 121,
				'f11': 122,
				'f12': 123
			}

			var modifiers = {
				shift: { wanted: false, pressed: false },
				ctrl: { wanted: false, pressed: false },
				alt: { wanted: false, pressed: false },
				meta: { wanted: false, pressed: false }	
			};

			if (e.ctrlKey) modifiers.ctrl.pressed = true;
			if (e.shiftKey) modifiers.shift.pressed = true;
			if (e.altKey) modifiers.alt.pressed = true;
			if (e.metaKey) modifiers.meta.pressed = true;

			for (var i = 0; k = keys[i], i < keys.length; i++) {

				if (k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if (k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if (k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if (k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if (k.length > 1) { 
					if (special_keys[k] == code) kp++;

				} else if (opt['keycode']) {
					if (opt['keycode'] == code) kp++;

				} else { 
					if (character == k) kp++;
					else {
						if (shift_nums[character] && e.shiftKey) { 
							character = shift_nums[character];
							if (character == k) kp++;
						}
					}
				}
			}

			if (kp == keys.length &&
				modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
				modifiers.shift.pressed == modifiers.shift.wanted &&
				modifiers.alt.pressed == modifiers.alt.wanted &&
				modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);

				if (!opt['propagate']) { 

					e.cancelBubble = true;
					e.returnValue = false;

					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
		}
		this.all_shortcuts[shortcut_combination] = {
			'callback': func,
			'target': ele,
			'event': opt['type']
		};
		//Attach the function with the event
		if (ele.addEventListener) ele.addEventListener(opt['type'], func, false);
		else if (ele.attachEvent) ele.attachEvent('on' + opt['type'], func);
		else ele['on' + opt['type']] = func;
	},


	'remove': function (shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete (this.all_shortcuts[shortcut_combination])
		if (!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if (ele.detachEvent) ele.detachEvent('on' + type, callback);
		else if (ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on' + type] = false;
	}
}
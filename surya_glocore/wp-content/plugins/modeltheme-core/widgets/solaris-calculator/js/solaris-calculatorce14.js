(function ($) {
	'use strict';

	function parseMsgs(raw) {
		try {
			return JSON.parse(raw || '[]');
		} catch (e) {
			return [];
		}
	}

	function delay(ms) {
		return new Promise(function (resolve) {
			setTimeout(resolve, ms);
		});
	}

	function mtfeSolarisCalculatorInit(root) {
		if (!root || root.dataset.mtfeScalcInit === '1') {
			return;
		}
		root.dataset.mtfeScalcInit = '1';

		var totalSteps = parseInt(root.getAttribute('data-total-steps') || '5', 10) || 5;
		var detectDelay = parseInt(root.getAttribute('data-detect-delay') || '800', 10) || 800;
		var zipMin = parseInt(root.getAttribute('data-zip-min') || '4', 10) || 4;
		var autoDetectLen = parseInt(root.getAttribute('data-auto-detect-len') || '5', 10) || 5;
		var loaderMsgs = parseMsgs(root.getAttribute('data-loader-msgs'));
		var loaderFinal = root.getAttribute('data-loader-final') || '';
		var stepPrefix = root.getAttribute('data-step-prefix') || 'Step ';
		var locTemplate = root.getAttribute('data-loc-text') || '';
		var textNext = root.getAttribute('data-text-next') || '';
		var textGenerate = root.getAttribute('data-text-generate') || '';

		var state = { spend: null, zip: '', detected: false, roof: null, email: '', shade: null };
		var currentStep = 1;

		var el = function (role) {
			return root.querySelector('[data-role="' + role + '"]');
		};

		var stepLabel = el('step-label');
		var progressFill = el('progress-fill');
		var nodes = root.querySelectorAll('.mtfe-solaris-calculator__node');
		var btnBack = el('nav-back');
		var btnNext = el('nav-next');
		var btnNextText = el('nav-next-text');
		var zipInput = el('input-zip');
		var emailInput = el('input-email');
		var loader = el('loader-overlay');
		var loaderText = el('loader-text');
		var headerBar = el('header-progress');
		var footerBar = el('footer-actions');
		var successEmail = el('success-email');
		var btnDetect = el('btn-detect');
		var detectText = el('detect-text');
		var detectSpin = el('detect-spinner');
		var locBox = el('location-result');
		var locText = el('location-text');

		function getStepPanel(n) {
			return root.querySelector('.mtfe-solaris-calculator__step[data-step="' + n + '"]');
		}

		function setStepLabel(n) {
			if (!stepLabel) {
				return;
			}
			var num = String(n).padStart(2, '0');
			stepLabel.textContent = stepPrefix + num;
		}

		function updateProgressUI(step) {
			setStepLabel(step);
			var pct = totalSteps <= 1 ? 0 : ((step - 1) / (totalSteps - 1)) * 100;
			if (progressFill) {
				progressFill.style.width = pct + '%';
			}
			nodes.forEach(function (node, idx) {
				node.classList.remove('is-active', 'is-past', 'is-inactive');
				if (idx < step - 1) {
					node.classList.add('is-past');
				} else if (idx === step - 1) {
					node.classList.add('is-active');
				} else {
					node.classList.add('is-inactive');
				}
			});
		}

		function validateStep() {
			var ok = false;
			if (currentStep === 1) {
				ok = !!state.spend;
			} else if (currentStep === 2) {
				ok = state.zip.length >= zipMin && state.detected;
			} else if (currentStep === 3) {
				ok = !!state.roof;
			} else if (currentStep === 4) {
				ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
			} else if (currentStep === 5) {
				ok = !!state.shade;
			}
			if (!btnNext) {
				return;
			}
			if (ok) {
				btnNext.classList.remove('is-disabled');
				btnNext.removeAttribute('disabled');
			} else {
				btnNext.classList.add('is-disabled');
				btnNext.setAttribute('disabled', 'disabled');
			}
		}

		function dimSiblings(container, selected) {
			container.querySelectorAll('.mtfe-solaris-calculator__option-btn').forEach(function (b) {
				var isSel = b === selected;
				b.classList.toggle('is-selected', isSel);
				b.classList.toggle('is-dim', !isSel);
			});
		}

		function bindOptionGrid(container, key) {
			if (!container) {
				return;
			}
			container.addEventListener('click', function (e) {
				var btn = e.target.closest('.mtfe-solaris-calculator__option-btn');
				if (!btn || !container.contains(btn)) {
					return;
				}
				var val = btn.getAttribute('data-value');
				state[key] = val;
				dimSiblings(container, btn);
				validateStep();
			});
		}

		bindOptionGrid(el('grid-spend'), 'spend');
		bindOptionGrid(el('grid-roof'), 'roof');
		bindOptionGrid(el('grid-shade'), 'shade');

		if (zipInput) {
			zipInput.addEventListener('input', function () {
				state.zip = zipInput.value.trim();
				validateStep();
				if (state.zip.length >= autoDetectLen && !state.detected) {
					detectLocation();
				}
			});
		}

		if (emailInput) {
			emailInput.addEventListener('input', function () {
				state.email = emailInput.value.trim();
				validateStep();
			});
		}

		function detectLocation() {
			if (!zipInput || state.zip.length < 3) {
				return;
			}
			if (btnDetect) {
				btnDetect.disabled = true;
				btnDetect.classList.add('is-loading');
			}
			setTimeout(function () {
				if (btnDetect) {
					btnDetect.disabled = false;
					btnDetect.classList.remove('is-loading');
				}
				if (locText) {
					locText.textContent = locTemplate;
				}
				if (locBox) {
					locBox.classList.add('is-visible');
				}
				state.detected = true;
				validateStep();
			}, detectDelay);
		}

		if (btnDetect) {
			btnDetect.addEventListener('click', function () {
				detectLocation();
			});
		}

		root.addEventListener('keydown', function (e) {
			if (e.key !== 'Enter') {
				return;
			}
			e.preventDefault();
			if (btnNext && !btnNext.classList.contains('is-disabled') && currentStep <= totalSteps) {
				handleNextClick();
			}
		});

		function goToStep(step) {
			var prev = getStepPanel(currentStep);
			if (prev) {
				prev.classList.remove('is-active');
			}
			currentStep = step;
			var next = getStepPanel(currentStep);
			if (next) {
				next.classList.add('is-active');
			}
			updateProgressUI(currentStep);
			if (btnBack) {
				if (currentStep > 1) {
					btnBack.classList.remove('is-locked');
				} else {
					btnBack.classList.add('is-locked');
				}
			}
			if (btnNextText) {
				btnNextText.textContent = currentStep === totalSteps ? textGenerate : textNext;
			}
			if (window.innerWidth >= 768) {
				if (currentStep === 2 && zipInput) {
					setTimeout(function () {
						zipInput.focus();
					}, 600);
				}
				if (currentStep === 4 && emailInput) {
					setTimeout(function () {
						emailInput.focus();
					}, 600);
				}
			}
			validateStep();
		}

		function prevStep() {
			if (currentStep > 1 && currentStep <= totalSteps) {
				goToStep(currentStep - 1);
			}
		}

		if (btnBack) {
			btnBack.addEventListener('click', prevStep);
		}

		async function handleNextClick() {
			if (!btnNext || btnNext.classList.contains('is-disabled')) {
				return;
			}
			if (document.activeElement && document.activeElement.blur) {
				document.activeElement.blur();
			}

			if (currentStep === totalSteps) {
				await triggerFinalSuccess();
				return;
			}

			btnNext.classList.add('is-loading');
			await delay(400);
			btnNext.classList.remove('is-loading');
			btnNext.classList.add('is-success');
			await delay(600);

			var msgIdx = currentStep - 1;
			var msg = loaderMsgs[msgIdx] || 'Processing...';
			if (loaderText) {
				loaderText.textContent = msg;
			}
			if (loader) {
				loader.classList.add('is-active');
				loader.setAttribute('aria-busy', 'true');
			}

			await delay(1200);
			goToStep(currentStep + 1);

			btnNext.classList.remove('is-success');
			if (loader) {
				loader.classList.remove('is-active');
				loader.setAttribute('aria-busy', 'false');
			}
		}

		if (btnNext) {
			btnNext.addEventListener('click', function () {
				handleNextClick();
			});
		}

		async function triggerFinalSuccess() {
			if (!btnNext) {
				return;
			}
			btnNext.classList.add('is-loading');
			await delay(600);
			btnNext.classList.remove('is-loading');
			btnNext.classList.add('is-success');
			await delay(600);

			if (loaderText) {
				loaderText.textContent = loaderFinal;
			}
			if (loader) {
				loader.classList.add('is-active');
				loader.setAttribute('aria-busy', 'true');
			}

			await delay(1800);

			if (footerBar) {
				footerBar.classList.add('is-hidden');
			}
			if (headerBar) {
				headerBar.classList.add('is-hidden');
			}
			if (successEmail) {
				successEmail.textContent = state.email;
			}

			var prev = getStepPanel(currentStep);
			if (prev) {
				prev.classList.remove('is-active');
			}
			currentStep = 6;
			var fin = getStepPanel(6);
			if (fin) {
				fin.classList.add('is-active');
			}

			if (loader) {
				loader.classList.remove('is-active');
				loader.setAttribute('aria-busy', 'false');
			}
			btnNext.classList.remove('is-success');
		}

		updateProgressUI(1);
		validateStep();
		setStepLabel(1);
		if (btnNextText) {
			btnNextText.textContent = textNext;
		}
	}

	function mtfeSolarisCalculatorBind($scope) {
		var $w = $scope.hasClass('elementor-widget-mtfe-solaris-calculator')
			? $scope
			: $scope.closest('.elementor-widget-mtfe-solaris-calculator');
		var $r = $w.find('.mtfe-solaris-calculator').first();
		if ($r.length) {
			mtfeSolarisCalculatorInit($r[0]);
		}
	}

	function mtfeSolarisCalculatorRegisterHooks() {
		if (typeof elementorFrontend === 'undefined' || !elementorFrontend.hooks) {
			return;
		}
		elementorFrontend.hooks.addAction(
			'frontend/element_ready/mtfe-solaris-calculator.default',
			mtfeSolarisCalculatorBind
		);
	}

	$(function () {
		$('.mtfe-solaris-calculator').each(function () {
			mtfeSolarisCalculatorInit(this);
		});
	});

	if (typeof elementorFrontend !== 'undefined' && elementorFrontend.hooks) {
		mtfeSolarisCalculatorRegisterHooks();
	} else {
		$(window).on('elementor/frontend/init', mtfeSolarisCalculatorRegisterHooks);
	}
})(jQuery);

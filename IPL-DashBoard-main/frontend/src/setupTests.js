// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// CRA/Jest runs in jsdom where IntersectionObserver may be undefined.
// Home page scroll-reveal uses it; provide a minimal polyfill for tests.
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
	class IntersectionObserver {
		constructor(callback) {
			this._callback = callback;
		}

		observe(target) {
			this._callback([{ isIntersecting: true, target }]);
		}

		unobserve() {}

		disconnect() {}
	}

	window.IntersectionObserver = IntersectionObserver;
}

export const softwareDetection = async (content: string, headers: any[]) => {
	try {
		// Define checks for different frameworks
		const frameworkChecks = [
			{
				name: "React",
				checks: [
					{
						name: "React.createElement Pattern",
						pattern: /React.createElement/,
					},
					{
						name: "ReactDOM.render Pattern",
						pattern: /ReactDOM\.render/,
					},
					{
						name: "React.createClass Pattern",
						pattern: /React.createClass/,
					},
					{
						name: "React.Component Pattern",
						pattern: /React\.Component/,
					},
					{
						name: "React.useState Pattern",
						pattern: /React\.useState/,
					},
				],
			},
			{
				name: "Vue.js",
				checks: [
					// Check for specific Vue.js script tags
					{
						name: "Vue.js Script Tag 1",
						pattern: /<script[^>]*src[^>]*vue(\.min)?\.js[^>]*><\/script>/i,
					},
					{
						name: "Vue.js Script Tag 2",
						pattern: /<script[^>]*vue[^>]*><\/script>/i,
					},
					// Check for specific Vue.js attributes
					{
						name: "Vue.js Attribute 1",
						pattern: /<[^>]+\bvue-/i,
					},
					{
						name: "Vue.js Attribute 2",
						pattern: /<[^>]+\b:v-/i,
					},
					// Check for specific Vue.js custom elements
					{
						name: "Vue.js Custom Element",
						pattern: /<[^>]+\bv-(?!model|bind)[^>]*>/i,
					},
					// Check for X-Powered-By header containing "vue"
					{
						name: "X-Powered-By Header",
						pattern: /vue/i,
						header: "x-powered-by",
					},
				],
			},
			{
				name: "Angular",
				checks: [
					// Check for Angular's main module bootstrap
					{
						name: "Angular Bootstrap Module",
						pattern: /platformBrowserDynamic\(\).bootstrapModule/,
					},
					// Check for AngularJS (Angular 1.x) ng-app attribute
					{
						name: "AngularJS ng-app Attribute",
						pattern: /ng-app/,
					},
					// Check for Angular CLI configuration file
					{
						name: "Angular CLI Config",
						pattern: /angular\.json/,
					},
					// Check for Angular X-Powered-By header
					{
						name: "Angular X-Powered-By Header",
						pattern: /angular/i,
						header: "x-powered-by",
					},
				],
			},
			{
				name: "Next.js",
				checks: [
					{
						name: "X-Powered-By Header",
						pattern: /next\.js/i,
						header: "x-powered-by",
					},
					{
						name: "Script Tag Pattern",
						pattern: /<script[^>]+data-reactroot[^>]+__NEXT_DATA__/,
					},
					{
						name: "Meta Tag Pattern",
						pattern: /<meta name="next-head-count" content="(\d+)" \/>/,
					},
					{
						name: "Next.js Page CSS Pattern",
						pattern: /<link rel="stylesheet"[^>]*href="\/_next\/static\/css\//,
					},
					{
						name: "Next.js Image Component Pattern",
						pattern: /<img[^>]+srcset="[^"]+\/_next\/image\?url=/,
					},
					{
						name: "Next.js Script Loader Pattern",
						pattern: /<script[^>]+src="\/_next\/static\/chunks\//,
					},
					{
						name: "Next.js JSON Data Pattern",
						pattern: /<script[^>]+id="__NEXT_DATA__"[^>]+type="application\/json"/,
					},
				],
			},
			{
				name: "Tailwind CSS",
				checks: [
					// Check for Tailwind CSS classes
					{
						name: "Tailwind CSS Class",
						pattern: /class=["'][^"']*bg-/,
					},
					// Check for Tailwind CSS inline styles
					{
						name: "Tailwind CSS Inline Style",
						pattern: /style=["'][^"']*bg-/,
					},
					// Check for Tailwind CSS stylesheet link
					{
						name: "Tailwind CSS Stylesheet Link",
						pattern: /<link[^>]+href=["'][^"']*\/_next\/static\/[^"']*\/css\/[^"']*\.css["'][^>]*\/>/,
					},
					// Check for Tailwind CSS config file
					{
						name: "Tailwind CSS Config File",
						pattern: /tailwind\.(config|config\..+)\.js/,
					},
				],
			},
			{
				name: "Nuxt.js",
				checks: [
					// Check for Nuxt.js script tag
					{
						name: "Nuxt.js Script Tag",
						pattern: /<script[^>]+src=["'][^"']*\/_nuxt\//,
					},
					// Check for Nuxt.js meta tag
					{
						name: "Nuxt.js Meta Tag",
						pattern: /<meta[^>]+name=["']nuxt["'][^>]+content=["'][^"']*nuxt/,
					},
					// Check for Nuxt.js data-n-head attribute
					{
						name: "Nuxt.js data-n-head Attribute",
						pattern: /data-n-head="true"/,
					},
					// Check for Nuxt.js asyncData method
					{
						name: "Nuxt.js asyncData Method",
						pattern: /asyncData\s*\(/,
					},
					// Check for Nuxt.js fetch method
					{
						name: "Nuxt.js fetch Method",
						pattern: /fetch\s*\(/,
					},
				],
			},
			{
				name: "Ruby on Rails",
				checks: [
					// Check for Ruby on Rails CSRF meta tag
					{
						name: "Rails CSRF Meta Tag",
						pattern: /<meta[^>]+name=["']csrf-param["'][^>]+content=["']authenticity_token["'][^>]*>/,
					},
					// Check for Ruby on Rails CSRF token input field
					{
						name: "Rails CSRF Token Input",
						pattern: /<input[^>]+type=["']hidden["'][^>]+name=["']csrfmiddlewaretoken["'][^>]+value=["']/,
					},
					// Check for Rails JavaScript include tag
					{
						name: "Rails JavaScript Include",
						pattern: /<%= javascript_include_tag/,
					},
					// Check for Rails stylesheet include tag
					{
						name: "Rails Stylesheet Include",
						pattern: /<%= stylesheet_link_tag/,
					},
					// Check for Rails image tag
					{
						name: "Rails Image Tag",
						pattern: /<%= image_tag/,
					},
				],
			},
			{
				name: "Django",
				checks: [
					// Check for Django CSRF input field
					{
						name: "Django CSRF Input",
						pattern: /<input[^>]+type=["']hidden["'][^>]+name=["']csrfmiddlewaretoken["'][^>]+value=["']/,
					},
					// Check for Django template tag
					{
						name: "Django Template Tag",
						pattern: /{% csrf_token %}/,
					},
					// Check for Django admin login form
					{
						name: "Django Admin Login Form",
						pattern: /<form[^>]+id=["']login-form["'][^>]+action=["']\/admin\/login\/["'][^>]*>/,
					},
					// Check for Django admin CSS class
					{
						name: "Django Admin CSS Class",
						pattern: /class=["']djinn-theme["']/,
					},
					// Check for Django admin JavaScript include
					{
						name: "Django Admin JavaScript",
						pattern: /<script[^>]+src=["']\/static\/admin\/js\/vendor\/[^"']*["'][^>]*>/,
					},
				],
			},
			{
				name: "Laravel",
				checks: [
					// Check for Laravel asset versioning
					{
						name: "Laravel Asset Versioning",
						pattern: /<script[^>]+src=["']\/js\/app.js\?id=[^"']*["'][^>]*>/,
					},
					// Check for Laravel Blade directive
					{
						name: "Laravel Blade Directive",
						pattern: /@csrf/,
					},
					// Check for Laravel API token meta tag
					{
						name: "Laravel API Token Meta Tag",
						pattern: /<meta name=["']api-token["'] content=["'][^"']*["']>/,
					},
				],
			},
			{
				name: "Bootstrap",
				checks: [
					// Check for Bootstrap CSS class
					{
						name: "Bootstrap CSS Class",
						pattern: /class=["'][^"']*\.navbar/,
					},
					// Check for Bootstrap JavaScript include
					{
						name: "Bootstrap JavaScript Include",
						pattern: /<script[^>]+src=["'][^"']*bootstrap(\.min)?\.js["'][^>]*>/i,
					},
					// Add more Bootstrap checks as needed
				],
			},
			{
				name: "Flask",
				checks: [
					// Check for Flask response header
					{
						name: "Flask Response Header",
						header: "server",
						pattern: /Flask/i,
					},
					// Check for Flask template tag
					{
						name: "Flask Template Tag",
						pattern: /{% for.*in.*%}/,
					},
					// Add more Flask checks as needed
				],
			},
			// 12. Express.js
			{
				name: "Express.js",
				checks: [
					// Check for Express.js response header
					{
						name: "Express.js Response Header",
						header: "x-powered-by",
						pattern: /Express/i,
					},
					// Check for Express.js middleware usage
					{
						name: "Express.js Middleware",
						pattern: /app\.use\(/,
					},
					// Add more Express.js checks as needed
				],
			},
			// 13. Ember.js
			{
				name: "Ember.js",
				checks: [
					// Check for Ember.js script tag
					{
						name: "Ember.js Script Tag",
						pattern: /<script[^>]+src=["'][^"']*ember(\.min)?\.js["'][^>]*>/i,
					},
					// Check for Ember.js application instance
					{
						name: "Ember.js Application Instance",
						pattern: /new\s+Ember\.Application/,
					},
					// Add more Ember.js checks as needed
				],
			},
			// 14. Symfony
			{
				name: "Symfony",
				checks: [
					// Check for Symfony response header
					{
						name: "Symfony Response Header",
						header: "x-powered-by",
						pattern: /Symfony/i,
					},
					// Check for Symfony routing annotation
					{
						name: "Symfony Routing Annotation",
						pattern: /@Route/,
					},
					// Add more Symfony checks as needed
				],
			},
			// 15. Meteor
			{
				name: "Meteor",
				checks: [
					// Check for Meteor script tag
					{
						name: "Meteor Script Tag",
						pattern: /<script[^>]+src=["'][^"']*meteor(\.min)?\.js["'][^>]*>/i,
					},
					// Check for Meteor.connection object
					{
						name: "Meteor Connection Object",
						pattern: /Meteor\.connection\s*=\s*DDP\.connect/,
					},
					// Add more Meteor checks as needed
				],
			},
			// Add more checks for other frameworks as needed
		];
		const detectedSoftwareResults: Record<string, boolean | string> = {};

		if (Object.keys(detectedSoftwareResults).length === 0) {
			detectedSoftwareResults.noneDetected = "No recognizable software frameworks or libraries were detected based on the predefined checks. This may be due to a custom or less common framework, minified/obfuscated code, or the absence of certain identifiable patterns associated with the frameworks being checked.";
		}

		// Iterate through framework checks
		for (const check of frameworkChecks) {
			if (check.checks) {
				// If it's a framework with multiple checks
				for (const subCheck of check.checks) {
					if (subCheck.header) {
						if (Array.isArray(headers)) {
							const poweredByHeader = headers.find(([key]) => key.toLowerCase() === subCheck.header)?.[1];
							if (poweredByHeader && poweredByHeader.match(subCheck.pattern)) {
								detectedSoftwareResults[check.name.toLowerCase()] = true;
								break; // Exit loop once detected
							}
						}
					} else if (subCheck.pattern.test(content)) {
						detectedSoftwareResults[check.name.toLowerCase()] = true;
						break; // Exit loop once detected
					}
				}
			}
		}

		return { detectedSoftwareResults };
	} catch (error: unknown) {
		if (error instanceof Error) {
			return { error: error.message };
		}
		return { error: String(error) };
	}
};

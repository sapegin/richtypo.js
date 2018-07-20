const richtypo = require('richtypo');

// eslint-disable-next-line no-console
const print = t => console.log(t.replace(/\xa0/g, '&nbsp;')); // Make non-breaking spaces visible

richtypo.lang('en');

print(
	richtypo.rich(
		'Welcome to the world of beautiful web typography — only with Richtypo.'
	)
);
print(richtypo.title('Beautiful &amp; Awesome Web Typography with “Richtypo”'));
print(
	richtypo.full('Use "Richtypo" - make typography on your site beautiful.')
);

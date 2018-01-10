fis.set('namespace', 'fe-pc');
fis.set('project.charset', 'utf8');

fis.media('rd')
	.match('**/*.less', {
		parser: fis.plugin('less-2.x'),
		rExt: '.css',
	})

	.match('*.scss', {
	  parser: fis.plugin('node-sass'),
		rExt: '.css'
	})

	.match('*.html', {
	    useMap: true
	})

	.match('*.css', {
		optimizer: fis.plugin('clean-css')
	})

	// .match('*.js', {
	// 	optimizer: fis.plugin('uglify-js')
	// })

	.match('*.{js,css,less,png}', {
	 	useHash: true
	})

	.match('/widget/**', {
	    useSameNameRequire: true
	})

	.match('::package', {
	    postpackager: fis.plugin('loader', {
	        resourceType: 'amd',
	        useInlineMap: true
	    })
	})

	.match('/page/lost/lost.html', {
	  packTo: '/404.html'
	})

	.match('**.tmpl', {
	    parser: fis.plugin('template', {
	        sTag: '<%',
	        eTag: '%>',
	        global: 'template'
	    }),
	    isJsLike: true,
	    release : false
	});

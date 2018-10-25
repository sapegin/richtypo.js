export default function({
	config: { lang },
	title,
	richtypo,
	content,
	pageTitle,
}) {
	return (
		<html lang={lang}>
			<head>
				<meta charset="utf-8" />
				<title>{title}</title>
				<link
					href="https://fonts.googleapis.com/css?family=Vollkorn:400,400italic&subset=latin,latin-ext"
					rel="stylesheet"
				/>
				<link href="example.css" rel="stylesheet" />
			</head>
			<body>
				<h1>{vdo.markSafe(pageTitle)}</h1>
				<div class="content">
					<div class="original">{vdo.markSafe(content)}</div>
					<div class="richtypo">{vdo.markSafe(richtypo)}</div>
				</div>
			</body>
		</html>
	);
}

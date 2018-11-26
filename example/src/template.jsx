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
					href="https://fonts.googleapis.com/css?family=Vollkorn:400,400i,700i&amp;subset=cyrillic,latin-ext"
					rel="stylesheet"
				/>
				<link href="example.css" rel="stylesheet" />
			</head>
			<body>
				<h1>{vdo.markSafe(pageTitle)}</h1>
				<main role="main" class="content">
					<div class="content__column">{vdo.markSafe(content)}</div>
					<div class="content__column">{vdo.markSafe(richtypo)}</div>
				</main>
			</body>
		</html>
	);
}
